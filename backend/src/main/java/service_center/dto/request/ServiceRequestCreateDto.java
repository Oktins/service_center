package service_center.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import service_center.domain.enums.Priority;

public record ServiceRequestCreateDto(
        @NotBlank(message = "Заголовок обязателен")
        String title,

        String description,

        @NotNull(message = "Тип оборудования обязателен")
        Long equipmentTypeId,

        @NotBlank(message = "Адрес обязателен")
        String address,

        Priority priority
) {}