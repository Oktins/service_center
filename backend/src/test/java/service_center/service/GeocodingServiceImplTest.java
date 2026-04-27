package service_center.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import service_center.domain.exception.GeocodingException;
import service_center.dto.GeocodingResult;
import service_center.service.impl.GeocodingServiceImpl;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GeocodingServiceImplTest {

    @Mock
    private RestTemplate restTemplate;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private GeocodingServiceImpl geocodingService;

    @Test
    void geocode_ShouldReturnResult_WhenAddressFound() {
        String json = """
                [
                  {
                    "lat": "53.902284",
                    "lon": "27.561831",
                    "display_name": "Минск, Беларусь"
                  }
                ]
                """;

        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(String.class),
                eq("Минск")
        )).thenReturn(ResponseEntity.ok(json));

        GeocodingResult result = geocodingService.geocode("Минск");

        assertEquals(53.902284, result.latitude());
        assertEquals(27.561831, result.longitude());
        assertEquals("Минск, Беларусь", result.displayName());
    }

    @Test
    void geocode_ShouldThrowGeocodingException_WhenEmptyResponse() {
        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(String.class),
                eq("Неизвестный адрес")
        )).thenReturn(ResponseEntity.ok("[]"));

        assertThrows(GeocodingException.class, () -> geocodingService.geocode("Неизвестный адрес"));
    }

    @Test
    void geocodeSafe_ShouldReturnEmpty_WhenExceptionThrown() {
        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                eq(String.class),
                eq("Минск")
        )).thenThrow(new RuntimeException("Nominatim unavailable"));

        Optional<GeocodingResult> result = geocodingService.geocodeSafe("Минск");

        assertTrue(result.isEmpty());
        assertFalse(result.isPresent());
    }
}
