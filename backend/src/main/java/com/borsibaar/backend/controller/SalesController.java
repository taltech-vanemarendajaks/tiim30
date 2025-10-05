package com.borsibaar.backend.controller;

import com.borsibaar.backend.dto.SaleRequestDto;
import com.borsibaar.backend.dto.SaleResponseDto;
import com.borsibaar.backend.entity.User;
import com.borsibaar.backend.repository.UserRepository;
import com.borsibaar.backend.service.JwtService;
import com.borsibaar.backend.service.SalesService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SalesController {

    private final SalesService salesService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SaleResponseDto processSale(@RequestBody @Valid SaleRequestDto request,
                                     @CookieValue(name = "jwt", required = false) String token) {
        User user = authenticateUser(token);
        return salesService.processSale(request, user.getId(), user.getOrganizationId());
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