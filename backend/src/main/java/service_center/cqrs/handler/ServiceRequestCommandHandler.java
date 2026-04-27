package service_center.cqrs.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import service_center.cqrs.command.AssignMasterCommand;
import service_center.cqrs.command.CreateServiceRequestCommand;
import service_center.cqrs.command.UpdateRequestStatusCommand;
import service_center.dto.request.ServiceRequestCreateDto;
import service_center.dto.response.ServiceRequestResponse;
import service_center.service.ServiceRequestService;

@Service
@RequiredArgsConstructor
public class ServiceRequestCommandHandler {

    private final ServiceRequestService serviceRequestService;

    public ServiceRequestResponse handle(CreateServiceRequestCommand command) {
        ServiceRequestCreateDto dto = new ServiceRequestCreateDto(
                command.description(),
                command.description(),
                command.equipmentTypeId(),
                command.address(),
                command.priority()
        );

        return serviceRequestService.create(command.clientId(), dto);
    }

    public ServiceRequestResponse handle(UpdateRequestStatusCommand command) {
        return serviceRequestService.updateStatus(command.requestId(), command.newStatus());
    }

    public ServiceRequestResponse handle(AssignMasterCommand command) {
        return serviceRequestService.assignMaster(command.requestId(), command.masterId());
    }
}
