package service_center.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import service_center.domain.enums.Role;

public record CreateUserRequest(
        @NotBlank(message = "Поле не может быть пустым")
        String firstName,

        @NotBlank(message = "Поле не может быть пустым")
        String lastName,

        @NotBlank(message = "Поле не может быть пустым")
        @Email(message = "Некорректный email")
        String email,

        @NotBlank(message = "Поле не может быть пустым")
        @Size(min = 6, message = "Пароль должен содержать минимум 6 символов")
        String password,

        @NotNull(message = "Поле обязательно")
        Role role
) {
}
