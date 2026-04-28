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

    Optional<Dispatch> findByServiceRequestId(Long serviceRequestId);

    Page<Dispatch> findAllByMasterId(Long masterId, Pageable pageable);

    Page<Dispatch> findAllByStatus(DispatchStatus status, Pageable pageable);
}