package com.farmatodo.reto.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class CreateOrderRequest {

    @NotNull
    public Long customerId;

    @NotBlank
    public String deliveryAddress;

    @NotBlank
    public String cardToken;

    @NotEmpty
    public List<Item> items;

    public static class Item {
        @NotNull
        public Long productId;
        @Min(1)
        public Integer quantity;
    }
}
