package service_center.dto.response;

import java.math.BigDecimal;

public record MasterResponse(
        Long id,
        Long userId,
        String firstName,
        String lastName,
        String email,
        String specialization,
        Integer experienceYears,
        BigDecimal rating,
        boolean isAvailable
) {}