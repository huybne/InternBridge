package com.internship.notificationservice.service;

import com.internship.notificationservice.dto.NotificationMessage;
import com.internship.notificationservice.model.Notification;

import java.util.List;

public interface NotificationService {

    Notification createNotification(Notification notification);

    List<Notification> getAllNotificationsByUserId(String userId);

    void markAsRead(String notificationId);

    void handleMultiApplyNotification(NotificationMessage msg);
}