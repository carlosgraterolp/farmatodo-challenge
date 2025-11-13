package com.farmatodo.reto.service;

import com.farmatodo.reto.dto.CreateCustomerRequest;
import com.farmatodo.reto.dto.CustomerDto;

public interface CustomerService {
    CustomerDto create(CreateCustomerRequest req);
}
