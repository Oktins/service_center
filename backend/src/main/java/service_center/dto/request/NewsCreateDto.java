package service_center.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record NewsCreateDto(
        @NotBlank(message = "Заголовок обязателен")
        String title,

        @NotBlank(message = "Содержание обязательно")
        String content,

        String imageUrl,
        boolean isPromotion,
        LocalDateTime expiresAt
) {}
