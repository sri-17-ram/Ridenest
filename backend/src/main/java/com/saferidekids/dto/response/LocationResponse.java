package com.saferidekids.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationResponse {
    private Long id;
    private String type;
    private Double latitude;
    private Double longitude;
    private String address;
    private String landmark;
    private String nickname;
    private boolean isDefault;
    private LocalDateTime createdAt;
}
