package service_center.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import service_center.domain.entity.Master;
import java.util.Optional;

@Repository
public interface MasterRepository extends JpaRepository<Master, Long> {

    Optional<Master> findByUserId(Long userId);

    boolean existsByUserId(Long userId);

    Page<Master> findAllByIsAvailableTrue(Pageable pageable);

    long countByIsAvailableTrue();

    @Query("SELECT m FROM Master m ORDER BY m.rating DESC")
    Page<Master> findAllOrderByRatingDesc(Pageable pageable);
}
