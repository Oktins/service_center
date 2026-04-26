package service_center.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SparePartUsageDto(
        @NotNull(message = "ID запчасти обязателен")
        Long sparePartId,

        @NotNull
        @Min(value = 1, message = "Количество минимум 1")
        Integer quantity
) {}