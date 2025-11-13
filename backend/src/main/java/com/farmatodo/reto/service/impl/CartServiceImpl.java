package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.dto.CartDtos;
import com.farmatodo.reto.dto.CreateOrderRequest;
import com.farmatodo.reto.entity.Cart;
import com.farmatodo.reto.entity.CartItem;
import com.farmatodo.reto.entity.Product;
import com.farmatodo.reto.repository.CartItemRepository;
import com.farmatodo.reto.repository.CartRepository;
import com.farmatodo.reto.repository.ProductRepository;
import com.farmatodo.reto.service.CartService;
import com.farmatodo.reto.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final OrderService orderService;

    public CartServiceImpl(CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            OrderService orderService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.orderService = orderService;
    }

    @Override
    public CartDtos.View get(Long customerId) {
        Cart cart = cartRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setCustomerId(customerId);
                    return cartRepository.save(c);
                });
        return toView(cart);
    }

    @Override
    @Transactional
    public CartDtos.View upsertItem(CartDtos.UpsertItemRequest req) {
        Cart cart = cartRepository.findByCustomerId(req.customerId)
                .orElseGet(() -> cartRepository.save(newCart(req.customerId)));

        Map<Long, Product> prods = productRepository.findAllById(List.of(req.productId))
                .stream().collect(Collectors.toMap(Product::getId, p -> p));

        Product p = prods.get(req.productId);
        if (p == null)
            throw new IllegalArgumentException("Producto no existe: " + req.productId);

        // si existe el item, actualiza qty; si no, lo crea
        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(req.productId)).findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(req.quantity);
        } else {
            CartItem it = new CartItem();
            it.setCart(cart);
            it.setProductId(p.getId());
            it.setProductName(p.getName());
            it.setQuantity(req.quantity);
            cart.getItems().add(it);
        }

        cart = cartRepository.save(cart);
        return toView(cart);
    }

    @Override
    @Transactional
    public CartDtos.View removeItem(CartDtos.RemoveItemRequest req) {
        Cart cart = cartRepository.findByCustomerId(req.customerId)
                .orElseThrow(() -> new IllegalArgumentException("Carrito no existe"));
        cart.getItems().removeIf(i -> i.getProductId().equals(req.productId));
        cart = cartRepository.save(cart);
        return toView(cart);
    }

    @Override
    @Transactional
    public void clear(Long customerId) {
        cartRepository.findByCustomerId(customerId).ifPresent(c -> {
            c.getItems().clear();
            cartRepository.save(c);
        });
    }

    @Override
    @Transactional
    public Object checkout(CartDtos.CheckoutRequest req) {
        Cart cart = cartRepository.findByCustomerId(req.customerId)
                .orElseThrow(() -> new IllegalArgumentException("Carrito no existe"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Carrito vacío");
        }

        CreateOrderRequest orderReq = new CreateOrderRequest();
        orderReq.customerId = req.customerId;
        orderReq.deliveryAddress = req.deliveryAddress;
        orderReq.cardToken = req.cardToken;
        orderReq.items = cart.getItems().stream().map(ci -> {
            CreateOrderRequest.Item it = new CreateOrderRequest.Item();
            it.productId = ci.getProductId();
            it.quantity = ci.getQuantity();
            return it;
        }).toList();

        Object resp = orderService.createOrder(orderReq);

        cart.getItems().clear();
        cartRepository.save(cart);
        return resp;
    }

    private Cart newCart(Long customerId) {
        Cart c = new Cart();
        c.setCustomerId(customerId);
        return c;
    }

    private CartDtos.View toView(Cart cart) {
        CartDtos.View v = new CartDtos.View();
        v.cartId = cart.getId();
        v.customerId = cart.getCustomerId();
        v.items = cart.getItems().stream().map(ci -> {
            CartDtos.ViewItem iv = new CartDtos.ViewItem();
            iv.productId = ci.getProductId();
            iv.productName = ci.getProductName();
            iv.quantity = ci.getQuantity();
            return iv;
        }).toList();
        return v;
    }
}
