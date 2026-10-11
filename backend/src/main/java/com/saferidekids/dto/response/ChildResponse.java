package com.saferidekids.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChildResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String grade;
    private String section;
    private String bloodGroup;
    private String medicalNotes;
    private String qrCodeToken;
    private String transportStatus;
    private String institution;
    private String assignedDriver;
    private String vehicle;
}
