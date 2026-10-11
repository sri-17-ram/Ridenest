package com.saferidekids.dto.response;

import com.saferidekids.entity.User;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private Long userId;
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String name;
    private User.Role role;
    private boolean verified;
}
