package com.farmatodo.reto.repository;

import com.farmatodo.reto.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
