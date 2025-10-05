package com.borsibaar.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record SaleResponseDto(
        String saleId,
        List<SaleItemResponseDto> items,
        BigDecimal totalAmount,
        String notes,
        OffsetDateTime timestamp
) {}