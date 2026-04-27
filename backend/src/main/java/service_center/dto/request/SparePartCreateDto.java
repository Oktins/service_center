package service_center.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record SparePartCreateDto(
        @NotBlank(message = "Название обязательно")
        String name,

        String article,
        String description,

        @Min(value = 0, message = "Количество не может быть отрицательным")
        int quantity,

        String unit,

        @NotNull
        @Min(value = 0)
        BigDecimal price,

        int minQuantity
) {}