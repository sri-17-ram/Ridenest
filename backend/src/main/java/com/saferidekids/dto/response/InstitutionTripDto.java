package com.saferidekids.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class InstitutionTripDto {
    private Long tripId;
    private String routeName;
    private String driverName;
    private String vehicleNumber;
    private int totalStudents;
    private int pickedUp;
    private int dropped;
    private String tripStatus;
    private LocalDateTime startTime;
    private String eta;
    private int remainingStops;
    private String gpsStatus;
}
