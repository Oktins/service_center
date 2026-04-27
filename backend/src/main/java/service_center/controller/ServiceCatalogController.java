package service_center.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import service_center.dto.request.ServiceCatalogCreateDto;
import service_center.dto.response.ServiceCatalogResponse;
import service_center.service.ServiceCatalogService;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceCatalogController {

    private final ServiceCatalogService serviceCatalogService;

    @GetMapping
    public ResponseEntity<List<ServiceCatalogResponse>> getAll() {
        return ResponseEntity.ok(serviceCatalogService.getAll());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ServiceCatalogResponse>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(serviceCatalogService.getByCategory(categoryId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ServiceCatalogResponse> create(@Valid @RequestBody ServiceCatalogCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceCatalogService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ServiceCatalogResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ServiceCatalogCreateDto dto) {
        return ResponseEntity.ok(serviceCatalogService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceCatalogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
