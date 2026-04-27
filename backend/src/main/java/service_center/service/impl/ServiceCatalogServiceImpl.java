package service_center.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service_center.domain.entity.ServiceCatalog;
import service_center.domain.entity.Category;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.response.CategoryResponse;
import service_center.dto.request.ServiceCatalogCreateDto;
import service_center.dto.response.ServiceCatalogResponse;
import service_center.repository.ServiceCatalogRepository;
import service_center.repository.CategoryRepository;
import service_center.service.ServiceCatalogService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceCatalogServiceImpl implements ServiceCatalogService {

    private final ServiceCatalogRepository serviceCatalogRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public ServiceCatalogResponse create(ServiceCatalogCreateDto dto) {
        Category category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Категория не найдена с ID: " + dto.categoryId()));

        ServiceCatalog serviceCatalog = ServiceCatalog.builder()
                .name(dto.name())
                .description(dto.description())
                .basePrice(dto.basePrice())
                .category(category)
                .imageUrl(dto.imageUrl())
                .isActive(dto.isActive())
                .build();
        return mapToResponse(serviceCatalogRepository.save(serviceCatalog));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceCatalogResponse> getAll() {
        return serviceCatalogRepository.findAllByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceCatalogResponse getById(Long id) {
        return mapToResponse(getServiceCatalogEntity(id));
    }

    @Override
    @Transactional
    public ServiceCatalogResponse update(Long id, ServiceCatalogCreateDto dto) {
        Category category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Категория не найдена с ID: " + dto.categoryId()));

        ServiceCatalog serviceCatalog = getServiceCatalogEntity(id);
        serviceCatalog.setName(dto.name());
        serviceCatalog.setDescription(dto.description());
        serviceCatalog.setBasePrice(dto.basePrice());
        serviceCatalog.setCategory(category);
        serviceCatalog.setImageUrl(dto.imageUrl());
        serviceCatalog.setActive(dto.isActive());
        return mapToResponse(serviceCatalogRepository.save(serviceCatalog));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ServiceCatalog serviceCatalog = getServiceCatalogEntity(id);
        serviceCatalogRepository.delete(serviceCatalog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceCatalogResponse> getByCategory(Long categoryId) {
        return serviceCatalogRepository.findAllByCategoryIdAndIsActiveTrue(categoryId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ServiceCatalog getServiceCatalogEntity(Long id) {
        return serviceCatalogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Услуга не найдена с ID: " + id));
    }

    private ServiceCatalogResponse mapToResponse(ServiceCatalog serviceCatalog) {
        return new ServiceCatalogResponse(
                serviceCatalog.getId(),
                serviceCatalog.getName(),
                serviceCatalog.getDescription(),
                serviceCatalog.getBasePrice(),
                serviceCatalog.getCategory() != null ? new CategoryResponse(
                        serviceCatalog.getCategory().getId(),
                        serviceCatalog.getCategory().getName(),
                        null
                ) : null,
                serviceCatalog.getImageUrl(),
                serviceCatalog.isActive()
        );
    }
}
