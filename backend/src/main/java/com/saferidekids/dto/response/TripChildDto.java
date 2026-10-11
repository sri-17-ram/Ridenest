package com.saferidekids.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TripChildDto {
    private Long id; // This is the child's ID or TripChild ID. The frontend uses it as a key. Let's use TripChild ID or Child ID.
    private Long childId;
    private String name;
    private String pickupAddress;
    private String pickupStatus;
    private String dropStatus;
}
