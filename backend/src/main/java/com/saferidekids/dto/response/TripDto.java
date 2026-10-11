package com.saferidekids.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class TripDto {
    private Long id;
    private String date;
    private String type;
    private String status;
    private String scheduledTime;
    private String endTime;
    private Double distance;
    private Integer duration;
    private String institution;
    private List<TripChildDto> children;
    private DriverDto driver;
    private VehicleDto vehicle;
    private RouteDto route;
    private com.saferidekids.entity.GpsLog gps;
    private Integer eta;

    @Data
    @Builder
    public static class DriverDto {
        private Long id;
        private String name;
        private String phone;
    }

    @Data
    @Builder
    public static class VehicleDto {
        private Long id;
        private String number;
        private String type;
    }

    @Data
    @Builder
    public static class RouteDto {
        private Long id;
        private String name;
    }
}
