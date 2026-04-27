package service_center.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import service_center.domain.entity.News;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    List<News> findAllByExpiresAtIsNullOrExpiresAtAfterOrderByCreatedAtDesc(LocalDateTime now);
}
