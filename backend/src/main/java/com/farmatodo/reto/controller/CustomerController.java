package com.farmatodo.reto.controller;

import com.farmatodo.reto.dto.CreateCustomerRequest;
import com.farmatodo.reto.dto.CustomerDto;
import com.farmatodo.reto.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CustomerDto> create(@RequestBody @Valid CreateCustomerRequest req) {
        CustomerDto dto = service.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
}
