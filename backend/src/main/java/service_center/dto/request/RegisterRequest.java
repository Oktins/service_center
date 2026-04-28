package service_center.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Поле не может быть пустым")
        @Email(message = "Некорректный email")
        String email,

        @NotBlank(message = "Поле не может быть пустым")
        @Size(min = 6, message = "Пароль должен содержать минимум 6 символов")
        String password,

        @NotBlank(message = "Поле не может быть пустым")
        String firstName,

        @NotBlank(message = "Поле не может быть пустым")
        String lastName,

        String phone
) {}
