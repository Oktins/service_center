package service_center.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import service_center.domain.entity.Category;
import service_center.dto.response.CategoryResponse;
import service_center.repository.CategoryRepository;
import service_center.service.CategoryService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryResponse> getCategoryTree() {
        List<Category> rootCategories = categoryRepository.findByParentIsNull();
        return rootCategories.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .subCategories(category.getSubCategories().stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList()))
                .build();
    }
}
