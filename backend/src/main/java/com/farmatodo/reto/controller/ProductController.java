package com.farmatodo.reto.controller;

import com.farmatodo.reto.entity.Product;
import com.farmatodo.reto.service.ProductService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> search(@RequestParam String q,
            @RequestParam(required = false) Long customerId) {
        return service.search(q, customerId);
    }
}
