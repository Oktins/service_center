package service_center.dto.response;

public record StatisticsResponse(
        long totalRequests,
        long newRequests,
        long assignedRequests,
        long inProgressRequests,
        long completedRequests,
        long cancelledRequests,
        long availableMasters,
        long totalSpareParts
) {}
