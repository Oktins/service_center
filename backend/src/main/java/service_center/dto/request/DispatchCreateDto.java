package service_center.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record DispatchCreateDto(
        @NotNull(message = "Поле обязательно")
        @Future(message = "Дата выезда должна быть в будущем")
        LocalDateTime scheduledAt,

        String notes
) {}
