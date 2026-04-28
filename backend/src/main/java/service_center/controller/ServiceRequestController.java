package service_center.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service_center.domain.enums.RequestStatus;
import service_center.dto.request.ServiceRequestCreateDto;
import service_center.dto.response.ServiceRequestResponse;
import service_center.service.ServiceRequestService;

@RestController
@RequestMapping({"/api/service-requests", "/api/requests"})
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    @PostMapping
    public ResponseEntity<ServiceRequestResponse> create(
            @RequestParam Long clientId,
            @Valid @RequestBody ServiceRequestCreateDto dto) {
        ServiceRequestResponse response = serviceRequestService.create(clientId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequestResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceRequestService.getById(id));
    }

    @GetMapping
    public ResponseEntity<Page<ServiceRequestResponse>> getAll(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(serviceRequestService.getAll(pageable));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<Page<ServiceRequestResponse>> getByClientId(
            @PathVariable Long clientId,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(serviceRequestService.getByClientId(clientId, pageable));
    }

    @GetMapping("/master/{masterId}")
    public ResponseEntity<Page<ServiceRequestResponse>> getByMasterId(
            @PathVariable Long masterId,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(serviceRequestService.getByMasterId(masterId, pageable));
    }

    @GetMapping("/status")
    public ResponseEntity<Page<ServiceRequestResponse>> getByStatus(
            @RequestParam RequestStatus status,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(serviceRequestService.getByStatus(status, pageable));
    }

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

    @PutMapping("/{id}/assign/{masterId}")
    public ResponseEntity<ServiceRequestResponse> assignMaster(
            @PathVariable Long id,
            @PathVariable Long masterId) {
        return ResponseEntity.ok(serviceRequestService.assignMaster(id, masterId));
    }
}
