package service_center.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record SparePartCreateDto(
        @NotBlank(message = "Поле не может быть пустым")
        String name,

        String article,
        String description,

        @Positive(message = "Значение должно быть положительным")
        int quantity,

        String unit,

        @NotNull(message = "Поле обязательно")
        @Positive(message = "Значение должно быть положительным")
        BigDecimal price,

        @Positive(message = "Значение должно быть положительным")
        int minQuantity
) {}
