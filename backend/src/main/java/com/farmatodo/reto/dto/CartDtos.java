package com.farmatodo.reto.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class CartDtos {
    public static class UpsertItemRequest {
        @NotNull
        public Long customerId;
        @NotNull
        public Long productId;
        @Min(1)
        public Integer quantity;
    }

    public static class RemoveItemRequest {
        @NotNull
        public Long customerId;
        @NotNull
        public Long productId;
    }

    public static class View {
        public Long cartId;
        public Long customerId;
        public List<ViewItem> items;
    }

    public static class ViewItem {
        public Long productId;
        public String productName;
        public Integer quantity;
    }

    public static class CheckoutRequest {
        @NotNull
        public Long customerId;
        @NotBlank
        public String deliveryAddress;
        @NotBlank
        public String cardToken;
    }
}
