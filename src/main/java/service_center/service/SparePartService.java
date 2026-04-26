package service_center.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import service_center.dto.request.SparePartCreateDto;
import service_center.dto.response.SparePartResponse;

public interface SparePartService {
    SparePartResponse create(SparePartCreateDto dto);
    SparePartResponse getById(Long id);
    SparePartResponse getByArticle(String article);
    Page<SparePartResponse> getAll(Pageable pageable);
    Page<SparePartResponse> getLowStockParts(Pageable pageable);
    SparePartResponse addStock(Long id, Integer quantityToAdd);
}