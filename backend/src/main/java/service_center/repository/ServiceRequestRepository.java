package service_center.repository;

import service_center.domain.entity.ServiceRequest;
import service_center.domain.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    Page<ServiceRequest> findAllByClientId(Long clientId, Pageable pageable);
    Page<ServiceRequest> findAllByMasterId(Long masterId, Pageable pageable);
    List<ServiceRequest> findAllByStatus(RequestStatus status);
    Page<ServiceRequest> findAllByStatus(RequestStatus status, Pageable pageable);
    long countByStatus(RequestStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(sr.finalCost) FROM ServiceRequest sr WHERE sr.status = service_center.domain.enums.RequestStatus.COMPLETED")
    java.math.BigDecimal sumTotalRevenue();

    @org.springframework.data.jpa.repository.Query("SELECT new service_center.dto.response.StatisticsResponse$CategoryStat(sr.equipmentType.name, COUNT(sr)) " +
           "FROM ServiceRequest sr GROUP BY sr.equipmentType.name")
    List<service_center.dto.response.StatisticsResponse.CategoryStat> countByEquipmentType();
}