package service_center.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import service_center.dto.response.MasterResponse;

public interface MasterService {
    // Создание профиля мастера для существующего пользователя
    MasterResponse createProfile(Long userId, String specialization, Integer experienceYears);

    MasterResponse getById(Long id);

    MasterResponse getByUserId(Long userId);

    Page<MasterResponse> getAll(Pageable pageable);

    Page<MasterResponse> getAvailableMasters(Pageable pageable);

    MasterResponse updateAvailability(Long id, boolean isAvailable);
}