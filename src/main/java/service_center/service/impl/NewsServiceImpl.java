package service_center.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service_center.domain.entity.News;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.request.NewsCreateDto;
import service_center.dto.response.NewsResponse;
import service_center.repository.NewsRepository;
import service_center.service.NewsService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsServiceImpl implements NewsService {

    private final NewsRepository newsRepository;

    @Override
    @Transactional
    public NewsResponse create(NewsCreateDto dto) {
        News news = News.builder()
                .title(dto.title())
                .content(dto.content())
                .imageUrl(dto.imageUrl())
                .isPromotion(dto.isPromotion())
                .expiresAt(dto.expiresAt())
                .build();
        return mapToResponse(newsRepository.save(news));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewsResponse> getAll() {
        return newsRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public NewsResponse getById(Long id) {
        return mapToResponse(getNewsEntity(id));
    }

    @Override
    @Transactional
    public NewsResponse update(Long id, NewsCreateDto dto) {
        News news = getNewsEntity(id);
        news.setTitle(dto.title());
        news.setContent(dto.content());
        news.setImageUrl(dto.imageUrl());
        news.setPromotion(dto.isPromotion());
        news.setExpiresAt(dto.expiresAt());
        return mapToResponse(newsRepository.save(news));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        News news = getNewsEntity(id);
        newsRepository.delete(news);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewsResponse> getActiveNews() {
        return newsRepository.findAllByExpiresAtIsNullOrExpiresAtAfterOrderByCreatedAtDesc(LocalDateTime.now()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private News getNewsEntity(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Новость не найдена с ID: " + id));
    }

    private NewsResponse mapToResponse(News news) {
        return new NewsResponse(
                news.getId(),
                news.getTitle(),
                news.getContent(),
                news.getImageUrl(),
                news.isPromotion(),
                news.getCreatedAt(),
                news.getExpiresAt()
        );
    }
}
