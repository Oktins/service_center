package service_center.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
        @NotBlank(message = "Поле не может быть пустым")
        String refreshToken
) {}
