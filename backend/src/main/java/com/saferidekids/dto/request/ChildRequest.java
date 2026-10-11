package com.saferidekids.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChildRequest {
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    private String grade;
    private String section;
    private String bloodGroup;
    private String medicalNotes;
}
