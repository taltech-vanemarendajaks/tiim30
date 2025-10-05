package com.borsibaar.backend.mapper;

import com.borsibaar.backend.dto.InventoryResponseDto;
import com.borsibaar.backend.dto.InventoryTransactionResponseDto;
import com.borsibaar.backend.entity.Inventory;
import com.borsibaar.backend.entity.InventoryTransaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface InventoryMapper {

    @Mapping(target = "productName", ignore = true) // Set in service
    @Mapping(target = "unitPrice", ignore = true) // Set in service
    @Mapping(target = "updatedAt", source = "updatedAt", dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    InventoryResponseDto toResponse(Inventory inventory);

    @Mapping(target = "createdBy", source = "createdBy")
    @Mapping(target = "createdAt", source = "createdAt", dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    InventoryTransactionResponseDto toTransactionResponse(InventoryTransaction transaction);

    default String map(UUID uuid) {
        return uuid != null ? uuid.toString() : null;
    }

    default String map(OffsetDateTime dateTime) {
        return dateTime != null ? dateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME) : null;
    }
}
