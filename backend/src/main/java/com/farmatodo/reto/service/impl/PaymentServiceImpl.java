package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${payment.rejection-percentage:30}")
    private int rejectionPercentage; // 0..100

    @Override
    public boolean tryCharge(String cardToken, BigDecimal amount) {
        // Simulación: si random [0..99] < (100 - rechazo) => aprueba
        int r = ThreadLocalRandom.current().nextInt(100);
        return r >= rejectionPercentage;
    }
}
