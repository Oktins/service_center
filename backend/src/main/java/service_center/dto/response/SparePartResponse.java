package service_center.dto.response;

import java.math.BigDecimal;

public record SparePartResponse(
        Long id,
        String name,
        String article,
        String description,
        int quantity,
        String unit,
        BigDecimal price,
        int minQuantity,
        boolean lowStock
) {}