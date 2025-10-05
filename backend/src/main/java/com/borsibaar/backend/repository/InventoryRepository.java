package com.borsibaar.backend.repository;

import com.borsibaar.backend.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByOrganizationIdAndProductId(Long organizationId, Long productId);

    List<Inventory> findByOrganizationId(Long organizationId);

    @Query("SELECT i FROM Inventory i JOIN Product p ON i.productId = p.id " +
           "WHERE i.organizationId = :organizationId AND p.categoryId = :categoryId")
    List<Inventory> findByOrganizationIdAndCategoryId(@Param("organizationId") Long organizationId,
                                                      @Param("categoryId") Long categoryId);

    boolean existsByProductId(Long productId);
}
