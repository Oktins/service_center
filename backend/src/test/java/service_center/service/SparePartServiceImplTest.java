package service_center.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import service_center.domain.entity.SparePart;
import service_center.domain.exception.ResourceNotFoundException;
import service_center.dto.request.SparePartCreateDto;
import service_center.dto.response.SparePartResponse;
import service_center.repository.SparePartRepository;
import service_center.service.impl.SparePartServiceImpl;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SparePartServiceImplTest {

    @Mock
    private SparePartRepository sparePartRepository;

    @InjectMocks
    private SparePartServiceImpl sparePartService;

    @Test
    void create_ShouldSaveAndReturnSparePart() {
        SparePartCreateDto dto = new SparePartCreateDto(
                "Вакуумный клапан",
                "VAC-001",
                "Клапан для вакуумного модуля",
                5,
                "шт",
                new BigDecimal("42.50"),
                1
        );
        SparePart savedPart = buildTestSparePart();

        when(sparePartRepository.save(any(SparePart.class))).thenReturn(savedPart);

        SparePartResponse response = sparePartService.create(dto);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Вакуумный клапан", response.name());
        assertEquals(5, response.quantity());
    }

    @Test
    void getById_ShouldThrow_WhenNotFound() {
        when(sparePartRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> sparePartService.getById(404L));
    }

    @Test
    void update_ShouldUpdateFields() {
        SparePart part = buildTestSparePart();
        SparePart updatedPart = buildTestSparePart();
        updatedPart.setQuantity(8);

        when(sparePartRepository.findById(1L)).thenReturn(Optional.of(part));
        when(sparePartRepository.save(part)).thenReturn(updatedPart);

        SparePartResponse response = sparePartService.addStock(1L, 3);

        assertEquals(8, part.getQuantity());
        assertEquals(8, response.quantity());
    }

    private SparePart buildTestSparePart() {
        return SparePart.builder()
                .id(1L)
                .name("Вакуумный клапан")
                .article("VAC-001")
                .description("Клапан для вакуумного модуля")
                .quantity(5)
                .unit("шт")
                .price(new BigDecimal("42.50"))
                .minQuantity(1)
                .build();
    }
}
