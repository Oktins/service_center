package service_center.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service_center.domain.entity.EquipmentType;
import service_center.domain.entity.Master;
import service_center.domain.entity.ServiceRequest;
import service_center.domain.entity.User;
import service_center.domain.enums.RequestStatus;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.request.ServiceRequestCreateDto;
import service_center.dto.response.ServiceRequestResponse;
import service_center.repository.EquipmentTypeRepository;
import service_center.repository.MasterRepository;
import service_center.repository.ServiceRequestRepository;
import service_center.repository.UserRepository;
import service_center.service.ServiceRequestService;

@Service
@RequiredArgsConstructor
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final UserRepository userRepository;
    private final MasterRepository masterRepository;
    // Внимание: Убедись, что интерфейс EquipmentTypeRepository создан 
    // (extends JpaRepository<EquipmentType, Long>)
    private final EquipmentTypeRepository equipmentTypeRepository;

    @Override
    @Transactional
    public ServiceRequestResponse create(Long clientId, ServiceRequestCreateDto dto) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Клиент не найден с ID: " + clientId));

        EquipmentType equipmentType = equipmentTypeRepository.findById(dto.equipmentTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Тип оборудования не найден с ID: " + dto.equipmentTypeId()));

        // Используем паттерн Builder, заложенный через @Builder в ServiceRequest
        ServiceRequest request = ServiceRequest.builder()
                .client(client)
                .equipmentType(equipmentType)
                .title(dto.title())
                .description(dto.description())
                .address(dto.address())
                .priority(dto.priority())
                .status(RequestStatus.NEW)
                .build();

        ServiceRequest savedRequest = serviceRequestRepository.save(request);
        return mapToResponse(savedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceRequestResponse getById(Long id) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка не найдена с ID: " + id));
        return mapToResponse(request);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceRequestResponse> getByClientId(Long clientId, Pageable pageable) {
        return serviceRequestRepository.findAllByClientId(clientId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceRequestResponse> getByMasterId(Long masterId, Pageable pageable) {
        return serviceRequestRepository.findAllByMasterId(masterId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServiceRequestResponse> getByStatus(RequestStatus status, Pageable pageable) {
        return serviceRequestRepository.findAllByStatus(status, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public ServiceRequestResponse updateStatus(Long id, RequestStatus status) {
        ServiceRequest request = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка не найдена с ID: " + id));

        request.setStatus(status);
        ServiceRequest updatedRequest = serviceRequestRepository.save(request);

        // TODO: Здесь мы внедрим паттерн Observer (Уведомление клиента/мастера о смене статуса)

        return mapToResponse(updatedRequest);
    }

    @Override
    @Transactional
    public ServiceRequestResponse assignMaster(Long requestId, Long masterId) {
        ServiceRequest request = serviceRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка не найдена с ID: " + requestId));

        Master master = masterRepository.findById(masterId)
                .orElseThrow(() -> new ResourceNotFoundException("Мастер не найден с ID: " + masterId));

        request.setMaster(master);
        request.setStatus(RequestStatus.ASSIGNED);

        ServiceRequest updatedRequest = serviceRequestRepository.save(request);

        // TODO: Здесь также будет срабатывать Observer для уведомления мастера о новой задаче

        return mapToResponse(updatedRequest);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByStatus(RequestStatus status) {
        return serviceRequestRepository.countByStatus(status);
    }

    /**
     * Ручной маппинг из Entity в DTO (без использования ModelMapper)
     */
    private ServiceRequestResponse mapToResponse(ServiceRequest request) {
        String clientName = request.getClient().getFirstName() + " " + request.getClient().getLastName();

        String masterName = null;
        if (request.getMaster() != null && request.getMaster().getUser() != null) {
            masterName = request.getMaster().getUser().getFirstName() + " " + request.getMaster().getUser().getLastName();
        }

        // Предполагается, что в сущности EquipmentType есть поле name и метод getName().
        // Если поле называется иначе (например, typeName), замени getName() на соответствующий метод.
        String equipmentTypeName = request.getEquipmentType() != null ? request.getEquipmentType().getName() : "Не указан";

        return new ServiceRequestResponse(
                request.getId(),
                request.getTitle(),
                request.getDescription(),
                request.getAddress(),
                request.getStatus(),
                request.getPriority(),
                equipmentTypeName,
                clientName,
                masterName,
                request.getEstimatedCost(),
                request.getFinalCost(),
                request.getCreatedAt(),
                request.getUpdatedAt()
        );
    }
}