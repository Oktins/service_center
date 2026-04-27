package service_center.service;

import service_center.domain.enums.ServiceCategory;
import service_center.dto.request.ServiceCatalogCreateDto;
import service_center.dto.response.ServiceCatalogResponse;

import java.util.List;

public interface ServiceCatalogService {
    ServiceCatalogResponse create(ServiceCatalogCreateDto dto);
    List<ServiceCatalogResponse> getAll();
    ServiceCatalogResponse getById(Long id);
    ServiceCatalogResponse update(Long id, ServiceCatalogCreateDto dto);
    void delete(Long id);
    List<ServiceCatalogResponse> getByCategory(ServiceCategory category);
}
