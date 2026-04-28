package service_center.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import service_center.domain.enums.Priority;

public record ServiceRequestCreateDto(
        @NotBlank(message = "Поле не может быть пустым")
        String title,

        String description,

        @NotNull(message = "Поле обязательно")
        Long equipmentTypeId,

        @NotBlank(message = "Поле не может быть пустым")
        String address,

        @NotNull(message = "Поле обязательно")
        Priority priority
) {}
