package service_center.domain.event;

import service_center.domain.enums.RequestStatus;

import java.time.LocalDateTime;

public record RequestStatusChangedEvent(
        Long requestId,
        RequestStatus oldStatus,
        RequestStatus newStatus,
        LocalDateTime changedAt
) {
}
