package service_center.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ServiceCatalogCreateDto(
        @NotBlank(message = "Поле не может быть пустым")
        String name,

        String description,

        @NotNull(message = "Поле обязательно")
        @Positive(message = "Значение должно быть положительным")
        BigDecimal basePrice,

        @NotNull(message = "Поле обязательно")
        Long categoryId,

        String imageUrl,
        boolean isActive
) {}
