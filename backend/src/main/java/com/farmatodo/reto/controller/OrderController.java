package com.farmatodo.reto.controller;

import com.farmatodo.reto.dto.CreateOrderRequest;
import com.farmatodo.reto.dto.CreateOrderResponse;
import com.farmatodo.reto.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public CreateOrderResponse create(@Valid @RequestBody CreateOrderRequest req) {
        return orderService.createOrder(req);
    }
}
