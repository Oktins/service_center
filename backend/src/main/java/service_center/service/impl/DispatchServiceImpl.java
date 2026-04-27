package service_center.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service_center.domain.entity.Dispatch;
import service_center.domain.entity.Master;
import service_center.domain.entity.ServiceRequest;
import service_center.domain.enums.DispatchStatus;
import service_center.domain.enums.RequestStatus;
import service_center.domain.exception.BusinessException;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.request.DispatchCreateDto;
import service_center.dto.response.DispatchResponse;
import service_center.repository.DispatchRepository;
import service_center.repository.MasterRepository;
import service_center.repository.ServiceRequestRepository;
import service_center.service.DispatchService;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DispatchServiceImpl implements DispatchService {

    private final DispatchRepository dispatchRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final MasterRepository masterRepository;

    @Override
    @Transactional
    public DispatchResponse create(Long serviceRequestId, Long masterId, DispatchCreateDto dto) {
        ServiceRequest request = serviceRequestRepository.findById(serviceRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка не найдена с ID: " + serviceRequestId));

        if (dispatchRepository.findByServiceRequestId(serviceRequestId).isPresent()) {
            throw new BusinessException("Для этой заявки уже назначен выезд");
        }

        Master master = masterRepository.findById(masterId)
                .orElseThrow(() -> new ResourceNotFoundException("Мастер не найден с ID: " + masterId));

        if (!master.isAvailable()) {
            throw new BusinessException("Выбранный мастер сейчас недоступен");
        }

        // TODO: Интеграция с Google Maps Geocoding API
        // Позже здесь мы будем получать latitude и longitude на основе адреса из request

        Dispatch dispatch = Dispatch.builder()
                .serviceRequest(request)
                .master(master)
                .scheduledAt(dto.scheduledAt())
                .notes(dto.notes())
                .status(DispatchStatus.SCHEDULED)
                .build();

        // Обновляем статус заявки и привязываем мастера
        request.setStatus(RequestStatus.ASSIGNED);
        request.setMaster(master);
        serviceRequestRepository.save(request);

        return mapToResponse(dispatchRepository.save(dispatch));
    }

    @Override
    @Transactional(readOnly = true)
    public DispatchResponse getById(Long id) {
        return mapToResponse(dispatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Выезд не найден с ID: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public DispatchResponse getByServiceRequestId(Long serviceRequestId) {
        return mapToResponse(dispatchRepository.findByServiceRequestId(serviceRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Выезд не найден для заявки с ID: " + serviceRequestId)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DispatchResponse> getByMasterId(Long masterId, Pageable pageable) {
        return dispatchRepository.findAllByMasterId(masterId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DispatchResponse> getByStatus(DispatchStatus status, Pageable pageable) {
        return dispatchRepository.findAllByStatus(status, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public DispatchResponse updateStatus(Long id, DispatchStatus status) {
        Dispatch dispatch = dispatchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Выезд не найден с ID: " + id));

        dispatch.setStatus(status);

        // Автоматически проставляем время начала и завершения выезда
        if (status == DispatchStatus.IN_PROGRESS && dispatch.getStartedAt() == null) {
            dispatch.setStartedAt(LocalDateTime.now());
        } else if (status == DispatchStatus.COMPLETED && dispatch.getCompletedAt() == null) {
            dispatch.setCompletedAt(LocalDateTime.now());
            // Переводим саму заявку в статус В РАБОТЕ, так как выезд окончен, но ремонт может еще идти
            dispatch.getServiceRequest().setStatus(RequestStatus.IN_PROGRESS);
            serviceRequestRepository.save(dispatch.getServiceRequest());
        }

        return mapToResponse(dispatchRepository.save(dispatch));
    }

    private DispatchResponse mapToResponse(Dispatch dispatch) {
        String masterName = dispatch.getMaster().getUser().getFirstName() + " " + dispatch.getMaster().getUser().getLastName();

        return new DispatchResponse(
                dispatch.getId(),
                dispatch.getServiceRequest().getId(),
                dispatch.getServiceRequest().getTitle(),
                dispatch.getMaster().getId(),
                masterName,
                dispatch.getScheduledAt(),
                dispatch.getStartedAt(),
                dispatch.getCompletedAt(),
                dispatch.getStatus(),
                dispatch.getNotes(),
                toDouble(dispatch.getLatitude()),
                toDouble(dispatch.getLongitude())
        );
    }

    private Double toDouble(BigDecimal value) {
        return value == null ? null : value.doubleValue();
    }
}
