package service_center.service;

import service_center.dto.GeocodingResult;

import java.util.Optional;

public interface GeocodingService {

    GeocodingResult geocode(String address);

    Optional<GeocodingResult> geocodeSafe(String address);
}
