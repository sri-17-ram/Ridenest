package com.saferidekids.service;

import com.saferidekids.entity.*;
import com.saferidekids.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public Notification sendNotification(User recipient, Trip trip, Child child,
                                          Notification.NotificationType type,
                                          String title, String message,
                                          Notification.Priority priority) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .trip(trip)
                .child(child)
                .type(type)
                .title(title)
                .message(message)
                .priority(priority)
                .build();

        notification = notificationRepository.save(notification);

        // FCM push notification (pluggable)
        sendFcmNotification(recipient, title, message, type);

        log.info("Notification sent to user {} - {}: {}", recipient.getEmail(), type, title);
        return notification;
    }

    private void sendFcmNotification(User recipient, String title, String message, Notification.NotificationType type) {
        // FCM integration placeholder
        // When Firebase is configured:
        // Message fcmMessage = Message.builder()
        //     .setNotification(Notification.builder().setTitle(title).setBody(message).build())
        //     .setToken(recipient.getFcmToken())
        //     .build();
        // FirebaseMessaging.getInstance().send(fcmMessage);
        log.debug("FCM notification queued for {} - {}", recipient.getEmail(), title);
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
