package com.saferidekids.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QrScanRequest {
    @NotBlank(message = "QR Code is required")
    private String qrCodeToken;
}
