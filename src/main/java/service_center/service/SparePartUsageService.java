package service_center.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import service_center.domain.entity.SparePartUsage;
import service_center.dto.request.SparePartUsageDto;
import java.math.BigDecimal;

public interface SparePartUsageService {
    SparePartUsage usePartForRequest(Long serviceRequestId, SparePartUsageDto dto);
    Page<SparePartUsage> getUsagesByRequestId(Long serviceRequestId, Pageable pageable);
    BigDecimal calculateTotalCost(Long serviceRequestId);
}