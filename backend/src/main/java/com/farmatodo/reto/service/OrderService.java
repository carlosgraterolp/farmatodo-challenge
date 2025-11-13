package com.farmatodo.reto.service;

import com.farmatodo.reto.dto.CreateOrderRequest;
import com.farmatodo.reto.dto.CreateOrderResponse;

public interface OrderService {
    CreateOrderResponse createOrder(CreateOrderRequest request);
}
