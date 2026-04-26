package service_center.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import service_center.domain.entity.EquipmentType;
import service_center.domain.entity.Master;
import service_center.domain.entity.ServiceRequest;
import service_center.domain.entity.User;
import service_center.domain.enums.Priority;
import service_center.domain.enums.RequestStatus;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.request.ServiceRequestCreateDto;
import service_center.dto.response.ServiceRequestResponse;
import service_center.observer.RequestStatusEventPublisher;
import service_center.repository.EquipmentTypeRepository;
import service_center.repository.MasterRepository;
import service_center.repository.ServiceRequestRepository;
import service_center.repository.UserRepository;
import service_center.service.impl.ServiceRequestServiceImpl;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ServiceRequestServiceImplTest {

    @Mock
    private ServiceRequestRepository serviceRequestRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MasterRepository masterRepository;

    @Mock
    private EquipmentTypeRepository equipmentTypeRepository;

    @Mock
    private GeocodingService geocodingService;

    @Mock
    private RequestStatusEventPublisher requestStatusEventPublisher;

    @InjectMocks
    private ServiceRequestServiceImpl serviceRequestService;

    @Test
    void create_ShouldReturnResponse_WhenValidData() {
        User client = buildTestUser(1L, "Артем", "Волков");
        EquipmentType equipmentType = buildTestEquipmentType();
        ServiceRequestCreateDto dto = buildCreateDto(equipmentType.getId());
        ServiceRequest savedRequest = buildTestServiceRequest();

        when(userRepository.findById(1L)).thenReturn(Optional.of(client));
        when(equipmentTypeRepository.findById(equipmentType.getId())).thenReturn(Optional.of(equipmentType));
        when(geocodingService.geocodeSafe(dto.address())).thenReturn(Optional.empty());
        when(serviceRequestRepository.save(any(ServiceRequest.class))).thenReturn(savedRequest);

        ServiceRequestResponse response = serviceRequestService.create(1L, dto);

        assertNotNull(response);
        assertEquals(RequestStatus.NEW, response.status());
        assertEquals("Не включается пылесос", response.title());
    }

    @Test
    void create_ShouldThrowException_WhenClientNotFound() {
        ServiceRequestCreateDto dto = buildCreateDto(1L);

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> serviceRequestService.create(99L, dto));
    }

    @Test
    void getById_ShouldReturnResponse_WhenExists() {
        ServiceRequest request = buildTestServiceRequest();

        when(serviceRequestRepository.findById(10L)).thenReturn(Optional.of(request));

        ServiceRequestResponse response = serviceRequestService.getById(10L);

        assertNotNull(response);
        assertEquals(10L, response.id());
        assertEquals(RequestStatus.NEW, response.status());
    }

    @Test
    void getById_ShouldThrowException_WhenNotFound() {
        when(serviceRequestRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> serviceRequestService.getById(404L));
    }

    @Test
    void updateStatus_ShouldChangeStatus() {
        ServiceRequest request = buildTestServiceRequest();
        ServiceRequest savedRequest = buildTestServiceRequest();
        savedRequest.setStatus(RequestStatus.COMPLETED);

        when(serviceRequestRepository.findById(10L)).thenReturn(Optional.of(request));
        when(serviceRequestRepository.save(request)).thenReturn(savedRequest);

        ServiceRequestResponse response = serviceRequestService.updateStatus(10L, RequestStatus.COMPLETED);

        assertEquals(RequestStatus.COMPLETED, request.getStatus());
        assertEquals(RequestStatus.COMPLETED, response.status());
        verify(requestStatusEventPublisher).publish(any());
    }

    @Test
    void assignMaster_ShouldSetMasterAndStatus() {
        ServiceRequest request = buildTestServiceRequest();
        Master master = buildTestMaster(5L);

        when(serviceRequestRepository.findById(10L)).thenReturn(Optional.of(request));
        when(masterRepository.findById(5L)).thenReturn(Optional.of(master));
        when(serviceRequestRepository.save(request)).thenReturn(request);

        ServiceRequestResponse response = serviceRequestService.assignMaster(10L, 5L);

        assertSame(master, request.getMaster());
        assertEquals(RequestStatus.ASSIGNED, request.getStatus());
        assertEquals("Виктор Стальной", response.masterName());
    }

    @Test
    void countByStatus_ShouldReturnCount() {
        when(serviceRequestRepository.countByStatus(RequestStatus.NEW)).thenReturn(3L);

        long count = serviceRequestService.countByStatus(RequestStatus.NEW);

        assertEquals(3L, count);
    }

    private ServiceRequestCreateDto buildCreateDto(Long equipmentTypeId) {
        return new ServiceRequestCreateDto(
                "Не включается пылесос",
                "Пылесос не запускается",
                equipmentTypeId,
                "Минск, проспект Независимости, 1",
                Priority.HIGH
        );
    }

    private ServiceRequest buildTestServiceRequest() {
        return ServiceRequest.builder()
                .id(10L)
                .client(buildTestUser(1L, "Артем", "Волков"))
                .equipmentType(buildTestEquipmentType())
                .title("Не включается пылесос")
                .description("Пылесос не запускается")
                .address("Минск, проспект Независимости, 1")
                .priority(Priority.HIGH)
                .status(RequestStatus.NEW)
                .build();
    }

    private User buildTestUser(Long id, String firstName, String lastName) {
        return User.builder()
                .id(id)
                .email("user%s@example.com".formatted(id))
                .firstName(firstName)
                .lastName(lastName)
                .phone("+375291111111")
                .build();
    }

    private EquipmentType buildTestEquipmentType() {
        return EquipmentType.builder()
                .id(2L)
                .name("Пылесос")
                .description("Бытовая техника")
                .build();
    }

    private Master buildTestMaster(Long id) {
        return Master.builder()
                .id(id)
                .user(buildTestUser(3L, "Виктор", "Стальной"))
                .specialization("Ремонт пылесосов")
                .experienceYears(7)
                .isAvailable(true)
                .build();
    }
}
