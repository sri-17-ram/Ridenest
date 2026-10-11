package com.saferidekids.service;

import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.saferidekids.entity.*;
import com.saferidekids.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class QrCodeService {

    private final ChildRepository childRepository;
    private final TripChildRepository tripChildRepository;
    private final NotificationService notificationService;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Transactional
    public String generateQrCodeForChild(Long childId) throws WriterException, IOException {
        Child child = childRepository.findById(childId)
                .orElseThrow(() -> new IllegalArgumentException("Child not found: " + childId));

        String token = UUID.randomUUID().toString();
        child.setQrCodeToken(token);

        String qrContent = "SAFERIDE_CHILD:" + childId + ":" + token;
        String qrImagePath = generateQrImage(qrContent, "child_" + childId + ".png");
        child.setQrCodeImagePath(qrImagePath);
        childRepository.save(child);

        log.info("QR code generated for child {}", childId);
        return qrImagePath;
    }

    @Transactional
    public QrScanResult scanQrCode(String qrToken, Long tripId) {
        // Find child by token
        Child child = childRepository.findByQrCodeToken(qrToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid QR code"));

        // Find trip-child record
        TripChild tripChild = tripChildRepository.findByTripIdAndChildId(tripId, child.getId())
                .orElseThrow(() -> new IllegalArgumentException("Child not assigned to this trip"));

        if (tripChild.getPickupStatus() == TripChild.PickupStatus.PICKED_UP) {
            return QrScanResult.builder()
                    .success(false)
                    .message("Child already picked up")
                    .child(child)
                    .build();
        }

        // Confirm pickup
        tripChild.setPickupStatus(TripChild.PickupStatus.PICKED_UP);
        tripChild.setPickupVerifiedByQr(true);
        tripChild.setPickupTime(java.time.LocalDateTime.now());
        tripChildRepository.save(tripChild);

        // Update child status
        child.setTransportStatus(Child.TransportStatus.PICKED_UP);
        childRepository.save(child);

        // Notify parent
        notificationService.sendNotification(
                child.getParent().getUser(),
                tripChild.getTrip(),
                child,
                Notification.NotificationType.CHILD_PICKED_UP,
                "✅ " + child.getFirstName() + " Picked Up",
                child.getFirstName() + " has been safely picked up and is now in the vehicle.",
                Notification.Priority.HIGH
        );

        log.info("QR scan successful for child {} in trip {}", child.getId(), tripId);
        return QrScanResult.builder()
                .success(true)
                .message("Pickup confirmed for " + child.getFirstName())
                .child(child)
                .build();
    }

    private String generateQrImage(String content, String fileName) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, 300, 300);

        Path qrDir = Paths.get(uploadDir, "qrcodes");
        Files.createDirectories(qrDir);
        Path qrPath = qrDir.resolve(fileName);
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", qrPath);

        return "/uploads/qrcodes/" + fileName;
    }

    @lombok.Builder
    @lombok.Data
    public static class QrScanResult {
        private boolean success;
        private String message;
        private Child child;
    }
}
