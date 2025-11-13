package com.farmatodo.reto.service;

import com.farmatodo.reto.dto.CartDtos;

public interface CartService {
    CartDtos.View get(Long customerId);

    CartDtos.View upsertItem(CartDtos.UpsertItemRequest req);

    CartDtos.View removeItem(CartDtos.RemoveItemRequest req);

    void clear(Long customerId);

    Object checkout(CartDtos.CheckoutRequest req);
}
