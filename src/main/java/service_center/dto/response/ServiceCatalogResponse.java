package service_center.dto.response;

import service_center.domain.enums.ServiceCategory;

import java.math.BigDecimal;

public record ServiceCatalogResponse(
        Long id,
        String name,
        String description,
        BigDecimal basePrice,
        ServiceCategory category,
        String imageUrl,
        boolean isActive
) {}
