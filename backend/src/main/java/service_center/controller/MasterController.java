package service_center.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import service_center.dto.response.MasterResponse;
import service_center.service.MasterService;

@RestController
@RequestMapping("/api/masters")
@RequiredArgsConstructor
public class MasterController {

    private final MasterService masterService;

    @PostMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN','MASTER')")
    public ResponseEntity<MasterResponse> createProfile(
            @PathVariable Long userId,
            @RequestParam String specialization,
            @RequestParam Integer experienceYears) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(masterService.createProfile(userId, specialization, experienceYears));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MasterResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(masterService.getById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<MasterResponse> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(masterService.getByUserId(userId));
    }

    @GetMapping
    public ResponseEntity<Page<MasterResponse>> getAll(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(masterService.getAll(pageable));
    }

    @GetMapping("/available")
    public ResponseEntity<Page<MasterResponse>> getAvailableMasters(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(masterService.getAvailableMasters(pageable));
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<MasterResponse> updateAvailability(
            @PathVariable Long id,
            @RequestParam boolean isAvailable) {
        return ResponseEntity.ok(masterService.updateAvailability(id, isAvailable));
    }
}
