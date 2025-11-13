package com.farmatodo.reto.repository;

import com.farmatodo.reto.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByNameContainingIgnoreCaseAndStockGreaterThanEqual(String name, Integer stock);
}
