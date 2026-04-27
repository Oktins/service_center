package service_center.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReviewCreateDto(
        @NotNull(message = "ID заявки обязателен")
        Long serviceRequestId,

        @NotNull
        @Min(value = 1) @Max(value = 5)
        Integer rating,

        String comment
) {}