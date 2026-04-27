package service_center.service;

import service_center.dto.request.NewsCreateDto;
import service_center.dto.response.NewsResponse;

import java.util.List;

public interface NewsService {
    NewsResponse create(NewsCreateDto dto);
    List<NewsResponse> getAll();
    NewsResponse getById(Long id);
    NewsResponse update(Long id, NewsCreateDto dto);
    void delete(Long id);
    List<NewsResponse> getActiveNews();
}
