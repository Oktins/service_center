package service_center.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import service_center.domain.enums.Role;
import service_center.dto.response.UserResponse;

public interface UserService {

    UserResponse updateRole(Long userId, Role role);

    Page<UserResponse> getAll(Pageable pageable);

    UserResponse getById(Long userId);

    UserResponse getByEmail(String email);
}
