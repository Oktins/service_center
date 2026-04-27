package service_center.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import service_center.domain.entity.Dispatch;
import service_center.domain.enums.DispatchStatus;

import java.util.Optional;

@Repository
public interface DispatchRepository extends JpaRepository<Dispatch, Long> {

    // Найти выезд по ID заявки (для проверки, назначен ли уже мастер)
    Optional<Dispatch> findByServiceRequestId(Long serviceRequestId);

    // Получить историю выездов конкретного мастера (с пагинацией)
    Page<Dispatch> findAllByMasterId(Long masterId, Pageable pageable);

    // Получить все выезды по их статусу (например, SCHEDULED - запланированные)
    Page<Dispatch> findAllByStatus(DispatchStatus status, Pageable pageable);
}