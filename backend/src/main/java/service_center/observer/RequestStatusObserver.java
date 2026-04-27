package service_center.observer;

import service_center.domain.event.RequestStatusChangedEvent;

public interface RequestStatusObserver {

    void onStatusChanged(RequestStatusChangedEvent event);
}
