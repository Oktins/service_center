package service_center.cqrs.command;

import service_center.domain.enums.Priority;

public record CreateServiceRequestCommand(
        Long clientId,
        Long equipmentTypeId,
        String description,
        String address,
        Priority priority
) {
}
