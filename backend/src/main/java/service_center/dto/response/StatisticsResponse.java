package service_center.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record StatisticsResponse(
        long totalRequests,
        long newRequests,
        long assignedRequests,
        long inProgressRequests,
        long completedRequests,
        long cancelledRequests,
        long availableMasters,
        long totalSpareParts,
        BigDecimal totalRevenue,
        List<CategoryStat> categoryStats
) {
    public record CategoryStat(String name, long count) {}
}
