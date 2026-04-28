package service_center.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Поле не может быть пустым")
        @Email(message = "Некорректный email")
        String email,

        @NotBlank(message = "Поле не может быть пустым")
        String password
) {}
