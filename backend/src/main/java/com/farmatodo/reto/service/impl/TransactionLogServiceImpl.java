package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.entity.TransactionLog;
import com.farmatodo.reto.repository.TransactionLogRepository;
import com.farmatodo.reto.service.TransactionLogService;
import org.springframework.stereotype.Service;

@Service
public class TransactionLogServiceImpl implements TransactionLogService {

    private final TransactionLogRepository repo;

    public TransactionLogServiceImpl(TransactionLogRepository repo) {
        this.repo = repo;
    }

    @Override
    public void log(String txUuid, Long orderId, TransactionLog.Event event, String message, String payloadJson) {
        TransactionLog t = new TransactionLog();
        t.setTransactionUuid(txUuid);
        t.setOrderId(orderId);
        t.setEvent(event);
        t.setMessage(message);
        t.setPayload(payloadJson);
        repo.save(t);
    }
}
