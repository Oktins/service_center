package service_center.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import service_center.domain.enums.RequestStatus;
import service_center.dto.response.StatisticsResponse;
import service_center.repository.MasterRepository;
import service_center.repository.ServiceRequestRepository;
import service_center.repository.SparePartRepository;
import service_center.service.StatisticsService;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final MasterRepository masterRepository;
    private final SparePartRepository sparePartRepository;

    @Override
    public StatisticsResponse getStatistics() {
        Map<RequestStatus, Long> requestCountsByStatus = Arrays.stream(RequestStatus.values())
                .collect(Collectors.toMap(
                        status -> status,
                        serviceRequestRepository::countByStatus
                ));

        long totalRequests = requestCountsByStatus.values().stream()
                .mapToLong(Long::longValue)
                .sum();

        return new StatisticsResponse(
                totalRequests,
                requestCountsByStatus.getOrDefault(RequestStatus.NEW, 0L),
                requestCountsByStatus.getOrDefault(RequestStatus.ASSIGNED, 0L),
                requestCountsByStatus.getOrDefault(RequestStatus.IN_PROGRESS, 0L),
                requestCountsByStatus.getOrDefault(RequestStatus.COMPLETED, 0L),
                requestCountsByStatus.getOrDefault(RequestStatus.CANCELLED, 0L),
                masterRepository.countByIsAvailableTrue(),
                sparePartRepository.count()
        );
    }
}
