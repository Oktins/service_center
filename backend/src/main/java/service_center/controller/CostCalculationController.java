package service_center.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import service_center.domain.enums.Priority;
import service_center.strategy.CostCalculationContext;

import java.math.BigDecimal;
import java.math.RoundingMode;

@RestController
@RequestMapping("/api/v1/cost")
public class CostCalculationController {

    private final CostCalculationContext costCalculationContext;

    public CostCalculationController(CostCalculationContext costCalculationContext) {
        this.costCalculationContext = costCalculationContext;
    }

    @GetMapping("/calculate")
    @PreAuthorize("isAuthenticated()")
    public CostCalculationResponse calculate(@RequestParam BigDecimal baseCost,
                                             @RequestParam Priority priority) {
        BigDecimal calculatedCost = costCalculationContext.calculate(priority, baseCost)
                .setScale(2, RoundingMode.HALF_UP);

        return new CostCalculationResponse(
                calculatedCost,
                priority.name(),
                costCalculationContext.resolveStrategyName(priority)
        );
    }

    public record CostCalculationResponse(
            BigDecimal calculatedCost,
            String priority,
            String strategy
    ) {
    }
}
