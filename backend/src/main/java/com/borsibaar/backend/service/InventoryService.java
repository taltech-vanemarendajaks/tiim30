package com.borsibaar.backend.service;

import com.borsibaar.backend.dto.*;
import com.borsibaar.backend.entity.Inventory;
import com.borsibaar.backend.entity.InventoryTransaction;
import com.borsibaar.backend.entity.Product;
import com.borsibaar.backend.mapper.InventoryMapper;
import com.borsibaar.backend.repository.InventoryRepository;
import com.borsibaar.backend.repository.InventoryTransactionRepository;
import com.borsibaar.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final ProductRepository productRepository;
    private final InventoryMapper inventoryMapper;

    @Transactional(readOnly = true)
    public List<InventoryResponseDto> getByOrganization(Long organizationId) {
        return getByOrganization(organizationId, null);
    }

    @Transactional(readOnly = true)
    public List<InventoryResponseDto> getByOrganization(Long organizationId, Long categoryId) {
        List<Inventory> inventories;

        if (categoryId != null) {
            inventories = inventoryRepository.findByOrganizationIdAndCategoryId(organizationId, categoryId);
        } else {
            inventories = inventoryRepository.findByOrganizationId(organizationId);
        }

        return inventories.stream()
                .map(inv -> {
                    InventoryResponseDto base = inventoryMapper.toResponse(inv);
                    Product product = productRepository.findById(inv.getProductId())
                            .orElse(null);

                    String productName = product != null ? product.getName() : "Unknown Product";
                    BigDecimal unitPrice = product != null ? product.getBasePrice() : BigDecimal.ZERO;

                    return new InventoryResponseDto(
                            base.id(),
                            base.organizationId(),
                            base.productId(),
                            productName,
                            base.quantity(),
                            unitPrice,
                            base.updatedAt()
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public InventoryResponseDto getByProductAndOrganization(Long productId, Long organizationId) {
        Inventory inventory = inventoryRepository
                .findByOrganizationIdAndProductId(organizationId, productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No inventory found for this product"));

        InventoryResponseDto base = inventoryMapper.toResponse(inventory);
        Product product = productRepository.findById(productId)
                .orElse(null);

        String productName = product != null ? product.getName() : "Unknown Product";
        BigDecimal unitPrice = product != null ? product.getBasePrice() : BigDecimal.ZERO;

        return new InventoryResponseDto(
                base.id(),
                base.organizationId(),
                base.productId(),
                productName,
                base.quantity(),
                unitPrice,
                base.updatedAt()
        );
    }

    @Transactional
    public InventoryResponseDto addStock(AddStockRequestDto request, UUID userId, Long organizationId) {
        // Verify product exists and belongs to organization
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found"));

        if (!product.getOrganizationId().equals(organizationId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Product does not belong to your organization");
        }

        // Get or create inventory
        Inventory inventory = inventoryRepository
                .findByOrganizationIdAndProductId(organizationId, request.productId())
                .orElseGet(() -> {
                    Inventory newInv = new Inventory();
                    newInv.setOrganizationId(organizationId);
                    newInv.setProductId(request.productId());
                    newInv.setQuantity(BigDecimal.ZERO);
                    newInv.setCreatedAt(OffsetDateTime.now());
                    newInv.setUpdatedAt(OffsetDateTime.now());
                    return inventoryRepository.save(newInv);
                });

        BigDecimal oldQuantity = inventory.getQuantity();
        BigDecimal newQuantity = oldQuantity.add(request.quantity());

        inventory.setQuantity(newQuantity);
        inventory.setUpdatedAt(OffsetDateTime.now());
        inventory = inventoryRepository.save(inventory);

        // Create transaction record
        createTransaction(inventory.getId(), "PURCHASE", request.quantity(),
                oldQuantity, newQuantity, null, request.notes(), userId);

        InventoryResponseDto base = inventoryMapper.toResponse(inventory);
        return new InventoryResponseDto(
                base.id(),
                base.organizationId(),
                base.productId(),
                product.getName(),
                base.quantity(),
                product.getBasePrice(),
                base.updatedAt()
        );
    }

    @Transactional
    public InventoryResponseDto removeStock(RemoveStockRequestDto request, UUID userId, Long organizationId) {
        // Verify product exists and belongs to organization
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found"));

        if (!product.getOrganizationId().equals(organizationId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Product does not belong to your organization");
        }

        Inventory inventory = inventoryRepository
                .findByOrganizationIdAndProductId(organizationId, request.productId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No inventory found for this product"));

        BigDecimal oldQuantity = inventory.getQuantity();
        BigDecimal newQuantity = oldQuantity.subtract(request.quantity());

        if (newQuantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Insufficient stock. Available: " + oldQuantity + ", Requested: " + request.quantity());
        }

        inventory.setQuantity(newQuantity);
        inventory.setUpdatedAt(OffsetDateTime.now());
        inventory = inventoryRepository.save(inventory);

        // Create transaction record (negative quantity change)
        createTransaction(inventory.getId(), "ADJUSTMENT", request.quantity().negate(),
                oldQuantity, newQuantity, request.referenceId(), request.notes(), userId);

        InventoryResponseDto base = inventoryMapper.toResponse(inventory);
        return new InventoryResponseDto(
                base.id(),
                base.organizationId(),
                base.productId(),
                product.getName(),
                base.quantity(),
                product.getBasePrice(),
                base.updatedAt()
        );
    }

    @Transactional
    public InventoryResponseDto adjustStock(AdjustStockRequestDto request, UUID userId, Long organizationId) {
        // Verify product exists and belongs to organization
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found"));

        if (!product.getOrganizationId().equals(organizationId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Product does not belong to your organization");
        }

        Inventory inventory = inventoryRepository
                .findByOrganizationIdAndProductId(organizationId, request.productId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No inventory found for this product"));

        BigDecimal oldQuantity = inventory.getQuantity();
        BigDecimal quantityChange = request.newQuantity().subtract(oldQuantity);

        inventory.setQuantity(request.newQuantity());
        inventory.setUpdatedAt(OffsetDateTime.now());
        inventory = inventoryRepository.save(inventory);

        // Create transaction record
        createTransaction(inventory.getId(), "ADJUSTMENT", quantityChange,
                oldQuantity, request.newQuantity(), null, request.notes(), userId);

        InventoryResponseDto base = inventoryMapper.toResponse(inventory);
        return new InventoryResponseDto(
                base.id(),
                base.organizationId(),
                base.productId(),
                product.getName(),
                base.quantity(),
                product.getBasePrice(),
                base.updatedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<InventoryTransactionResponseDto> getTransactionHistory(Long productId, Long organizationId) {
        Inventory inventory = inventoryRepository
                .findByOrganizationIdAndProductId(organizationId, productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No inventory found for this product"));

        return inventoryTransactionRepository
                .findByInventoryIdOrderByCreatedAtDesc(inventory.getId())
                .stream()
                .map(inventoryMapper::toTransactionResponse)
                .toList();
    }

    private void createTransaction(Long inventoryId, String type, BigDecimal quantityChange,
                                   BigDecimal quantityBefore, BigDecimal quantityAfter,
                                   String referenceId, String notes, UUID userId) {
        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setInventoryId(inventoryId);
        transaction.setTransactionType(type);
        transaction.setQuantityChange(quantityChange);
        transaction.setQuantityBefore(quantityBefore);
        transaction.setQuantityAfter(quantityAfter);
        transaction.setReferenceId(referenceId);
        transaction.setNotes(notes);
        transaction.setCreatedBy(userId);
        transaction.setCreatedAt(OffsetDateTime.now());
        inventoryTransactionRepository.save(transaction);
    }
}
