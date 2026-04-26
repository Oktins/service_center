package service_center.strategy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import service_center.domain.enums.Priority;

import java.math.BigDecimal;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CostCalculationContext {

    private static final String STANDARD_STRATEGY = "standardCostStrategy";
    private static final String URGENT_STRATEGY = "urgentCostStrategy";

    private final Map<String, CostCalculationStrategy> strategies;

    public BigDecimal calculate(Priority priority, BigDecimal baseCost) {
        return strategies.get(resolveStrategyName(priority)).calculate(baseCost);
    }

    public String resolveStrategyName(Priority priority) {
        return Priority.URGENT.equals(priority) ? URGENT_STRATEGY : STANDARD_STRATEGY;
    }
}
