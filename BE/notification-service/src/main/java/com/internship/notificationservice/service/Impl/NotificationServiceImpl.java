package com.internship.notificationservice.service.Impl;

import com.internship.notificationservice.dto.NotificationMessage;
import com.internship.notificationservice.model.Notification;
import com.internship.notificationservice.repository.NotificationRepository;
import com.internship.notificationservice.service.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repo;
    private SimpMessagingTemplate template;
    @Override
    public Notification createNotification(Notification notification) {
        Notification saved = repo.save(notification);
        template.convertAndSendToUser(
                saved.getUserId(),
                "/queue/notifications",
                saved
        );
        return repo.save(notification);
    }
    @Override
    public List<Notification> getAllNotificationsByUserId(String userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }
    @Override
    public void markAsRead(String notificationId) {
        Notification noti = repo.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        noti.setRead(true);
        repo.save(noti);
    }

    @Override
    public void handleMultiApplyNotification(NotificationMessage msg) {
        String businessId = msg.getUserId();
        String jobId = msg.getJobId();
        String applyId = msg.getApplyId();
        String studentName = msg.getStudentNames().get(0); // luôn gửi 1 người
        String jobTitle = msg.getTitle(); // reuse title field để truyền job title

        Notification existing = repo.findFirstByUserIdAndJobIdAndTypeAndReadIsFalseOrderByCreatedAtDesc(
                businessId, jobId, "NEW_APPLY"
        ).orElse(null);


        if (existing != null) {
            if (!existing.getStudentNames().contains(studentName)) {
                existing.getStudentNames().add(studentName);
            }

            int count = existing.getStudentNames().size();
            String newMsg = buildGroupMessage(existing.getStudentNames(), jobTitle);

            existing.setCount(count);
            existing.setMessage(newMsg);
            existing.setUpdatedAt(LocalDateTime.now());

            repo.save(existing);
        } else {
            Notification newNoti = Notification.builder()
                    .userId(businessId)
                    .title("Có sinh viên mới ứng tuyển")
                    .message(studentName + " đã ứng tuyển vào công việc: " + jobTitle)
                    .type("NEW_APPLY")
                    .redirectUrl("/business/detail-apply-job /" + applyId)
                    .jobId(jobId)
                    .studentNames(List.of(studentName))
                    .count(1)
                    .read(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            repo.save(newNoti);
        }
    }

    private String buildGroupMessage(List<String> names, String jobTitle) {
        if (names.size() == 1) return names.get(0) + " đã ứng tuyển vào công việc: " + jobTitle;
        if (names.size() == 2) return names.get(0) + ", " + names.get(1) + " đã ứng tuyển vào công việc: " + jobTitle;
        return names.get(0) + ", " + names.get(1) + " và " + (names.size() - 2) + " người khác đã ứng tuyển vào công việc: " + jobTitle;
    }

}
