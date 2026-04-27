package service_center.domain.exception;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String partName, int requested, int available) {
        super("Недостаточно запчастей '" + partName +
                "': запрошено " + requested +
                ", доступно " + available);
    }
}