package service_center.service;

import service_center.dto.response.CategoryResponse;
import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getCategoryTree();
}
