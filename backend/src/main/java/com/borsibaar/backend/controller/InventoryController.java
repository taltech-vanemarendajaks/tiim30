package com.borsibaar.backend.controller;

import com.borsibaar.backend.dto.*;
import com.borsibaar.backend.entity.User;
import com.borsibaar.backend.repository.UserRepository;
import com.borsibaar.backend.service.InventoryService;
import com.borsibaar.backend.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @GetMapping
    public List<InventoryResponseDto> getOrganizationInventory(
            @RequestParam(required = false) Long categoryId,
            @CookieValue(name = "jwt", required = false) String token) {
        User user = authenticateUser(token);
        return inventoryService.getByOrganization(user.getOrganizationId(), categoryId);
    }

    @GetMapping("/product/{productId}")
    public InventoryResponseDto getProductInventory(
            @PathVariable Long productId,
            @CookieValue(name = "jwt", required = false) String token) {
        User user = authenticateUser(token);
        return inventoryService.getByProductAndOrganization(productId, user.getOrganizationId());
    }

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryResponseDto addStock(
            @RequestBody @Valid AddStockRequestDto request,
            @CookieValue(name = "jwt", required = false) String token) {
        User user = authenticateUser(token);
        System.out.println("Received request: " + request); // DEBUG
        System.out.println("ProductId: " + request.productId()); // DEBUG
        System.out.println("Quantity: " + request.quantity()); // DEBUG

        return inventoryService.addStock(request, user.getId(), user.getOrganizationId());
    }

    @PostMapping("/remove")
    public InventoryResponseDto removeStock(
            @RequestBody @Valid RemoveStockRequestDto request,
            @CookieValue(name = "jwt", required = false) String token) {
        User user = authenticateUser(token);
        return inventoryService.removeStock(request, user.getId(), user.getOrganizationId());
    }

    @PostMapping("/adjust")
    public InventoryResponseDto adjustStock(
            @RequestBody @Valid AdjustStockRequestDto request,
            @CookieValue(name = "jwt", required = false) String token) {
        User user = authenticateUser(token);
        return inventoryService.adjustStock(request, user.getId(), user.getOrganizationId());
    }

    @GetMapping("/product/{productId}/history")
    public List<InventoryTransactionResponseDto> getTransactionHistory(
            @PathVariable Long productId,
            @CookieValue(name = "jwt", required = false) String token) {
        User user = authenticateUser(token);
        return inventoryService.getTransactionHistory(productId, user.getOrganizationId());
    }

    private User authenticateUser(String token) {
        if (token == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        Claims claims = jwtService.parseToken(token);
        User user = userRepository.findByEmail(claims.getSubject())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        if (user.getOrganizationId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User has no organization");
        }
        return user;
    }
}
