package com.farmatodo.reto.repository;

import com.farmatodo.reto.entity.TransactionLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionLogRepository extends JpaRepository<TransactionLog, Long> {
    List<TransactionLog> findByTransactionUuidOrderByCreatedAtAsc(String transactionUuid);

    List<TransactionLog> findByOrderIdOrderByCreatedAtAsc(Long orderId);
}
