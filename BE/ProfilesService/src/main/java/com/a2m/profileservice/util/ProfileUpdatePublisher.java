package com.a2m.profileservice.util;

import com.a2m.profileservice.config.RabbitMQConfig;
import com.a2m.profileservice.dto.message.BusinessProfileUpdateMessage;
import com.a2m.profileservice.dto.message.StudentProfileUpdateMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProfileUpdatePublisher {

    private final AmqpTemplate amqpTemplate;

    public void sendStudentProfileUpdate(StudentProfileUpdateMessage msg) {
        amqpTemplate.convertAndSend(
                RabbitMQConfig.PROFILE_EXCHANGE,
                "profile.student.updated",
                msg
        );
    }

    public void sendBusinessProfileUpdate(BusinessProfileUpdateMessage msg) {
        amqpTemplate.convertAndSend(
                RabbitMQConfig.PROFILE_EXCHANGE,
                "profile.business.updated",
                msg
        );
    }
}
