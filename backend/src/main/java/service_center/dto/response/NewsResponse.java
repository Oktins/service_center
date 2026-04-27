package service_center.dto.response;

import java.time.LocalDateTime;

public record NewsResponse(
        Long id,
        String title,
        String content,
        String imageUrl,
        boolean isPromotion,
        LocalDateTime createdAt,
        LocalDateTime expiresAt
) {}
