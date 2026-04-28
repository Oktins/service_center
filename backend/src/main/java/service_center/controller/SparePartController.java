package service_center.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service_center.dto.request.SparePartCreateDto;
import service_center.dto.response.SparePartResponse;
import service_center.service.SparePartService;

@RestController
@RequestMapping("/api/spare-parts")
@RequiredArgsConstructor
public class SparePartController {

    private final SparePartService sparePartService;

    @PostMapping
    public ResponseEntity<SparePartResponse> create(@Valid @RequestBody SparePartCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sparePartService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePartResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sparePartService.getById(id));
    }

    @GetMapping("/article/{article}")
    public ResponseEntity<SparePartResponse> getByArticle(@PathVariable String article) {
        return ResponseEntity.ok(sparePartService.getByArticle(article));
    }

    @GetMapping
    public ResponseEntity<Page<SparePartResponse>> getAll(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(sparePartService.getAll(pageable));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<Page<SparePartResponse>> getLowStockParts(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(sparePartService.getLowStockParts(pageable));
    }

    @PatchMapping("/{id}/add-stock")
    public ResponseEntity<SparePartResponse> addStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(sparePartService.addStock(id, quantity));
    }
}
