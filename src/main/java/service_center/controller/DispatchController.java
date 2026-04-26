package service_center.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service_center.domain.enums.DispatchStatus;
import service_center.dto.request.DispatchCreateDto;
import service_center.dto.response.DispatchResponse;
import service_center.service.DispatchService;

@RestController
@RequestMapping("/api/dispatches")
@RequiredArgsConstructor
public class DispatchController {

    private final DispatchService dispatchService;

    // 1. Назначить выезд мастера по заявке
    @PostMapping("/request/{serviceRequestId}/master/{masterId}")
    public ResponseEntity<DispatchResponse> create(
            @PathVariable Long serviceRequestId,
            @PathVariable Long masterId,
            @Valid @RequestBody DispatchCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(dispatchService.create(serviceRequestId, masterId, dto));
    }

    // 2. Получить данные конкретного выезда по ID
    @GetMapping("/{id}")
    public ResponseEntity<DispatchResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(dispatchService.getById(id));
    }

    // 3. Найти выезд, привязанный к конкретной заявке
    @GetMapping("/request/{serviceRequestId}")
    public ResponseEntity<DispatchResponse> getByServiceRequestId(@PathVariable Long serviceRequestId) {
        return ResponseEntity.ok(dispatchService.getByServiceRequestId(serviceRequestId));
    }

    // 4. Получить список всех выездов конкретного мастера (пагинация)
    @GetMapping("/master/{masterId}")
    public ResponseEntity<Page<DispatchResponse>> getByMasterId(
            @PathVariable Long masterId,
            Pageable pageable) {
        return ResponseEntity.ok(dispatchService.getByMasterId(masterId, pageable));
    }

    // 5. Получить выезды по статусу (например, все SCHEDULED на сегодня)
    @GetMapping("/status")
    public ResponseEntity<Page<DispatchResponse>> getByStatus(
            @RequestParam DispatchStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(dispatchService.getByStatus(status, pageable));
    }

    // 6. Обновить статус выезда (мастер отмечает прибытие или завершение)
    @PatchMapping("/{id}/status")
    public ResponseEntity<DispatchResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam DispatchStatus status) {
        return ResponseEntity.ok(dispatchService.updateStatus(id, status));
    }
}