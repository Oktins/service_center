package service_center.dto;

public record GeocodingResult(
        Double latitude,
        Double longitude,
        String displayName
) {}
