package com.saferidekids.dto.request;

import com.saferidekids.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian phone number")
    private String phoneNumber;

    @NotNull(message = "Role is required")
    private User.Role role;

    // Institution-specific fields
    private String institutionName;
    private String institutionType;
    private String registrationNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;
}
