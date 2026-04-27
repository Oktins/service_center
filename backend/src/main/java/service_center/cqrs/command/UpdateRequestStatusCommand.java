package service_center.cqrs.command;

import service_center.domain.enums.RequestStatus;

public record UpdateRequestStatusCommand(
        Long requestId,
        RequestStatus newStatus
) {
}
