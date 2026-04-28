package service_center.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record NewsCreateDto(
        @NotBlank(message = "Поле не может быть пустым")
        String title,

        @NotBlank(message = "Поле не может быть пустым")
        String content,

        String imageUrl,
        boolean isPromotion,
        LocalDateTime expiresAt
) {}
