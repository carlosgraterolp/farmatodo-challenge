package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.entity.Product;
import com.farmatodo.reto.entity.ProductSearchLog;
import com.farmatodo.reto.repository.ProductRepository;
import com.farmatodo.reto.repository.ProductSearchLogRepository;
import com.farmatodo.reto.service.ProductService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductSearchLogRepository searchLogRepository;

    @Value("${product.min-stock:0}")
    private Integer minStock;

    public ProductServiceImpl(ProductRepository productRepository,
            ProductSearchLogRepository searchLogRepository) {
        this.productRepository = productRepository;
        this.searchLogRepository = searchLogRepository;
    }

    @Override
    public List<Product> search(String q, Long customerId) {
        String term = Objects.requireNonNullElse(q, "").trim();
        logAsync(term, customerId);
        return productRepository
                .findByNameContainingIgnoreCaseAndStockGreaterThanEqual(term, minStock);
    }

    @Async
    void logAsync(String term, Long customerId) {
        ProductSearchLog log = new ProductSearchLog();
        log.setTerm(term);
        log.setCustomerId(customerId);
        searchLogRepository.save(log);
    }
}
