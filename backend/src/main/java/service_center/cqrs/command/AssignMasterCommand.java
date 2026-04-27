package service_center.cqrs.command;

public record AssignMasterCommand(
        Long requestId,
        Long masterId
) {
}
