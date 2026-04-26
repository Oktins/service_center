package service_center.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import service_center.dto.request.ReviewCreateDto;
import service_center.dto.response.ReviewResponse;

public interface ReviewService {
    ReviewResponse create(Long serviceRequestId, ReviewCreateDto dto);
    ReviewResponse getById(Long id);
    ReviewResponse getByServiceRequestId(Long serviceRequestId);
    Page<ReviewResponse> getByMasterId(Long masterId, Pageable pageable);
}