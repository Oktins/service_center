package service_center.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SparePartUsageResponse(
        Long id,
        Long serviceRequestId,
        Long sparePartId,
        String sparePartName,
        Integer quantity,
        BigDecimal pricePerUnit,
        LocalDateTime createdAt
) {}
