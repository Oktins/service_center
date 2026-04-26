package service_center.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service_center.domain.entity.SparePartUsage;
import service_center.dto.request.SparePartUsageDto;
import service_center.dto.response.SparePartUsageResponse;
import service_center.service.SparePartUsageService;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/spare-parts-usage")
@RequiredArgsConstructor
public class SparePartUsageController {

    private final SparePartUsageService sparePartUsageService;

    // 1. Списать запчасть со склада и прикрепить к заявке на ремонт
    @PostMapping("/request/{serviceRequestId}")
    public ResponseEntity<SparePartUsageResponse> usePartForRequest(
            @PathVariable Long serviceRequestId,
            @Valid @RequestBody SparePartUsageDto dto) {
        SparePartUsage usage = sparePartUsageService.usePartForRequest(serviceRequestId, dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapToResponse(usage));
    }

    // 2. Посмотреть, какие запчасти были потрачены на конкретную заявку
    @GetMapping("/request/{serviceRequestId}")
    public ResponseEntity<Page<SparePartUsage>> getUsagesByRequestId(
            @PathVariable Long serviceRequestId,
            Pageable pageable) {
        return ResponseEntity.ok(sparePartUsageService.getUsagesByRequestId(serviceRequestId, pageable));
    }

    // 3. Рассчитать общую стоимость всех запчастей, потраченных на ремонт
    @GetMapping("/request/{serviceRequestId}/total-cost")
    public ResponseEntity<BigDecimal> calculateTotalCost(@PathVariable Long serviceRequestId) {
        return ResponseEntity.ok(sparePartUsageService.calculateTotalCost(serviceRequestId));
    }

    private SparePartUsageResponse mapToResponse(SparePartUsage usage) {
        return new SparePartUsageResponse(
                usage.getId(),
                usage.getServiceRequest().getId(),
                usage.getSparePart().getId(),
                usage.getSparePart().getName(),
                usage.getQuantity(),
                usage.getPricePerUnit(),
                usage.getCreatedAt()
        );
    }
}
