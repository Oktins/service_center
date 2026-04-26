package service_center.dto.request;

import jakarta.validation.constraints.NotNull;
import service_center.domain.enums.Role;

public record UpdateUserRoleRequest(
        @NotNull(message = "Роль обязательна")
        Role role
) {
}
