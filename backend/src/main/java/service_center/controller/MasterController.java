package service_center.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service_center.dto.response.MasterResponse;
import service_center.service.MasterService;

@RestController
@RequestMapping("/api/masters")
@RequiredArgsConstructor
public class MasterController {

    private final MasterService masterService;

    // 1. Создать профиль мастера (для существующего пользователя с ролью MASTER)
    @PostMapping("/user/{userId}")
    public ResponseEntity<MasterResponse> createProfile(
            @PathVariable Long userId,
            @RequestParam String specialization,
            @RequestParam Integer experienceYears) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(masterService.createProfile(userId, specialization, experienceYears));
    }

    // 2. Получить профиль по ID мастера
    @GetMapping("/{id}")
    public ResponseEntity<MasterResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(masterService.getById(id));
    }

    // 3. Получить профиль мастера по ID пользователя (User)
    @GetMapping("/user/{userId}")
    public ResponseEntity<MasterResponse> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(masterService.getByUserId(userId));
    }

    // 4. Получить список всех мастеров (с пагинацией)
    @GetMapping
    public ResponseEntity<Page<MasterResponse>> getAll(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(masterService.getAll(pageable));
    }

    // 5. Получить список только доступных мастеров (для назначения на выезд)
    @GetMapping("/available")
    public ResponseEntity<Page<MasterResponse>> getAvailableMasters(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(masterService.getAvailableMasters(pageable));
    }

    // 6. Изменить статус доступности мастера (например, когда он ушел в отпуск)
    @PatchMapping("/{id}/availability")
    public ResponseEntity<MasterResponse> updateAvailability(
            @PathVariable Long id,
            @RequestParam boolean isAvailable) {
        return ResponseEntity.ok(masterService.updateAvailability(id, isAvailable));
    }
}
