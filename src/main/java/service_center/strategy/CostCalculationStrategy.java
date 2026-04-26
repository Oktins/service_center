package service_center.strategy;

import java.math.BigDecimal;

public interface CostCalculationStrategy {

    BigDecimal calculate(BigDecimal baseCost);
}
