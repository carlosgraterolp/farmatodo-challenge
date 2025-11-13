package com.farmatodo.reto.service;

import com.farmatodo.reto.entity.TransactionLog;

public interface TransactionLogService {
    void log(String txUuid, Long orderId, TransactionLog.Event event, String message, String payloadJson);
}
