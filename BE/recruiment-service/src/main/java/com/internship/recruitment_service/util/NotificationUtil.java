package com.internship.recruitment_service.util;

import com.internship.recruitment_service.dto.message.MultiApplyNotificationMessage;
import com.internship.recruitment_service.dto.message.NotificationMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

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

        amqpTemplate.convertAndSend("notification.exchange", "notify.account." + type.toLowerCase(), msg);
    }
    public void sendMultiApplyNotification(String userId, String jobId, String title,
                                           String content, String redirectUrl,
                                           List<String> studentNames) {
        MultiApplyNotificationMessage msg = MultiApplyNotificationMessage.builder()
                .userId(userId)
                .jobId(jobId)
                .title(title)
                .message(content)
                .type("NEW_APPLY")
                .redirectUrl(redirectUrl)
                .studentNames(studentNames)
                .count(studentNames.size())
                .build();

        // 👇 CHỈNH routingKey cho đúng để consumer nhận dạng
        amqpTemplate.convertAndSend("notification.exchange", "notify.account.new_apply", msg);
    }

}
