package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.dto.CartDtos;
import com.farmatodo.reto.dto.CreateOrderRequest;
import com.farmatodo.reto.dto.CreateOrderResponse;
import com.farmatodo.reto.entity.Cart;
import com.farmatodo.reto.entity.CartItem;
import com.farmatodo.reto.entity.Product;
import com.farmatodo.reto.repository.CartItemRepository;
import com.farmatodo.reto.repository.CartRepository;
import com.farmatodo.reto.repository.ProductRepository;
import com.farmatodo.reto.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private CartServiceImpl cartService;

    private Cart testCart;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        testCart = new Cart();
        testCart.setId(1L);
        testCart.setCustomerId(1L);
        testCart.setItems(new ArrayList<>());

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setPrice(new BigDecimal("100.00"));
        testProduct.setStock(10);
    }

    @Test
    void get_whenCartExists_shouldReturnCart() {
        // Arrange
        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.of(testCart));

        // Act
        CartDtos.View result = cartService.get(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.customerId);
        verify(cartRepository, times(1)).findByCustomerId(1L);
        verify(cartRepository, never()).save(any(Cart.class));
    }

    @Test
    void get_whenCartDoesNotExist_shouldCreateNewCart() {
        // Arrange
        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        CartDtos.View result = cartService.get(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.customerId);
        verify(cartRepository, times(1)).save(any(Cart.class));
    }

    @Test
    void upsertItem_whenCartDoesNotExist_shouldCreateCartAndAddItem() {
        // Arrange
        CartDtos.UpsertItemRequest request = new CartDtos.UpsertItemRequest();
        request.customerId = 1L;
        request.productId = 1L;
        request.quantity = 2;

        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.empty());
        when(productRepository.findAllById(anyList())).thenReturn(List.of(testProduct));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        CartDtos.View result = cartService.upsertItem(request);

        // Assert
        assertNotNull(result);
        verify(cartRepository, times(2)).save(any(Cart.class));
    }

    @Test
    void upsertItem_whenItemDoesNotExistInCart_shouldAddNewItem() {
        // Arrange
        CartDtos.UpsertItemRequest request = new CartDtos.UpsertItemRequest();
        request.customerId = 1L;
        request.productId = 1L;
        request.quantity = 2;

        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.of(testCart));
        when(productRepository.findAllById(anyList())).thenReturn(List.of(testProduct));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        CartDtos.View result = cartService.upsertItem(request);

        // Assert
        assertNotNull(result);
        assertEquals(1, testCart.getItems().size());
        assertEquals(2, testCart.getItems().get(0).getQuantity());
    }

    @Test
    void upsertItem_whenItemExistsInCart_shouldUpdateQuantity() {
        // Arrange
        CartItem existingItem = new CartItem();
        existingItem.setProductId(1L);
        existingItem.setQuantity(2);
        existingItem.setCart(testCart);
        testCart.getItems().add(existingItem);

        CartDtos.UpsertItemRequest request = new CartDtos.UpsertItemRequest();
        request.customerId = 1L;
        request.productId = 1L;
        request.quantity = 5;

        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.of(testCart));
        when(productRepository.findAllById(anyList())).thenReturn(List.of(testProduct));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        CartDtos.View result = cartService.upsertItem(request);

        // Assert
        assertNotNull(result);
        assertEquals(1, testCart.getItems().size());
        assertEquals(5, testCart.getItems().get(0).getQuantity());
    }

    @Test
    void upsertItem_whenProductDoesNotExist_shouldThrowException() {
        // Arrange
        CartDtos.UpsertItemRequest request = new CartDtos.UpsertItemRequest();
        request.customerId = 1L;
        request.productId = 999L;
        request.quantity = 2;

        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.of(testCart));
        when(productRepository.findAllById(anyList())).thenReturn(List.of());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> cartService.upsertItem(request)
        );
        assertTrue(exception.getMessage().contains("no existe"));
    }

    @Test
    void removeItem_whenItemExists_shouldRemoveItem() {
        // Arrange
        CartItem item = new CartItem();
        item.setProductId(1L);
        item.setCart(testCart);
        testCart.getItems().add(item);

        CartDtos.RemoveItemRequest request = new CartDtos.RemoveItemRequest();
        request.customerId = 1L;
        request.productId = 1L;

        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.of(testCart));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        CartDtos.View result = cartService.removeItem(request);

        // Assert
        assertNotNull(result);
        assertTrue(testCart.getItems().isEmpty());
    }

    @Test
    void removeItem_whenCartDoesNotExist_shouldThrowException() {
        // Arrange
        CartDtos.RemoveItemRequest request = new CartDtos.RemoveItemRequest();
        request.customerId = 1L;
        request.productId = 1L;

        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> cartService.removeItem(request));
    }

    @Test
    void clear_whenCartExists_shouldClearItems() {
        // Arrange
        CartItem item = new CartItem();
        item.setProductId(1L);
        testCart.getItems().add(item);

        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.of(testCart));

        // Act
        cartService.clear(1L);

        // Assert
        assertTrue(testCart.getItems().isEmpty());
        verify(cartRepository, times(1)).save(testCart);
    }

    @Test
    void clear_whenCartDoesNotExist_shouldDoNothing() {
        // Arrange
        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.empty());

        // Act
        cartService.clear(1L);

        // Assert
        verify(cartRepository, never()).save(any(Cart.class));
    }

    @Test
    void checkout_whenCartIsEmpty_shouldThrowException() {
        // Arrange
        CartDtos.CheckoutRequest request = new CartDtos.CheckoutRequest();
        request.customerId = 1L;
        request.deliveryAddress = "Test Address";
        request.cardToken = "token123";

        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.of(testCart));

        // Act & Assert
        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> cartService.checkout(request)
        );
        assertTrue(exception.getMessage().contains("vacío"));
    }

    @Test
    void checkout_whenCartHasItems_shouldCreateOrderAndClearCart() {
        // Arrange
        CartItem item = new CartItem();
        item.setProductId(1L);
        item.setProductName("Test Product");
        item.setQuantity(2);
        item.setCart(testCart);
        testCart.getItems().add(item);

        CartDtos.CheckoutRequest request = new CartDtos.CheckoutRequest();
        request.customerId = 1L;
        request.deliveryAddress = "Test Address";
        request.cardToken = "token123";

        CreateOrderResponse orderResponse = new CreateOrderResponse();
        orderResponse.orderId = 1L;
        
        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.of(testCart));
        when(orderService.createOrder(any(CreateOrderRequest.class))).thenReturn(orderResponse);

        // Act
        Object result = cartService.checkout(request);

        // Assert
        assertNotNull(result);
        assertTrue(testCart.getItems().isEmpty());
        verify(orderService, times(1)).createOrder(any(CreateOrderRequest.class));
        verify(cartRepository, times(1)).save(testCart);
    }

    @Test
    void checkout_whenCartDoesNotExist_shouldThrowException() {
        // Arrange
        CartDtos.CheckoutRequest request = new CartDtos.CheckoutRequest();
        request.customerId = 1L;
        request.deliveryAddress = "Test Address";
        request.cardToken = "token123";

        when(cartRepository.findByCustomerId(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> cartService.checkout(request));
    }
}
