package service_center.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import service_center.domain.entity.ServiceCatalog;
import service_center.domain.enums.ServiceCategory;

import java.util.List;

@Repository
public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, Long> {

    List<ServiceCatalog> findAllByIsActiveTrue();

    List<ServiceCatalog> findAllByCategoryAndIsActiveTrue(ServiceCategory category);
}
