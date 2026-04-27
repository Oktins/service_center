package service_center.cqrs.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import service_center.cqrs.query.GetServiceRequestQuery;
import service_center.cqrs.query.GetServiceRequestsByClientQuery;
import service_center.dto.response.ServiceRequestResponse;
import service_center.service.ServiceRequestService;

@Service
@RequiredArgsConstructor
public class ServiceRequestQueryHandler {

    private final ServiceRequestService serviceRequestService;

    public ServiceRequestResponse handle(GetServiceRequestQuery query) {
        return serviceRequestService.getById(query.requestId());
    }

    public Page<ServiceRequestResponse> handle(GetServiceRequestsByClientQuery query) {
        return serviceRequestService.getByClientId(query.clientId(), query.pageable());
    }
}
