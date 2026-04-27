package service_center.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import service_center.domain.enums.ServiceCategory;

import java.math.BigDecimal;

public record ServiceCatalogCreateDto(
        @NotBlank(message = "Название обязательно")
        String name,

        String description,

        @NotNull(message = "Базовая цена обязательна")
        @DecimalMin(value = "0.0", inclusive = true, message = "Базовая цена не может быть отрицательной")
        BigDecimal basePrice,

        @NotNull(message = "Категория обязательна")
        ServiceCategory category,

        String imageUrl,
        boolean isActive
) {}
