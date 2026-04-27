package service_center.dto.response;

import service_center.domain.enums.Priority;
import service_center.domain.enums.RequestStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ServiceRequestResponse(
        Long id,
        String title,
        String description,
        String address,
        RequestStatus status,
        Priority priority,
        String equipmentTypeName,
        String clientName,
        String masterName,
        BigDecimal estimatedCost,
        BigDecimal finalCost,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}