package service_center;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import service_center.domain.entity.Category;
import service_center.domain.entity.News;
import service_center.domain.entity.ServiceCatalog;
import service_center.domain.entity.User;
import service_center.domain.enums.Role;
import service_center.repository.CategoryRepository;
import service_center.repository.NewsRepository;
import service_center.repository.ServiceCatalogRepository;
import service_center.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceCatalogRepository serviceCatalogRepository;
    private final NewsRepository newsRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        log.info("Starting database seeding...");
        seedUsers();
        seedCategories();
        seedServices();
        seedNews();
        log.info("Database seeding completed.");
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            userRepository.saveAll(List.of(
                User.builder()
                        .email("admin@service.com")
                        .password(passwordEncoder.encode("admin123"))
                        .firstName("Admin")
                        .lastName("System")
                        .role(Role.ADMIN)
                        .isActive(true)
                        .build(),
                User.builder()
                        .email("manager@service.com")
                        .password(passwordEncoder.encode("manager123"))
                        .firstName("Manager")
                        .lastName("Ivanov")
                        .role(Role.MANAGER)
                        .isActive(true)
                        .build(),
                User.builder()
                        .email("master@service.com")
                        .password(passwordEncoder.encode("master123"))
                        .firstName("Master")
                        .lastName("Petrov")
                        .role(Role.MASTER)
                        .isActive(true)
                        .build()
            ));
            log.info("Users seeded.");
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            Category gadgets = categoryRepository.save(Category.builder().name("Гаджеты").build());
            categoryRepository.save(Category.builder().name("Смартфоны").parent(gadgets).build());
            categoryRepository.save(Category.builder().name("Планшеты").parent(gadgets).build());

            Category appliances = categoryRepository.save(Category.builder().name("Бытовая техника").build());
            categoryRepository.save(Category.builder().name("Пылесосы").parent(appliances).build());
            log.info("Categories seeded.");
        }
    }

    private void seedServices() {
        if (serviceCatalogRepository.count() == 0) {
            Category smartphones = categoryRepository.findByName("Смартфоны").orElse(null);
            Category tablets = categoryRepository.findByName("Планшеты").orElse(null);
            Category vacuums = categoryRepository.findByName("Пылесосы").orElse(null);

            if (smartphones != null) {
                serviceCatalogRepository.saveAll(List.of(
                    ServiceCatalog.builder()
                            .name("Замена экрана iPhone 13")
                            .description("Замена поврежденного дисплея на новый оригинальный.")
                            .basePrice(new BigDecimal("15000.00"))
                            .category(smartphones)
                            .isActive(true)
                            .build(),
                    ServiceCatalog.builder()
                            .name("Замена аккумулятора Samsung S21")
                            .description("Установка новой батареи повышенной емкости.")
                            .basePrice(new BigDecimal("4500.00"))
                            .category(smartphones)
                            .isActive(true)
                            .build(),
                    ServiceCatalog.builder()
                            .name("Прошивка Android")
                            .description("Обновление или восстановление системного ПО.")
                            .basePrice(new BigDecimal("1500.00"))
                            .category(smartphones)
                            .isActive(true)
                            .build(),
                    ServiceCatalog.builder()
                            .name("Чистка после залития")
                            .description("Удаление окислов и восстановление после контакта с водой.")
                            .basePrice(new BigDecimal("3000.00"))
                            .category(smartphones)
                            .isActive(true)
                            .build()
                ));
            }

            if (tablets != null) {
                serviceCatalogRepository.saveAll(List.of(
                    ServiceCatalog.builder()
                            .name("Замена стекла iPad Air")
                            .description("Замена сенсорного стекла без замены матрицы.")
                            .basePrice(new BigDecimal("8000.00"))
                            .category(tablets)
                            .isActive(true)
                            .build(),
                    ServiceCatalog.builder()
                            .name("Ремонт разъема зарядки")
                            .description("Пайка или замена порта USB-C / Lightning.")
                            .basePrice(new BigDecimal("2500.00"))
                            .category(tablets)
                            .isActive(true)
                            .build()
                ));
            }

            if (vacuums != null) {
                serviceCatalogRepository.saveAll(List.of(
                    ServiceCatalog.builder()
                            .name("Замена двигателя Dyson")
                            .description("Профессиональная замена вышедшего из строя мотора.")
                            .basePrice(new BigDecimal("12000.00"))
                            .category(vacuums)
                            .isActive(true)
                            .build(),
                    ServiceCatalog.builder()
                            .name("Чистка фильтров и циклонного блока")
                            .description("Глубокая очистка всех внутренних элементов.")
                            .basePrice(new BigDecimal("2000.00"))
                            .category(vacuums)
                            .isActive(true)
                            .build()
                ));
            }
            log.info("Services seeded.");
        }
    }

    private void seedNews() {
        if (newsRepository.count() == 0) {
            newsRepository.saveAll(List.of(
                News.builder()
                        .title("Весенняя акция!")
                        .content("Скидка 20% на замену аккумуляторов смартфонов до конца мая.")
                        .isPromotion(true)
                        .expiresAt(LocalDateTime.now().plusMonths(1))
                        .build(),
                News.builder()
                        .title("Мы открылись!")
                        .content("Наш новый филиал по адресу ул. Ленина 10 ждет вас.")
                        .isPromotion(false)
                        .build(),
                News.builder()
                        .title("График работы на праздники")
                        .content("1 и 9 мая центр не работает. Остальные дни в обычном режиме.")
                        .isPromotion(false)
                        .build()
            ));
            log.info("News seeded.");
        }
    }
}
