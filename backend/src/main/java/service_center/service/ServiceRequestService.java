package service_center.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import service_center.domain.enums.RequestStatus;
import service_center.dto.request.ServiceRequestCreateDto;
import service_center.dto.response.ServiceRequestResponse;

public interface ServiceRequestService {

    ServiceRequestResponse create(Long clientId, ServiceRequestCreateDto dto);

    ServiceRequestResponse getById(Long id);

    Page<ServiceRequestResponse> getByClientId(Long clientId, Pageable pageable);

    Page<ServiceRequestResponse> getByMasterId(Long masterId, Pageable pageable);

    Page<ServiceRequestResponse> getByStatus(RequestStatus status, Pageable pageable);

    ServiceRequestResponse updateStatus(Long id, RequestStatus status);

    ServiceRequestResponse assignMaster(Long requestId, Long masterId);

    long countByStatus(RequestStatus status);
}