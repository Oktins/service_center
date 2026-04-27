package service_center.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service_center.domain.entity.Master;
import service_center.domain.entity.User;
import service_center.domain.enums.Role;
import service_center.domain.exception.BusinessException;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.response.MasterResponse;
import service_center.repository.MasterRepository;
import service_center.repository.UserRepository;
import service_center.service.MasterService;

@Service
@RequiredArgsConstructor
public class MasterServiceImpl implements MasterService {

    private final MasterRepository masterRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public MasterResponse createProfile(Long userId, String specialization, Integer experienceYears) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден с ID: " + userId));

        // Проверяем, что пользователь действительно имеет роль МАСТЕР
        if (user.getRole() != Role.MASTER) {
            throw new BusinessException("Пользователь должен иметь роль MASTER для создания профиля мастера");
        }

        if (masterRepository.existsByUserId(userId)) {
            throw new BusinessException("Профиль мастера уже существует для этого пользователя");
        }

        Master master = Master.builder()
                .user(user)
                .specialization(specialization)
                .experienceYears(experienceYears)
                .isAvailable(true)
                // rating по умолчанию ZERO благодаря инициализации в entity
                .build();

        return mapToResponse(masterRepository.save(master));
    }

    @Override
    @Transactional(readOnly = true)
    public MasterResponse getById(Long id) {
        Master master = masterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Мастер не найден с ID: " + id));
        return mapToResponse(master);
    }

    @Override
    @Transactional(readOnly = true)
    public MasterResponse getByUserId(Long userId) {
        Master master = masterRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Профиль мастера не найден для пользователя с ID: " + userId));
        return mapToResponse(master);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MasterResponse> getAll(Pageable pageable) {
        return masterRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MasterResponse> getAvailableMasters(Pageable pageable) {
        return masterRepository.findAllByIsAvailableTrue(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public MasterResponse updateAvailability(Long id, boolean isAvailable) {
        Master master = masterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Мастер не найден с ID: " + id));

        master.setAvailable(isAvailable);
        return mapToResponse(masterRepository.save(master));
    }

    /**
     * Ручной маппинг из Entity в DTO
     */
    private MasterResponse mapToResponse(Master master) {
        return new MasterResponse(
                master.getId(),
                master.getUser().getId(),
                master.getUser().getFirstName(),
                master.getUser().getLastName(),
                master.getUser().getEmail(),
                master.getSpecialization(),
                master.getExperienceYears(),
                master.getRating(),
                master.isAvailable()
        );
    }
}