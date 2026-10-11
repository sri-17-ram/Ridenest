package com.saferidekids.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class QrScanResponse {
    private String childName;
    private Long childId;
    private String qrStatus;
    private LocalDateTime pickupTime;
    private String driverName;
    private String vehicleNumber;
    private String routeName;
}
