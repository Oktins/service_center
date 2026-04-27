package service_center.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service_center.domain.entity.Master;
import service_center.domain.entity.Review;
import service_center.domain.entity.ServiceRequest;
import service_center.domain.enums.RequestStatus;
import service_center.domain.exception.BusinessException;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.request.ReviewCreateDto;
import service_center.dto.response.ReviewResponse;
import service_center.repository.MasterRepository;
import service_center.repository.ReviewRepository;
import service_center.repository.ServiceRequestRepository;
import service_center.service.ReviewService;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final MasterRepository masterRepository;

    @Override
    @Transactional
    public ReviewResponse create(Long serviceRequestId, ReviewCreateDto dto) {
        ServiceRequest request = serviceRequestRepository.findById(serviceRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка не найдена с ID: " + serviceRequestId));

        // Отзыв можно оставить только если ремонт завершен
        if (request.getStatus() != RequestStatus.COMPLETED) {
            throw new BusinessException("Оставить отзыв можно только на завершенную заявку");
        }

        if (reviewRepository.findByServiceRequestId(serviceRequestId).isPresent()) {
            throw new BusinessException("Отзыв на эту заявку уже существует");
        }

        Master master = request.getMaster();
        if (master == null) {
            throw new BusinessException("Невозможно оставить отзыв: к заявке не привязан мастер");
        }

        Review review = Review.builder()
                .serviceRequest(request)
                .client(request.getClient())
                .master(master)
                .rating(dto.rating())
                .comment(dto.comment())
                .build();

        Review savedReview = reviewRepository.save(review);

        // ПЕРЕСЧЕТ РЕЙТИНГА МАСТЕРА
        recalculateMasterRating(master);

        return mapToResponse(savedReview);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getById(Long id) {
        return mapToResponse(reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Отзыв не найден с ID: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getByServiceRequestId(Long serviceRequestId) {
        return mapToResponse(reviewRepository.findByServiceRequestId(serviceRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Отзыв не найден для заявки с ID: " + serviceRequestId)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getByMasterId(Long masterId, Pageable pageable) {
        return reviewRepository.findAllByMasterId(masterId, pageable).map(this::mapToResponse);
    }

    /**
     * Приватный метод для пересчета рейтинга мастера
     */
    private void recalculateMasterRating(Master master) {
        Double avgRating = reviewRepository.calculateAverageRatingByMasterId(master.getId());
        if (avgRating != null) {
            // Округляем до 1 знака после запятой (например, 4.7)
            BigDecimal roundedRating = BigDecimal.valueOf(avgRating).setScale(1, RoundingMode.HALF_UP);
            master.setRating(roundedRating);
            masterRepository.save(master);
        }
    }

    private ReviewResponse mapToResponse(Review review) {
        // Достаем имя мастера
        String masterName = review.getMaster().getUser().getFirstName() + " " +
                review.getMaster().getUser().getLastName();

        // Достаем имя клиента из заявки
        String clientName = review.getServiceRequest().getClient().getFirstName() + " " +
                review.getServiceRequest().getClient().getLastName();

        return new ReviewResponse(
                review.getId(),
                review.getServiceRequest().getId(),
                clientName,      // <-- Теперь здесь правильный String (Имя клиента)
                masterName,      // <-- Имя мастера
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
