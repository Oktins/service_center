package service_center.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service_center.domain.entity.ServiceRequest;
import service_center.domain.entity.SparePart;
import service_center.domain.entity.SparePartUsage;
import service_center.domain.exception.InsufficientStockException;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.request.SparePartUsageDto;
import service_center.repository.ServiceRequestRepository;
import service_center.repository.SparePartRepository;
import service_center.repository.SparePartUsageRepository;
import service_center.service.SparePartUsageService;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class SparePartUsageServiceImpl implements SparePartUsageService {

    private final SparePartUsageRepository usageRepository;
    private final SparePartRepository sparePartRepository;
    private final ServiceRequestRepository requestRepository;

    @Override
    @Transactional
    public SparePartUsage usePartForRequest(Long serviceRequestId, SparePartUsageDto dto) {
        ServiceRequest request = requestRepository.findById(serviceRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка не найдена с ID: " + serviceRequestId));

        SparePart part = sparePartRepository.findById(dto.sparePartId())
                .orElseThrow(() -> new ResourceNotFoundException("Запчасть не найдена с ID: " + dto.sparePartId()));

        if (part.getQuantity() < dto.quantity()) {
            throw new InsufficientStockException(
                    part.getName(),
                    dto.quantity(),
                    part.getQuantity()
            );
        }

        part.setQuantity(part.getQuantity() - dto.quantity());
        sparePartRepository.save(part);

        SparePartUsage usage = SparePartUsage.builder()
                .serviceRequest(request)
                .sparePart(part)
                .quantity(dto.quantity())
                .pricePerUnit(part.getPrice())
                .build();

        return usageRepository.save(usage);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SparePartUsage> getUsagesByRequestId(Long serviceRequestId, Pageable pageable) {
        return usageRepository.findAllByServiceRequestId(serviceRequestId, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal calculateTotalCost(Long serviceRequestId) {
        BigDecimal total = usageRepository.calculateTotalCostByRequest(serviceRequestId);
        return total != null ? total : BigDecimal.ZERO;
    }
}