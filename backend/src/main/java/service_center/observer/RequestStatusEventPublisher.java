package service_center.observer;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import service_center.domain.event.RequestStatusChangedEvent;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RequestStatusEventPublisher {

    private final List<RequestStatusObserver> observers;

    public void publish(RequestStatusChangedEvent event) {
        observers.forEach(observer -> observer.onStatusChanged(event));
    }
}
