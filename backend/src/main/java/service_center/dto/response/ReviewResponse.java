package service_center.dto.response;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long serviceRequestId,
        String clientName,
        String masterName,
        Integer rating,
        String comment,
        LocalDateTime createdAt
) {}