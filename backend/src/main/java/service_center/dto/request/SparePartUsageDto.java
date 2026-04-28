package service_center.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record SparePartUsageDto(
        @NotNull(message = "Поле обязательно")
        Long sparePartId,

        @NotNull(message = "Поле обязательно")
        @Positive(message = "Значение должно быть положительным")
        Integer quantity
) {}
