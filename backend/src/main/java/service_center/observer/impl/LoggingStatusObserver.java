package service_center.observer.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import service_center.domain.event.RequestStatusChangedEvent;
import service_center.observer.RequestStatusObserver;

@Slf4j
@Component
public class LoggingStatusObserver implements RequestStatusObserver {

    @Override
    public void onStatusChanged(RequestStatusChangedEvent event) {
        log.info("Request #{} status changed: {} -> {}",
                event.requestId(),
                event.oldStatus(),
                event.newStatus());
    }
}
