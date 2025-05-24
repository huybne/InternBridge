package com.internship.notificationservice.repository;

import com.internship.notificationservice.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Notification> findFirstByUserIdAndJobIdAndTypeAndReadIsFalseOrderByCreatedAtDesc(
            String userId,
            String jobId,
            String type
    );

}
