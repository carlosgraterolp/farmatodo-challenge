package com.farmatodo.reto.service.impl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @Test
    void tryCharge_withZeroRejection_shouldAlwaysApprove() {
        // Arrange
        ReflectionTestUtils.setField(paymentService, "rejectionPercentage", 0);

        // Act & Assert - test multiple times for randomness
        for (int i = 0; i < 10; i++) {
            assertTrue(paymentService.tryCharge("token", new BigDecimal("100.00")));
        }
    }

    @Test
    void tryCharge_with100Rejection_shouldAlwaysReject() {
        // Arrange
        ReflectionTestUtils.setField(paymentService, "rejectionPercentage", 100);

        // Act & Assert - test multiple times for randomness
        for (int i = 0; i < 10; i++) {
            assertFalse(paymentService.tryCharge("token", new BigDecimal("100.00")));
        }
    }

    @Test
    void tryCharge_withPartialRejection_shouldHaveMixedResults() {
        // Arrange
        ReflectionTestUtils.setField(paymentService, "rejectionPercentage", 50);

        int approvals = 0;
        int rejections = 0;

        // Act - run many times to verify probabilistic behavior
        for (int i = 0; i < 100; i++) {
            if (paymentService.tryCharge("token", new BigDecimal("100.00"))) {
                approvals++;
            } else {
                rejections++;
            }
        }

        // Assert - both should happen (with very high probability)
        assertTrue(approvals > 0, "Should have some approvals");
        assertTrue(rejections > 0, "Should have some rejections");
    }
}
