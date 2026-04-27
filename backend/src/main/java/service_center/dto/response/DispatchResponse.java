package service_center.dto.response;

import service_center.domain.enums.DispatchStatus;
import java.time.LocalDateTime;

public record DispatchResponse(
        Long id,
        Long serviceRequestId,
        String serviceRequestTitle,
        Long masterId,
        String masterName,
        LocalDateTime scheduledAt,
        LocalDateTime startedAt,
        LocalDateTime completedAt,
        DispatchStatus status,
        String notes,
        Double latitude,
        Double longitude
) {}