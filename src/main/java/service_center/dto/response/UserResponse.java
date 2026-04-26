package service_center.dto.response;

import service_center.domain.enums.Role;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        String phone,
        Role role,
        boolean isActive,
        LocalDateTime createdAt
) {}