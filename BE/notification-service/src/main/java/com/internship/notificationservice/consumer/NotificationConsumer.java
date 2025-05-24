package com.internship.notificationservice.consumer;

import com.internship.notificationservice.config.RabbitMQConfig;
import com.internship.notificationservice.dto.NotificationMessage;
import com.internship.notificationservice.model.Notification;
import com.internship.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationService service;

    @RabbitListener(queues = RabbitMQConfig.QUEUE)
    public void handle(NotificationMessage msg,
                       @Header("amqp_receivedRoutingKey") String routingKey) {

        if ("notify.account.new_apply".equals(routingKey)) {
            // Noti nhóm dành cho business khi có nhiều student apply
            service.handleMultiApplyNotification(msg);
            return;
        }

        // Mặc định là thông báo đơn (cho student)
        Notification notification = Notification.builder()
                .userId(msg.getUserId())
                .title(msg.getTitle())
                .message(msg.getMessage())
                .type(msg.getType() != null ? msg.getType() : routingKey)
                .redirectUrl(msg.getRedirectUrl())
                .jobId(msg.getJobId())
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        service.createNotification(notification);
    }

}
