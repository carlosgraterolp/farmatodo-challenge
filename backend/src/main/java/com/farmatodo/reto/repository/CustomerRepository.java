package com.farmatodo.reto.repository;

import com.farmatodo.reto.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByPhone(String phone);

    Optional<Customer> findByEmailIgnoreCase(String email);
}
