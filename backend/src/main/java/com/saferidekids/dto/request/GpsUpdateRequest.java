package com.saferidekids.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class GpsUpdateRequest {

    @NotNull
    private Long tripId;

    @NotNull
    @DecimalMin("-90.0")
    @DecimalMax("90.0")
    private Double latitude;

    @NotNull
    @DecimalMin("-180.0")
    @DecimalMax("180.0")
    private Double longitude;

    private Double speed;
    private Double accuracy;
    private Double heading;
    private Double altitude;

    // Accident detection fields
    private Double gForce;
    private Boolean suddenStop;
}
