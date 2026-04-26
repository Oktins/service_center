package service_center;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import service_center.domain.entity.EquipmentType;
import service_center.domain.entity.User;
import service_center.domain.enums.DispatchStatus;
import service_center.domain.enums.Priority;
import service_center.domain.enums.RequestStatus;
import service_center.domain.enums.Role;
import service_center.dto.request.DispatchCreateDto;
import service_center.dto.request.RegisterRequest;
import service_center.dto.request.ReviewCreateDto;
import service_center.dto.request.ServiceRequestCreateDto;
import service_center.dto.request.SparePartCreateDto;
import service_center.dto.request.SparePartUsageDto;
import service_center.repository.EquipmentTypeRepository;
import service_center.repository.UserRepository;
import service_center.service.GeocodingService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ServiceCenterEndToEndIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EquipmentTypeRepository equipmentTypeRepository;

    @MockitoBean
    private GeocodingService geocodingService;

    @Test
    void completeServiceCenterBusinessProcessRecalculatesMasterRating() throws Exception {
        when(geocodingService.geocodeSafe(anyString())).thenReturn(Optional.empty());

        String suffix = UUID.randomUUID().toString();

        EquipmentType equipmentType = equipmentTypeRepository.save(EquipmentType.builder()
                .name("Пылесос " + suffix)
                .description("Бытовая техника для E2E теста")
                .build());

        JsonNode clientRegistration = performPost(
                "/api/auth/register",
                new RegisterRequest(
                        "artem.volkov.%s@example.com".formatted(suffix),
                        "password123",
                        "Артем",
                        "Волков",
                        "+375291111111"
                ),
                null
        );
        Long clientId = clientRegistration.at("/user/id").asLong();
        String clientAccessToken = clientRegistration.get("accessToken").asText();

        JsonNode masterRegistration = performPost(
                "/api/auth/register",
                new RegisterRequest(
                        "viktor.stalnoy.%s@example.com".formatted(suffix),
                        "password123",
                        "Виктор",
                        "Стальной",
                        "+375292222222"
                ),
                null
        );
        Long masterUserId = masterRegistration.at("/user/id").asLong();
        String masterAccessToken = masterRegistration.get("accessToken").asText();

        User masterUser = userRepository.findById(masterUserId).orElseThrow();
        masterUser.setRole(Role.MASTER);
        userRepository.saveAndFlush(masterUser);

        JsonNode masterProfile = performPost(
                "/api/masters/user/%d?specialization=%s&experienceYears=%d"
                        .formatted(masterUserId, "Ремонт%20пылесосов", 7),
                null,
                masterAccessToken
        );
        Long masterId = masterProfile.get("id").asLong();

        JsonNode sparePart = performPost(
                "/api/spare-parts",
                new SparePartCreateDto(
                        "Вакуумный клапан",
                        "VAC-%s".formatted(suffix),
                        "Клапан для вакуумного модуля",
                        5,
                        "шт",
                        new BigDecimal("42.50"),
                        1
                ),
                clientAccessToken
        );
        Long sparePartId = sparePart.get("id").asLong();

        JsonNode serviceRequest = performPost(
                "/api/service-requests?clientId=%d".formatted(clientId),
                new ServiceRequestCreateDto(
                        "Не включается пылесос",
                        "Пылесос не запускается после перепада напряжения",
                        equipmentType.getId(),
                        "Минск, проспект Независимости, 1",
                        Priority.HIGH
                ),
                clientAccessToken
        );
        Long requestId = serviceRequest.get("id").asLong();

        JsonNode dispatch = performPost(
                "/api/dispatches/request/%d/master/%d".formatted(requestId, masterId),
                new DispatchCreateDto(
                        LocalDateTime.now().plusDays(1),
                        "Выезд согласован с клиентом"
                ),
                masterAccessToken
        );
        Long dispatchId = dispatch.get("id").asLong();

        performPost(
                "/api/spare-parts-usage/request/%d".formatted(requestId),
                new SparePartUsageDto(sparePartId, 1),
                masterAccessToken
        );

        mockMvc.perform(patch("/api/dispatches/{id}/status", dispatchId)
                        .param("status", DispatchStatus.COMPLETED.name())
                        .header("Authorization", bearer(masterAccessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(DispatchStatus.COMPLETED.name()));

        mockMvc.perform(patch("/api/service-requests/{id}/status", requestId)
                        .param("status", RequestStatus.COMPLETED.name())
                        .header("Authorization", bearer(masterAccessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(RequestStatus.COMPLETED.name()));

        performPost(
                "/api/reviews/request/%d".formatted(requestId),
                new ReviewCreateDto(
                        requestId,
                        5,
                        "Мастер быстро нашел проблему и заменил клапан"
                ),
                clientAccessToken
        );

        mockMvc.perform(get("/api/masters/{id}", masterId)
                        .header("Authorization", bearer(clientAccessToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(masterId))
                .andExpect(jsonPath("$.firstName").value("Виктор"))
                .andExpect(jsonPath("$.lastName").value("Стальной"))
                .andExpect(jsonPath("$.rating").value(5.0));
    }

    private JsonNode performPost(String url, Object body, String accessToken) throws Exception {
        var request = post(url)
                .contentType(MediaType.APPLICATION_JSON);

        if (accessToken != null) {
            request.header("Authorization", bearer(accessToken));
        }

        if (body != null) {
            request.content(objectMapper.writeValueAsString(body));
        }

        String response = mockMvc.perform(request)
                .andExpect(status().is2xxSuccessful())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return response.isBlank() ? objectMapper.createObjectNode() : objectMapper.readTree(response);
    }

    private String bearer(String accessToken) {
        return "Bearer " + accessToken;
    }
}
