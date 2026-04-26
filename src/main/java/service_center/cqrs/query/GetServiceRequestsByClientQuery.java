package service_center.cqrs.query;

import org.springframework.data.domain.Pageable;

public record GetServiceRequestsByClientQuery(
        Long clientId,
        Pageable pageable
) {
}
