/**
 * Order service implementation - handles order creation and payment processing
 */
package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.dto.CreateOrderRequest;
import com.farmatodo.reto.dto.CreateOrderResponse;
import com.farmatodo.reto.entity.Order;
import com.farmatodo.reto.entity.OrderItem;
import com.farmatodo.reto.entity.PaymentAttempt;
import com.farmatodo.reto.entity.Product;
import com.farmatodo.reto.entity.TransactionLog;
import com.farmatodo.reto.repository.*;
import com.farmatodo.reto.service.NotificationService;
import com.farmatodo.reto.service.OrderService;
import com.farmatodo.reto.service.PaymentService;
import com.farmatodo.reto.service.TransactionLogService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PaymentAttemptRepository paymentAttemptRepository;
    private final PaymentService paymentService;
    private final NotificationService notificationService;
    private final TransactionLogService tlog;

    @Value("${payment.max-retries:3}")
    private int maxRetries;

    public OrderServiceImpl(OrderRepository orderRepository,
            ProductRepository productRepository,
            PaymentAttemptRepository paymentAttemptRepository,
            PaymentService paymentService,
            NotificationService notificationService,
            TransactionLogService tlog) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.paymentAttemptRepository = paymentAttemptRepository;
        this.paymentService = paymentService;
        this.notificationService = notificationService;
        this.tlog = tlog;
    }

    /** Create order: validate products, calculate total, process payment with retries */
    @Override
    @Transactional
    public CreateOrderResponse createOrder(CreateOrderRequest req) {
        // Step 1: Load products and calculate total
        Map<Long, Product> map = productRepository.findAllById(
                req.items.stream().map(i -> i.productId).toList()).stream()
                .collect(HashMap::new, (m, p) -> m.put(p.getId(), p), HashMap::putAll);

        Order order = new Order();
        order.setCustomerId(req.customerId);
        order.setDeliveryAddress(req.deliveryAddress);
        order.setCardToken(req.cardToken);

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (CreateOrderRequest.Item it : req.items) {
            Product p = map.get(it.productId);
            if (p == null)
                throw new IllegalArgumentException("Producto id=" + it.productId + " no existe");
            if (p.getStock() < it.quantity)
                throw new IllegalArgumentException("Stock insuficiente para " + p.getName());

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProductId(p.getId());
            oi.setProductName(p.getName());
            oi.setQuantity(it.quantity);
            oi.setUnitPrice(p.getPrice());

            items.add(oi);
            total = total.add(p.getPrice().multiply(BigDecimal.valueOf(it.quantity)));
        }

        order.setItems(items);
        order.setTotal(total);
        order = orderRepository.save(order);

        // Log order creation
        tlog.log(order.getTransactionUuid(), order.getId(),
                TransactionLog.Event.ORDER_CREATED, "Order created",
                "{\"customerId\":" + order.getCustomerId() + ",\"total\":" + order.getTotal() + "}");

        // Step 2: Payment attempts with retries
        boolean approved = false;
        int attempts = 0;
        List<CreateOrderResponse.PaymentAttemptView> views = new ArrayList<>();

        while (attempts < maxRetries && !approved) {
            attempts++;
            approved = paymentService.tryCharge(req.cardToken, total);

            PaymentAttempt pa = new PaymentAttempt();
            pa.setOrderId(order.getId());
            pa.setAttemptNumber(attempts);
            pa.setApproved(approved);
            pa.setMessage(approved ? "APPROVED" : "REJECTED");
            paymentAttemptRepository.save(pa);

            // Log: PAYMENT_ATTEMPT
            tlog.log(order.getTransactionUuid(), order.getId(),
                    TransactionLog.Event.PAYMENT_ATTEMPT,
                    pa.getMessage(),
                    "{\"attempt\":" + attempts + ",\"approved\":" + approved + "}");

            CreateOrderResponse.PaymentAttemptView v = new CreateOrderResponse.PaymentAttemptView();
            v.attemptNumber = attempts;
            v.approved = approved;
            v.message = pa.getMessage();
            views.add(v);
        }

        if (approved) {
            order.setStatus(Order.Status.PAID);
            // descontar stock
            for (OrderItem it : items) {
                Product p = map.get(it.getProductId());
                p.setStock(p.getStock() - it.getQuantity());
            }
            productRepository.saveAll(map.values());
            orderRepository.save(order);
            notificationService.notifyOrderPaid(order.getCustomerId(), order.getId());

            // Log: ORDER_PAID
            tlog.log(order.getTransactionUuid(), order.getId(),
                    TransactionLog.Event.ORDER_PAID, "Order paid", null);

        } else {
            order.setStatus(Order.Status.FAILED);
            orderRepository.save(order);
            notificationService.notifyOrderFailed(order.getCustomerId(), order.getId(), "Max retries exceeded");

            // Log: ORDER_FAILED
            tlog.log(order.getTransactionUuid(), order.getId(),
                    TransactionLog.Event.ORDER_FAILED, "Order failed", "{\"reason\":\"retries_exceeded\"}");
        }

        // 3) Respuesta
        CreateOrderResponse res = new CreateOrderResponse();
        res.orderId = order.getId();
        res.status = order.getStatus().name();
        res.total = order.getTotal();
        res.transactionUuid = order.getTransactionUuid();
        res.attempts = views;
        return res;
    }
}
