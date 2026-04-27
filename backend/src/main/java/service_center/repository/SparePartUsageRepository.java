package service_center.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import service_center.domain.entity.SparePartUsage;

import java.math.BigDecimal;

@Repository
public interface SparePartUsageRepository extends JpaRepository<SparePartUsage, Long> {

    // Изменили List на Page и добавили Pageable
    Page<SparePartUsage> findAllByServiceRequestId(Long serviceRequestId, Pageable pageable);

    // Агрегирующий запрос оставляем без изменений, он написан отлично
    @Query("SELECT SUM(u.quantity * u.pricePerUnit) FROM SparePartUsage u " +
            "WHERE u.serviceRequest.id = :requestId")
    BigDecimal calculateTotalCostByRequest(@Param("requestId") Long requestId);
}