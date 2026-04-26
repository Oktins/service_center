package service_center.domain.enums;

public enum DispatchStatus {
    SCHEDULED,
    EN_ROUTE,
    ARRIVED,
    IN_PROGRESS, // Добавили этот статус!
    COMPLETED,
    CANCELLED
}