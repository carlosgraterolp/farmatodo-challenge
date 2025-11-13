package com.farmatodo.reto.dto;

import java.math.BigDecimal;
import java.util.List;

public class CreateOrderResponse {
    public Long orderId;
    public String status;
    public BigDecimal total;
    public String transactionUuid;

    public List<PaymentAttemptView> attempts;

    public static class PaymentAttemptView {
        public int attemptNumber;
        public boolean approved;
        public String message;
    }
}
