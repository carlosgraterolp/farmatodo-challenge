package com.farmatodo.reto.service;

public interface NotificationService {
    void notifyOrderFailed(Long customerId, Long orderId, String reason);

    void notifyOrderPaid(Long customerId, Long orderId);
}
