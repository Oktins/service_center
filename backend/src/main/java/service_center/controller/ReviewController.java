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

    @PostMapping("/request/{serviceRequestId}")
    public ResponseEntity<ReviewResponse> create(
            @PathVariable Long serviceRequestId,
            @Valid @RequestBody ReviewCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.create(serviceRequestId, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getById(id));
    }

    @GetMapping("/request/{serviceRequestId}")
    public ResponseEntity<ReviewResponse> getByServiceRequestId(@PathVariable Long serviceRequestId) {
        return ResponseEntity.ok(reviewService.getByServiceRequestId(serviceRequestId));
    }

    @GetMapping("/master/{masterId}")
    public ResponseEntity<Page<ReviewResponse>> getByMasterId(
            @PathVariable Long masterId,
            Pageable pageable) {
        return ResponseEntity.ok(reviewService.getByMasterId(masterId, pageable));
    }
}