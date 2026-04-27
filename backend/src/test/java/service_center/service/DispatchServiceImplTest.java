package service_center.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import service_center.domain.entity.Dispatch;
import service_center.domain.entity.EquipmentType;
import service_center.domain.entity.Master;
import service_center.domain.entity.ServiceRequest;
import service_center.domain.entity.User;
import service_center.domain.enums.DispatchStatus;
import service_center.domain.enums.Priority;
import service_center.domain.enums.RequestStatus;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.request.DispatchCreateDto;
import service_center.dto.response.DispatchResponse;
import service_center.repository.DispatchRepository;
import service_center.repository.MasterRepository;
import service_center.repository.ServiceRequestRepository;
import service_center.service.impl.DispatchServiceImpl;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DispatchServiceImplTest {

    @Mock
    private DispatchRepository dispatchRepository;

    @Mock
    private ServiceRequestRepository serviceRequestRepository;

    @Mock
    private MasterRepository masterRepository;

    @InjectMocks
    private DispatchServiceImpl dispatchService;

    @Test
    void create_ShouldReturnDispatch_WhenValidData() {
        ServiceRequest request = buildTestServiceRequest();
        Master master = buildTestMaster();
        Dispatch savedDispatch = buildTestDispatch(request, master);
        DispatchCreateDto dto = new DispatchCreateDto(
                LocalDateTime.now().plusDays(1),
                "Выезд согласован"
        );

        when(serviceRequestRepository.findById(10L)).thenReturn(Optional.of(request));
        when(dispatchRepository.findByServiceRequestId(10L)).thenReturn(Optional.empty());
        when(masterRepository.findById(5L)).thenReturn(Optional.of(master));
        when(dispatchRepository.save(any(Dispatch.class))).thenReturn(savedDispatch);

        DispatchResponse response = dispatchService.create(10L, 5L, dto);

        assertNotNull(response);
        assertEquals(100L, response.id());
        assertEquals(DispatchStatus.SCHEDULED, response.status());
        assertEquals(RequestStatus.ASSIGNED, request.getStatus());
        assertEquals(master, request.getMaster());
        verify(serviceRequestRepository).save(request);
    }

    @Test
    void getById_ShouldThrow_WhenNotFound() {
        when(dispatchRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> dispatchService.getById(404L));
    }

    @Test
    void updateStatus_ShouldUpdateDispatchStatus() {
        ServiceRequest request = buildTestServiceRequest();
        Master master = buildTestMaster();
        Dispatch dispatch = buildTestDispatch(request, master);

        when(dispatchRepository.findById(100L)).thenReturn(Optional.of(dispatch));
        when(dispatchRepository.save(dispatch)).thenReturn(dispatch);

        DispatchResponse response = dispatchService.updateStatus(100L, DispatchStatus.IN_PROGRESS);

        assertEquals(DispatchStatus.IN_PROGRESS, dispatch.getStatus());
        assertNotNull(dispatch.getStartedAt());
        assertEquals(DispatchStatus.IN_PROGRESS, response.status());
    }

    private Dispatch buildTestDispatch(ServiceRequest request, Master master) {
        return Dispatch.builder()
                .id(100L)
                .serviceRequest(request)
                .master(master)
                .scheduledAt(LocalDateTime.now().plusDays(1))
                .status(DispatchStatus.SCHEDULED)
                .notes("Выезд согласован")
                .build();
    }

    private ServiceRequest buildTestServiceRequest() {
        return ServiceRequest.builder()
                .id(10L)
                .client(buildTestUser(1L, "Артем", "Волков"))
                .equipmentType(EquipmentType.builder().id(2L).name("Пылесос").build())
                .title("Не включается пылесос")
                .description("Пылесос не запускается")
                .address("Минск, проспект Независимости, 1")
                .priority(Priority.HIGH)
                .status(RequestStatus.NEW)
                .build();
    }

    private Master buildTestMaster() {
        return Master.builder()
                .id(5L)
                .user(buildTestUser(3L, "Виктор", "Стальной"))
                .specialization("Ремонт пылесосов")
                .experienceYears(7)
                .isAvailable(true)
                .build();
    }

    private User buildTestUser(Long id, String firstName, String lastName) {
        return User.builder()
                .id(id)
                .email("user%s@example.com".formatted(id))
                .firstName(firstName)
                .lastName(lastName)
                .build();
    }
}
