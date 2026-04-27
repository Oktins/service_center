package service_center.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import service_center.domain.enums.DispatchStatus;
import service_center.dto.request.DispatchCreateDto;
import service_center.dto.response.DispatchResponse;

public interface DispatchService {
    DispatchResponse create(Long serviceRequestId, Long masterId, DispatchCreateDto dto);
    DispatchResponse getById(Long id);
    DispatchResponse getByServiceRequestId(Long serviceRequestId);
    Page<DispatchResponse> getByMasterId(Long masterId, Pageable pageable);
    Page<DispatchResponse> getByStatus(DispatchStatus status, Pageable pageable);
    DispatchResponse updateStatus(Long id, DispatchStatus status);
}