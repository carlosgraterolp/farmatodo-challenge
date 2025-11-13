package com.farmatodo.reto.controller;

import com.farmatodo.reto.repository.TransactionLogRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
public class TransactionLogController {

    private final TransactionLogRepository repo;

    public TransactionLogController(TransactionLogRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{orderId}/logs")
    public Object byOrder(@PathVariable Long orderId) {
        return repo.findByOrderIdOrderByCreatedAtAsc(orderId);
    }

    @GetMapping("/uuid/{tx}/logs")
    public Object byTx(@PathVariable String tx) {
        return repo.findByTransactionUuidOrderByCreatedAtAsc(tx);
    }
}
