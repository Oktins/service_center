package service_center.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // 1. Добавить новую запчасть в каталог
    @PostMapping
    public ResponseEntity<SparePartResponse> create(@Valid @RequestBody SparePartCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sparePartService.create(dto));
    }

    // 2. Получить запчасть по ID
    @GetMapping("/{id}")
    public ResponseEntity<SparePartResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sparePartService.getById(id));
    }

    // 3. Получить запчасть по артикулу (удобно для сканеров штрихкодов)
    @GetMapping("/article/{article}")
    public ResponseEntity<SparePartResponse> getByArticle(@PathVariable String article) {
        return ResponseEntity.ok(sparePartService.getByArticle(article));
    }

    // 4. Получить список всех запчастей на складе
    @GetMapping
    public ResponseEntity<Page<SparePartResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(sparePartService.getAll(pageable));
    }

    // 5. Получить список запчастей, которые нужно докупить (остаток <= minQuantity)
    @GetMapping("/low-stock")
    public ResponseEntity<Page<SparePartResponse>> getLowStockParts(Pageable pageable) {
        return ResponseEntity.ok(sparePartService.getLowStockParts(pageable));
    }

    // 6. Пополнить остаток запчасти (приехала поставка)
    @PatchMapping("/{id}/add-stock")
    public ResponseEntity<SparePartResponse> addStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(sparePartService.addStock(id, quantity));
    }
}