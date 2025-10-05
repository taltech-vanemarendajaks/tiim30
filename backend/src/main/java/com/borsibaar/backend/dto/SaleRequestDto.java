package com.borsibaar.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record SaleRequestDto(
        @NotEmpty(message = "Sale items cannot be empty")
        @Size(max = 100, message = "Cannot process more than 100 items in a single sale")
        @Valid
        List<SaleItemRequestDto> items,

        String notes
) {}