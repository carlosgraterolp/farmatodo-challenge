package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.dto.CreateOrderRequest;
import com.farmatodo.reto.dto.CreateOrderResponse;
import com.farmatodo.reto.entity.*;
import com.farmatodo.reto.repository.*;
import com.farmatodo.reto.service.NotificationService;
import com.farmatodo.reto.service.PaymentService;
import com.farmatodo.reto.service.TransactionLogService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private PaymentAttemptRepository paymentAttemptRepository;

    @Mock
    private PaymentService paymentService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private TransactionLogService transactionLogService;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Product testProduct;
    private CreateOrderRequest testRequest;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(orderService, "maxRetries", 3);

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setPrice(new BigDecimal("100.00"));
        testProduct.setStock(10);

        CreateOrderRequest.Item item = new CreateOrderRequest.Item();
        item.productId = 1L;
        item.quantity = 2;

        testRequest = new CreateOrderRequest();
        testRequest.customerId = 1L;
        testRequest.deliveryAddress = "Test Address";
        testRequest.cardToken = "token123";
        testRequest.items = List.of(item);
    }

    @Test
    void createOrder_whenPaymentApprovedOnFirstAttempt_shouldCreatePaidOrder() {
        // Arrange
        when(productRepository.findAllById(anyList())).thenReturn(List.of(testProduct));
        when(paymentService.tryCharge(anyString(), any(BigDecimal.class))).thenReturn(true);
        
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            if (order.getId() == null) {
                order.setId(1L);
            }
            return order;
        });

        // Act
        CreateOrderResponse response = orderService.createOrder(testRequest);

        // Assert
        assertNotNull(response);
        assertEquals(Order.Status.PAID.name(), response.status);
        assertEquals(new BigDecimal("200.00"), response.total);
        assertEquals(1, response.attempts.size());
        assertTrue(response.attempts.get(0).approved);

        verify(paymentService, times(1)).tryCharge(anyString(), any(BigDecimal.class));
        verify(paymentAttemptRepository, times(1)).save(any(PaymentAttempt.class));
        verify(notificationService, times(1)).notifyOrderPaid(eq(1L), eq(1L));
        verify(transactionLogService, times(3)).log(anyString(), anyLong(), any(), anyString(), any());
    }

    @Test
    void createOrder_whenPaymentFailsAllRetries_shouldCreateFailedOrder() {
        // Arrange
        when(productRepository.findAllById(anyList())).thenReturn(List.of(testProduct));
        when(paymentService.tryCharge(anyString(), any(BigDecimal.class))).thenReturn(false);
        
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            if (order.getId() == null) {
                order.setId(1L);
            }
            return order;
        });

        // Act
        CreateOrderResponse response = orderService.createOrder(testRequest);

        // Assert
        assertNotNull(response);
        assertEquals(Order.Status.FAILED.name(), response.status);
        assertEquals(3, response.attempts.size());
        assertTrue(response.attempts.stream().noneMatch(a -> a.approved));

        verify(paymentService, times(3)).tryCharge(anyString(), any(BigDecimal.class));
        verify(paymentAttemptRepository, times(3)).save(any(PaymentAttempt.class));
        verify(notificationService, times(1)).notifyOrderFailed(eq(1L), eq(1L), anyString());
        verify(productRepository, never()).saveAll(anyCollection());
    }

    @Test
    void createOrder_whenPaymentSucceedsOnSecondRetry_shouldCreatePaidOrder() {
        // Arrange
        when(productRepository.findAllById(anyList())).thenReturn(List.of(testProduct));
        when(paymentService.tryCharge(anyString(), any(BigDecimal.class)))
                .thenReturn(false)
                .thenReturn(true);
        
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            if (order.getId() == null) {
                order.setId(1L);
            }
            return order;
        });

        // Act
        CreateOrderResponse response = orderService.createOrder(testRequest);

        // Assert
        assertNotNull(response);
        assertEquals(Order.Status.PAID.name(), response.status);
        assertEquals(2, response.attempts.size());
        assertFalse(response.attempts.get(0).approved);
        assertTrue(response.attempts.get(1).approved);

        verify(paymentService, times(2)).tryCharge(anyString(), any(BigDecimal.class));
        verify(notificationService, times(1)).notifyOrderPaid(eq(1L), eq(1L));
    }

    @Test
    void createOrder_whenProductNotFound_shouldThrowException() {
        // Arrange
        when(productRepository.findAllById(anyList())).thenReturn(List.of());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> orderService.createOrder(testRequest)
        );
        assertTrue(exception.getMessage().contains("no existe"));
    }

    @Test
    void createOrder_whenInsufficientStock_shouldThrowException() {
        // Arrange
        testProduct.setStock(1);
        when(productRepository.findAllById(anyList())).thenReturn(List.of(testProduct));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> orderService.createOrder(testRequest)
        );
        assertTrue(exception.getMessage().contains("Stock insuficiente"));
    }

    @Test
    void createOrder_whenSuccessful_shouldDeductStockCorrectly() {
        // Arrange
        when(productRepository.findAllById(anyList())).thenReturn(List.of(testProduct));
        when(paymentService.tryCharge(anyString(), any(BigDecimal.class))).thenReturn(true);
        
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            if (order.getId() == null) {
                order.setId(1L);
            }
            return order;
        });

        // Act
        orderService.createOrder(testRequest);

        // Assert
        ArgumentCaptor<Iterable<Product>> captor = ArgumentCaptor.forClass(Iterable.class);
        verify(productRepository).saveAll(captor.capture());
        
        Product savedProduct = captor.getValue().iterator().next();
        assertEquals(8, savedProduct.getStock()); // 10 - 2
    }

    @Test
    void createOrder_whenMultipleItems_shouldCalculateTotalCorrectly() {
        // Arrange
        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Product 2");
        product2.setPrice(new BigDecimal("50.00"));
        product2.setStock(20);

        CreateOrderRequest.Item item2 = new CreateOrderRequest.Item();
        item2.productId = 2L;
        item2.quantity = 3;
        testRequest.items = Arrays.asList(testRequest.items.get(0), item2);

        when(productRepository.findAllById(anyList())).thenReturn(Arrays.asList(testProduct, product2));
        when(paymentService.tryCharge(anyString(), any(BigDecimal.class))).thenReturn(true);
        
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order order = invocation.getArgument(0);
            if (order.getId() == null) {
                order.setId(1L);
            }
            return order;
        });

        // Act
        CreateOrderResponse response = orderService.createOrder(testRequest);

        // Assert
        assertEquals(new BigDecimal("350.00"), response.total); // (100*2) + (50*3)
    }
}
