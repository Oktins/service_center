package service_center.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service_center.domain.enums.RequestStatus;
import service_center.dto.request.ServiceRequestCreateDto;
import service_center.dto.response.ServiceRequestResponse;
import service_center.service.ServiceRequestService;

@RestController
@RequestMapping("/api/service-requests")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    // 1. Создать заявку (CLIENT)
    @PostMapping
    public ResponseEntity<ServiceRequestResponse> create(
            @RequestParam Long clientId, // В будущем можно брать ID прямо из токена авторизации
            @Valid @RequestBody ServiceRequestCreateDto dto) {
        ServiceRequestResponse response = serviceRequestService.create(clientId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 2. Получить заявку по ID
    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceRequestService.getById(id));
    }

    // 3. Получить все заявки конкретного клиента (с пагинацией)
    @GetMapping("/client/{clientId}")
    public ResponseEntity<Page<ServiceRequestResponse>> getByClientId(
            @PathVariable Long clientId,
            Pageable pageable) {
        return ResponseEntity.ok(serviceRequestService.getByClientId(clientId, pageable));
    }

    // 4. Получить все заявки конкретного мастера (с пагинацией)
    @GetMapping("/master/{masterId}")
    public ResponseEntity<Page<ServiceRequestResponse>> getByMasterId(
            @PathVariable Long masterId,
            Pageable pageable) {
        return ResponseEntity.ok(serviceRequestService.getByMasterId(masterId, pageable));
    }

    // 5. Получить заявки по их статусу (например, все NEW для админа/диспетчера)
    @GetMapping("/status")
    public ResponseEntity<Page<ServiceRequestResponse>> getByStatus(
            @RequestParam RequestStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(serviceRequestService.getByStatus(status, pageable));
    }

    // 6. Сменить статус заявки
    @PutMapping("/{id}/status")
    public ResponseEntity<ServiceRequestResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status) {
        return ResponseEntity.ok(serviceRequestService.updateStatus(id, status));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ServiceRequestResponse> patchStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status) {
        return ResponseEntity.ok(serviceRequestService.updateStatus(id, status));
    }

    // 7. Назначить мастера на заявку
    @PutMapping("/{id}/assign/{masterId}")
    public ResponseEntity<ServiceRequestResponse> assignMaster(
            @PathVariable Long id,
            @PathVariable Long masterId) {
        return ResponseEntity.ok(serviceRequestService.assignMaster(id, masterId));
    }
}
