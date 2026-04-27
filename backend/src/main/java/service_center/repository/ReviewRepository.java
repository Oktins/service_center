package service_center.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import service_center.domain.entity.Review;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Пагинация для отзывов
    Page<Review> findAllByMasterId(Long masterId, Pageable pageable);

    // Проверка, оставлял ли клиент уже отзыв на эту заявку
    Optional<Review> findByServiceRequestId(Long serviceRequestId);

    // Магия SQL: считаем среднюю оценку мастера
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.master.id = :masterId")
    Double calculateAverageRatingByMasterId(@Param("masterId") Long masterId);
}