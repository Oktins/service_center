package service_center.dto.response;


import java.math.BigDecimal;

public record ServiceCatalogResponse(
        Long id,
        String name,
        String description,
        BigDecimal basePrice,
        CategoryResponse category,
        String imageUrl,
        boolean isActive
) {}
