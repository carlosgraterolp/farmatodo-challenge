package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.entity.Product;
import com.farmatodo.reto.entity.ProductSearchLog;
import com.farmatodo.reto.repository.ProductRepository;
import com.farmatodo.reto.repository.ProductSearchLogRepository;
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
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductSearchLogRepository searchLogRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(productService, "minStock", 0);
    }

    @Test
    void search_whenTermMatches_shouldReturnProducts() {
        // Arrange
        Product product1 = createProduct(1L, "Aspirin", 10);
        
        when(productRepository.findByNameContainingIgnoreCaseAndStockGreaterThanEqual("asp", 0))
                .thenReturn(List.of(product1));

        // Act
        List<Product> results = productService.search("asp", 1L);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Aspirin", results.get(0).getName());
        verify(searchLogRepository, timeout(1000)).save(any(ProductSearchLog.class));
    }

    @Test
    void search_whenTermIsNull_shouldSearchWithEmptyString() {
        // Arrange
        Product product1 = createProduct(1L, "Aspirin", 10);
        Product product2 = createProduct(2L, "Ibuprofen", 5);
        
        when(productRepository.findByNameContainingIgnoreCaseAndStockGreaterThanEqual("", 0))
                .thenReturn(Arrays.asList(product1, product2));

        // Act
        List<Product> results = productService.search(null, 1L);

        // Assert
        assertNotNull(results);
        assertEquals(2, results.size());
    }

    @Test
    void search_whenNoMatches_shouldReturnEmptyList() {
        // Arrange
        when(productRepository.findByNameContainingIgnoreCaseAndStockGreaterThanEqual("xyz", 0))
                .thenReturn(List.of());

        // Act
        List<Product> results = productService.search("xyz", 1L);

        // Assert
        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    @Test
    void search_shouldLogSearchAsync() {
        // Arrange
        when(productRepository.findByNameContainingIgnoreCaseAndStockGreaterThanEqual(anyString(), anyInt()))
                .thenReturn(List.of());

        // Act
        productService.search("test", 1L);

        // Assert
        ArgumentCaptor<ProductSearchLog> captor = ArgumentCaptor.forClass(ProductSearchLog.class);
        verify(searchLogRepository, timeout(1000)).save(captor.capture());
        
        ProductSearchLog log = captor.getValue();
        assertEquals("test", log.getTerm());
        assertEquals(1L, log.getCustomerId());
    }

    @Test
    void search_withMinStock_shouldOnlyReturnProductsAboveThreshold() {
        // Arrange
        ReflectionTestUtils.setField(productService, "minStock", 5);
        
        Product product1 = createProduct(1L, "Aspirin", 10);
        
        when(productRepository.findByNameContainingIgnoreCaseAndStockGreaterThanEqual("asp", 5))
                .thenReturn(List.of(product1));

        // Act
        List<Product> results = productService.search("asp", 1L);

        // Assert
        assertNotNull(results);
        assertEquals(1, results.size());
        verify(productRepository).findByNameContainingIgnoreCaseAndStockGreaterThanEqual("asp", 5);
    }

    @Test
    void search_shouldTrimSearchTerm() {
        // Arrange
        when(productRepository.findByNameContainingIgnoreCaseAndStockGreaterThanEqual("aspirin", 0))
                .thenReturn(List.of());

        // Act
        productService.search("  aspirin  ", 1L);

        // Assert
        verify(productRepository).findByNameContainingIgnoreCaseAndStockGreaterThanEqual("aspirin", 0);
    }

    private Product createProduct(Long id, String name, int stock) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setPrice(new BigDecimal("100.00"));
        product.setStock(stock);
        return product;
    }
}
