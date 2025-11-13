package com.farmatodo.reto.service;

import java.math.BigDecimal;

public interface PaymentService {
    boolean tryCharge(String cardToken, BigDecimal amount);
}
