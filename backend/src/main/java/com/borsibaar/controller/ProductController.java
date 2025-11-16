package com.borsibaar.controller;

import com.borsibaar.dto.ProductRequestDto;
import com.borsibaar.dto.ProductResponseDto;
import com.borsibaar.entity.User;
import com.borsibaar.service.ProductService;
import com.borsibaar.util.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponseDto create(@RequestBody @Valid ProductRequestDto request) {
        User user = SecurityUtils.getCurrentUser();
        return productService.create(request, user.getOrganizationId());
    }

    @GetMapping("/{id}")
    public ProductResponseDto get(@PathVariable Long id) {
        return productService.getById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }

}
