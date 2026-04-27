package service_center.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import service_center.domain.exception.GeocodingException;
import service_center.dto.GeocodingResult;
import service_center.service.GeocodingService;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/geo")
public class GeocodingController {

    private final GeocodingService geocodingService;

    public GeocodingController(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }

    @GetMapping("/geocode")
    @PreAuthorize("isAuthenticated()")
    public GeocodingResult geocode(@RequestParam String address) {
        return geocodingService.geocode(address);
    }

    @ExceptionHandler(GeocodingException.class)
    public ResponseEntity<Map<String, String>> handleGeocodingException(GeocodingException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", ex.getMessage()));
    }
}
