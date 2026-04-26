package service_center.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import service_center.domain.exception.GeocodingException;
import service_center.dto.GeocodingResult;
import service_center.service.GeocodingService;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeocodingServiceImpl implements GeocodingService {

    private static final String NOMINATIM_SEARCH_URL =
            "https://nominatim.openstreetmap.org/search?q={address}&format=json&limit=1";
    private static final String USER_AGENT = "ServiceCenterApp/1.0";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public GeocodingResult geocode(String address) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.USER_AGENT, USER_AGENT);

            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    NOMINATIM_SEARCH_URL,
                    HttpMethod.GET,
                    requestEntity,
                    String.class,
                    address
            );

            String responseBody = response.getBody();
            if (responseBody == null || responseBody.isBlank()) {
                throw new GeocodingException("Пустой ответ от сервиса геокодирования");
            }

            JsonNode root = objectMapper.readTree(responseBody);
            if (!root.isArray() || root.isEmpty()) {
                throw new GeocodingException("Адрес не найден: " + address);
            }

            JsonNode firstResult = root.get(0);
            Double latitude = parseCoordinate(firstResult, "lat", address);
            Double longitude = parseCoordinate(firstResult, "lon", address);
            String displayName = firstResult.path("display_name").asText(null);

            return new GeocodingResult(latitude, longitude, displayName);
        } catch (GeocodingException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new GeocodingException("Ошибка геокодирования адреса: " + address, ex);
        }
    }

    @Override
    public Optional<GeocodingResult> geocodeSafe(String address) {
        try {
            return Optional.of(geocode(address));
        } catch (Exception ex) {
            log.warn("Не удалось геокодировать адрес '{}': {}", address, ex.getMessage());
            return Optional.empty();
        }
    }

    private Double parseCoordinate(JsonNode node, String fieldName, String address) {
        String value = node.path(fieldName).asText(null);
        if (value == null || value.isBlank()) {
            throw new GeocodingException("В ответе геокодирования отсутствует поле " + fieldName + ": " + address);
        }

        try {
            return Double.valueOf(value);
        } catch (NumberFormatException ex) {
            throw new GeocodingException("Некорректная координата " + fieldName + " для адреса: " + address, ex);
        }
    }
}
