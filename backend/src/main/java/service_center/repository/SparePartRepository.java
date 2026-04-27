package service_center.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import service_center.domain.entity.SparePart;

import java.util.Optional;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {

    Optional<SparePart> findByArticle(String article);

    Page<SparePart> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Изменили List на Page и добавили Pageable
    @Query("SELECT s FROM SparePart s WHERE s.quantity <= s.minQuantity")
    Page<SparePart> findLowStockParts(Pageable pageable);
}