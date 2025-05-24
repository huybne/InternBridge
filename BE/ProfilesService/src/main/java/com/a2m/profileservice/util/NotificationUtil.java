package com.a2m.profileservice.util;

import com.a2m.profileservice.config.RabbitMQConfig;
import com.a2m.profileservice.dto.message.NotificationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationUtil {

    private final AmqpTemplate amqpTemplate;

    public void sendNotification(String userId, String title, String content, String type, String link) {
        NotificationMessage msg = NotificationMessage.builder()
                .userId(userId)
                .title(title)
                .message(content)
                .type(type)
                .redirectUrl(link)
                .build();

        amqpTemplate.convertAndSend(
                RabbitMQConfig.NOTIFICATION_EXCHANGE,
                "notify.account." + type.toLowerCase(),
                msg
        );
    }
}
