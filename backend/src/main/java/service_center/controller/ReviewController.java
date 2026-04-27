package service_center.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service_center.dto.request.ReviewCreateDto;
import service_center.dto.response.ReviewResponse;
import service_center.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 1. Оставить отзыв о завершенной заявке
    @PostMapping("/request/{serviceRequestId}")
    public ResponseEntity<ReviewResponse> create(
            @PathVariable Long serviceRequestId,
            @Valid @RequestBody ReviewCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.create(serviceRequestId, dto));
    }

    // 2. Получить отзыв по ID
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getById(id));
    }

    // 3. Получить отзыв для конкретной заявки
    @GetMapping("/request/{serviceRequestId}")
    public ResponseEntity<ReviewResponse> getByServiceRequestId(@PathVariable Long serviceRequestId) {
        return ResponseEntity.ok(reviewService.getByServiceRequestId(serviceRequestId));
    }

    // 4. Получить все отзывы конкретного мастера (с пагинацией)
    @GetMapping("/master/{masterId}")
    public ResponseEntity<Page<ReviewResponse>> getByMasterId(
            @PathVariable Long masterId,
            Pageable pageable) {
        return ResponseEntity.ok(reviewService.getByMasterId(masterId, pageable));
    }
}