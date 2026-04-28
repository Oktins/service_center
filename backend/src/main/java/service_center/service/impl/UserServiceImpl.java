package service_center.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service_center.domain.entity.User;
import service_center.domain.enums.Role;
import service_center.domain.exception.BusinessException;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.request.CreateUserRequest;
import service_center.dto.response.UserResponse;
import service_center.repository.UserRepository;
import service_center.service.UserService;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Пользователь с таким email уже существует");
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .role(request.role())
                .isActive(true)
                .build();

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateRole(Long userId, Role role) {
        User user = findUser(userId);
        validateNotCurrentUser(user);

        Role oldRole = user.getRole();
        user.setRole(role);
        User savedUser = userRepository.save(user);

        log.info("User #{} role changed: {} -> {}", userId, oldRole, role);
        return mapToResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getById(Long userId) {
        return mapToResponse(findUser(userId));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден с email: " + email));
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден с ID: " + userId));
    }

    private void validateNotCurrentUser(User user) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && user.getEmail().equals(authentication.getName())) {
            throw new IllegalArgumentException("Cannot change your own role");
        }
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhone(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt()
        );
    }
}
