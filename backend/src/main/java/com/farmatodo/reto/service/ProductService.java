package com.farmatodo.reto.service;

import com.farmatodo.reto.entity.Product;
import java.util.List;

public interface ProductService {
    List<Product> search(String q, Long customerId);
}
