package service_center.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service_center.domain.entity.SparePart;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.request.SparePartCreateDto;
import service_center.dto.response.SparePartResponse;
import service_center.repository.SparePartRepository;
import service_center.service.SparePartService;

@Service
@RequiredArgsConstructor
public class SparePartServiceImpl implements SparePartService {

    private final SparePartRepository sparePartRepository;

    @Override
    @Transactional
    public SparePartResponse create(SparePartCreateDto dto) {
        SparePart part = SparePart.builder()
                .name(dto.name())
                .article(dto.article())
                .description(dto.description())
                .quantity(dto.quantity())
                .unit(dto.unit() != null ? dto.unit() : "шт")
                .price(dto.price())
                .minQuantity(dto.minQuantity())
                .build();
        return mapToResponse(sparePartRepository.save(part));
    }

    @Override
    @Transactional(readOnly = true)
    public SparePartResponse getById(Long id) {
        return mapToResponse(getPartEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public SparePartResponse getByArticle(String article) {
        SparePart part = sparePartRepository.findByArticle(article)
                .orElseThrow(() -> new ResourceNotFoundException("Запчасть не найдена с артикулом: " + article));
        return mapToResponse(part);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SparePartResponse> getAll(Pageable pageable) {
        return sparePartRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SparePartResponse> getLowStockParts(Pageable pageable) {
        return sparePartRepository.findLowStockParts(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public SparePartResponse addStock(Long id, Integer quantityToAdd) {
        SparePart part = getPartEntity(id);
        part.setQuantity(part.getQuantity() + quantityToAdd);
        return mapToResponse(sparePartRepository.save(part));
    }

    private SparePart getPartEntity(Long id) {
        return sparePartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Запчасть не найдена с ID: " + id));
    }

    private SparePartResponse mapToResponse(SparePart part) {
        // Вычисляем флаг lowStock на лету
        boolean isLowStock = part.getQuantity() <= part.getMinQuantity();

        return new SparePartResponse(
                part.getId(),
                part.getName(),
                part.getArticle(),
                part.getDescription(),
                part.getQuantity(),
                part.getUnit(),
                part.getPrice(),
                part.getMinQuantity(),
                isLowStock
        );
    }
}