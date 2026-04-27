package service_center.strategy.impl;

import org.springframework.stereotype.Component;
import service_center.strategy.CostCalculationStrategy;

import java.math.BigDecimal;

@Component("standardCostStrategy")
public class StandardCostStrategy implements CostCalculationStrategy {

    @Override
    public BigDecimal calculate(BigDecimal baseCost) {
        return baseCost;
    }
}
