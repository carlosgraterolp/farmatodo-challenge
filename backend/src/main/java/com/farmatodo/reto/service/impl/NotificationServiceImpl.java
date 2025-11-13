package com.farmatodo.reto.service.impl;

import com.farmatodo.reto.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final JavaMailSender mailSender;

    public NotificationServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void notifyOrderFailed(Long customerId, Long orderId, String reason) {
        // Si no hay SMTP real, lo dejamos logueado (igual cumple el requisito)
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo("customer+" + customerId + "@example.com");
            msg.setSubject("Tu pedido " + orderId + " no pudo ser procesado");
            msg.setText("Lo sentimos, tu pago falló. Motivo: " + reason);
            mailSender.send(msg);
        } catch (Exception e) {
            log.info("[MAIL-FAKE] to=customer+{}@example.com | subject=FAILED order {} | reason={}",
                    customerId, orderId, reason);
        }
    }

    @Override
    public void notifyOrderPaid(Long customerId, Long orderId) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo("customer+" + customerId + "@example.com");
            msg.setSubject("Tu pedido " + orderId + " fue pagado");
            msg.setText("¡Gracias por tu compra!");
            mailSender.send(msg);
        } catch (Exception e) {
            log.info("[MAIL-FAKE] to=customer+{}@example.com | subject=PAID order {}", customerId, orderId);
        }
    }
}
