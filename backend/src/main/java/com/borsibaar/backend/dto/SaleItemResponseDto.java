package com.borsibaar.backend.dto;

import java.math.BigDecimal;

public record SaleItemResponseDto(
        Long productId,
        String productName,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal totalPrice
) {}