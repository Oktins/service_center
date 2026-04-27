package service_center.strategy.impl;

import org.springframework.stereotype.Component;
import service_center.strategy.CostCalculationStrategy;

import java.math.BigDecimal;

@Component("urgentCostStrategy")
public class UrgentCostStrategy implements CostCalculationStrategy {

    private static final BigDecimal URGENT_MULTIPLIER = new BigDecimal("1.5");

    @Override
    public BigDecimal calculate(BigDecimal baseCost) {
        return baseCost.multiply(URGENT_MULTIPLIER);
    }
}
