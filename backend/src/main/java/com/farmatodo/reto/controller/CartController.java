package com.farmatodo.reto.controller;

import com.farmatodo.reto.dto.CartDtos;
import com.farmatodo.reto.service.CartService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Ver carrito (lo crea si no existe)
    @GetMapping
    public CartDtos.View get(@RequestParam Long customerId) {
        return cartService.get(customerId);
    }

    // Agregar/actualizar item
    @PostMapping("/items")
    public CartDtos.View upsert(@Valid @RequestBody CartDtos.UpsertItemRequest req) {
        return cartService.upsertItem(req);
    }

    // Eliminar item
    @DeleteMapping("/items")
    public CartDtos.View remove(@Valid @RequestBody CartDtos.RemoveItemRequest req) {
        return cartService.removeItem(req);
    }

    // Vaciar carrito
    @DeleteMapping
    public void clear(@RequestParam Long customerId) {
        cartService.clear(customerId);
    }

    // Checkout => crea Order y vacía el carrito
    @PostMapping("/checkout")
    public Object checkout(@Valid @RequestBody CartDtos.CheckoutRequest req) {
        return cartService.checkout(req);
    }
}
