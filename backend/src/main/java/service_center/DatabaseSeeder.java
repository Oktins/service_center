package service_center;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import service_center.domain.entity.Category;
import service_center.domain.entity.EquipmentType;
import service_center.domain.entity.Master;
import service_center.domain.entity.News;
import service_center.domain.entity.ServiceCatalog;
import service_center.domain.entity.ServiceRequest;
import service_center.domain.entity.User;
import service_center.domain.enums.Priority;
import service_center.domain.enums.RequestStatus;
import service_center.domain.enums.Role;
import service_center.repository.CategoryRepository;
import service_center.repository.EquipmentTypeRepository;
import service_center.repository.MasterRepository;
import service_center.repository.NewsRepository;
import service_center.repository.ServiceCatalogRepository;
import service_center.repository.ServiceRequestRepository;
import service_center.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder {

    private static final String LAPTOP_IMAGE = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
    private static final String PHONE_IMAGE = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80";
    private static final String TABLET_IMAGE = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80";
    private static final String VACUUM_IMAGE = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80";
    private static final String PRINTER_IMAGE = "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1200&q=80";
    private static final String CONSOLE_IMAGE = "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1200&q=80";
    private static final String NEWS_IMAGE = "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?auto=format&fit=crop&w=1200&q=80";

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ServiceCatalogRepository serviceCatalogRepository;
    private final NewsRepository newsRepository;
    private final MasterRepository masterRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final EquipmentTypeRepository equipmentTypeRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        log.info("Starting database seeding...");
        seedUsers();
        seedCategories();
        seedEquipmentTypes();
        seedServices();
        seedMasters();
        seedServiceRequests();
        seedNews();
        log.info("Database seeding completed.");
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            userRepository.saveAll(List.of(
                    user("admin@service.com", "admin123", "Алексей", "Администраторов", Role.ADMIN),
                    user("superadmin@service.com", "admin123", "Марина", "Главная", Role.ADMIN),
                    user("manager@service.com", "manager123", "Ирина", "Соколова", Role.MANAGER),
                    user("manager2@service.com", "manager123", "Павел", "Орлов", Role.MANAGER),
                    user("manager3@service.com", "manager123", "Елена", "Морозова", Role.MANAGER),
                    user("master@service.com", "master123", "Дмитрий", "Кузнецов", Role.MASTER),
                    user("master2@service.com", "master123", "Сергей", "Волков", Role.MASTER),
                    user("master3@service.com", "master123", "Антон", "Фёдоров", Role.MASTER),
                    user("master4@service.com", "master123", "Николай", "Павлов", Role.MASTER),
                    user("master5@service.com", "master123", "Олег", "Романов", Role.MASTER),
                    user("client@service.com", "client123", "Ольга", "Иванова", Role.CLIENT),
                    user("client2@service.com", "client123", "Михаил", "Петров", Role.CLIENT),
                    user("client3@service.com", "client123", "Наталья", "Смирнова", Role.CLIENT),
                    user("client4@service.com", "client123", "Андрей", "Новиков", Role.CLIENT),
                    user("client5@service.com", "client123", "Виктория", "Лебедева", Role.CLIENT)
            ));
            log.info("Users seeded.");
        }
    }

    private User user(String email, String password, String firstName, String lastName, Role role) {
        return User.builder()
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName(firstName)
                .lastName(lastName)
                .role(role)
                .isActive(true)
                .build();
    }

    private void seedCategories() {
        Category gadgets = getOrCreateCategory("Гаджеты", null);
        getOrCreateCategory("Смартфоны", gadgets);
        getOrCreateCategory("Планшеты", gadgets);

        Category appliances = getOrCreateCategory("Бытовая техника", null);
        getOrCreateCategory("Пылесосы", appliances);

        Category computers = getOrCreateCategory("Компьютеры", null);
        getOrCreateCategory("Ноутбуки", computers);
        getOrCreateCategory("Настольные ПК", computers);
        getOrCreateCategory("Принтеры и МФУ", computers);

        Category consoles = getOrCreateCategory("Игровые консоли", null);
        getOrCreateCategory("PlayStation", consoles);
        getOrCreateCategory("Xbox", consoles);

        log.info("Categories seeded.");
    }

    private Category getOrCreateCategory(String name, Category parent) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(name)
                        .parent(parent)
                        .build()));
    }

    private void seedEquipmentTypes() {
        createEquipmentTypeIfMissing("Смартфон", "Мобильные телефоны и коммуникаторы");
        createEquipmentTypeIfMissing("Планшет", "Планшетные компьютеры");
        createEquipmentTypeIfMissing("Ноутбук", "Ноутбуки и ультрабуки");
        createEquipmentTypeIfMissing("Настольный ПК", "Системные блоки и моноблоки");
        createEquipmentTypeIfMissing("Принтер/МФУ", "Печатная техника");
        createEquipmentTypeIfMissing("Игровая консоль", "PlayStation, Xbox и аксессуары");
        createEquipmentTypeIfMissing("Пылесос", "Бытовые и робот-пылесосы");
    }

    private void createEquipmentTypeIfMissing(String name, String description) {
        if (equipmentTypeRepository.findAll().stream().noneMatch(type -> type.getName().equals(name))) {
            equipmentTypeRepository.save(EquipmentType.builder()
                    .name(name)
                    .description(description)
                    .build());
        }
    }

    private void seedServices() {
        updateExistingServiceImages();

        createServiceIfMissing("Замена экрана iPhone 13", "Замена поврежденного дисплея на новый оригинальный.",
                "15000.00", "Смартфоны", PHONE_IMAGE);
        createServiceIfMissing("Замена аккумулятора Samsung S21", "Установка новой батареи повышенной емкости.",
                "4500.00", "Смартфоны", PHONE_IMAGE);
        createServiceIfMissing("Прошивка Android", "Обновление или восстановление системного ПО.",
                "1500.00", "Смартфоны", PHONE_IMAGE);
        createServiceIfMissing("Чистка после залития", "Удаление окислов и восстановление после контакта с водой.",
                "3000.00", "Смартфоны", PHONE_IMAGE);
        createServiceIfMissing("Замена стекла iPad Air", "Замена сенсорного стекла без замены матрицы.",
                "8000.00", "Планшеты", TABLET_IMAGE);
        createServiceIfMissing("Ремонт разъема зарядки", "Пайка или замена порта USB-C / Lightning.",
                "2500.00", "Планшеты", TABLET_IMAGE);
        createServiceIfMissing("Замена двигателя Dyson", "Профессиональная замена вышедшего из строя мотора.",
                "12000.00", "Пылесосы", VACUUM_IMAGE);
        createServiceIfMissing("Чистка фильтров и циклонного блока", "Глубокая очистка всех внутренних элементов.",
                "2000.00", "Пылесосы", VACUUM_IMAGE);
        createServiceIfMissing("Диагностика ноутбука", "Комплексная проверка питания, материнской платы, накопителя и системы охлаждения.",
                "1200.00", "Ноутбуки", LAPTOP_IMAGE);
        createServiceIfMissing("Замена матрицы ноутбука", "Подбор и установка новой матрицы с проверкой шлейфа и подсветки.",
                "9500.00", "Ноутбуки", LAPTOP_IMAGE);
        createServiceIfMissing("Чистка ноутбука с заменой термопасты", "Профилактика перегрева, чистка кулеров и замена термоинтерфейса.",
                "3500.00", "Ноутбуки", LAPTOP_IMAGE);
        createServiceIfMissing("Апгрейд настольного ПК", "Установка SSD, оперативной памяти, видеокарты и настройка BIOS.",
                "2800.00", "Настольные ПК", LAPTOP_IMAGE);
        createServiceIfMissing("Сборка игрового ПК", "Профессиональная сборка, кабель-менеджмент и стресс-тест комплектующих.",
                "6500.00", "Настольные ПК", LAPTOP_IMAGE);
        createServiceIfMissing("Ремонт лазерного принтера", "Устранение замятий, полос печати, замена роликов и термопленки.",
                "4200.00", "Принтеры и МФУ", PRINTER_IMAGE);
        createServiceIfMissing("Заправка и обслуживание МФУ", "Заправка картриджа, чистка тракта подачи бумаги и настройка печати.",
                "1800.00", "Принтеры и МФУ", PRINTER_IMAGE);
        createServiceIfMissing("Чистка PlayStation 5", "Разборка, удаление пыли, замена термопрокладок и проверка охлаждения.",
                "4500.00", "PlayStation", CONSOLE_IMAGE);
        createServiceIfMissing("Замена HDMI PlayStation", "Пайка нового HDMI-разъема после механического повреждения.",
                "6000.00", "PlayStation", CONSOLE_IMAGE);
        createServiceIfMissing("Ремонт геймпада Xbox", "Замена стиков, кнопок, триггеров и устранение дрифта.",
                "2500.00", "Xbox", CONSOLE_IMAGE);
        createServiceIfMissing("Восстановление питания Xbox Series", "Диагностика цепей питания и ремонт платы консоли.",
                "7000.00", "Xbox", CONSOLE_IMAGE);

        log.info("Services seeded.");
    }

    private void updateExistingServiceImages() {
        serviceCatalogRepository.findAll().forEach(service -> {
            if (service.getImageUrl() == null || service.getImageUrl().isBlank()) {
                service.setImageUrl(imageForCategory(service.getCategory()));
                serviceCatalogRepository.save(service);
            }
        });
    }

    private void createServiceIfMissing(String name, String description, String price, String categoryName, String imageUrl) {
        if (serviceCatalogRepository.existsByName(name)) {
            return;
        }

        Category category = categoryRepository.findByName(categoryName).orElse(null);
        if (category == null) {
            return;
        }

        serviceCatalogRepository.save(ServiceCatalog.builder()
                .name(name)
                .description(description)
                .basePrice(new BigDecimal(price))
                .category(category)
                .imageUrl(imageUrl)
                .isActive(true)
                .build());
    }

    private String imageForCategory(Category category) {
        if (category == null) {
            return NEWS_IMAGE;
        }

        return switch (category.getName()) {
            case "Смартфоны" -> PHONE_IMAGE;
            case "Планшеты" -> TABLET_IMAGE;
            case "Пылесосы" -> VACUUM_IMAGE;
            case "Принтеры и МФУ" -> PRINTER_IMAGE;
            case "PlayStation", "Xbox" -> CONSOLE_IMAGE;
            default -> LAPTOP_IMAGE;
        };
    }

    private void seedMasters() {
        List<String> specializations = List.of(
                "Смартфоны и планшеты",
                "Ноутбуки и ПК",
                "Принтеры и МФУ",
                "Игровые консоли",
                "Бытовая техника"
        );

        List<User> masterUsers = userRepository.findAllByRole(Role.MASTER);
        for (int i = 0; i < masterUsers.size(); i++) {
            User user = masterUsers.get(i);
            if (!masterRepository.existsByUserId(user.getId())) {
                masterRepository.save(Master.builder()
                        .user(user)
                        .specialization(specializations.get(i % specializations.size()))
                        .experienceYears(3 + i)
                        .rating(new BigDecimal("4.%d".formatted(5 + (i % 5))))
                        .isAvailable(true)
                        .build());
            }
        }
        log.info("Masters seeded.");
    }

    private void seedServiceRequests() {
        if (serviceRequestRepository.count() > 0) {
            return;
        }

        List<User> clients = userRepository.findAllByRole(Role.CLIENT);
        List<Master> masters = masterRepository.findAll();
        List<EquipmentType> equipmentTypes = equipmentTypeRepository.findAll().stream()
                .sorted(Comparator.comparing(EquipmentType::getId))
                .toList();

        if (clients.isEmpty() || equipmentTypes.isEmpty()) {
            return;
        }

        List<RequestSeed> seeds = List.of(
                new RequestSeed("Не включается iPhone после падения", "Телефон упал, экран черный, вибрация есть.", "г. Минск, пр-т Независимости, 45", "Смартфон", RequestStatus.NEW, Priority.HIGH, "15000.00", null),
                new RequestSeed("Ноутбук сильно шумит", "Греется и выключается при запуске игр.", "г. Минск, ул. Сурганова, 12", "Ноутбук", RequestStatus.ASSIGNED, Priority.MEDIUM, "3500.00", null),
                new RequestSeed("Полосы при печати", "Лазерный принтер печатает с серыми полосами.", "г. Минск, ул. Немига, 8", "Принтер/МФУ", RequestStatus.IN_PROGRESS, Priority.MEDIUM, "4200.00", null),
                new RequestSeed("PlayStation перегревается", "Через 20 минут появляется предупреждение о перегреве.", "г. Минск, ул. Кальварийская, 21", "Игровая консоль", RequestStatus.COMPLETED, Priority.HIGH, "4500.00", "4500.00"),
                new RequestSeed("Пылесос потерял мощность", "Dyson плохо всасывает, фильтры давно не чистились.", "г. Минск, ул. Богдановича, 67", "Пылесос", RequestStatus.COMPLETED, Priority.LOW, "2000.00", "2000.00"),
                new RequestSeed("Xbox не выводит изображение", "На телевизоре нет сигнала, кабель проверен.", "г. Минск, ул. Притыцкого, 34", "Игровая консоль", RequestStatus.NEW, Priority.URGENT, "7000.00", null),
                new RequestSeed("Разбит экран планшета", "iPad Air после удара, сенсор частично работает.", "г. Минск, ул. Маяковского, 16", "Планшет", RequestStatus.ASSIGNED, Priority.MEDIUM, "8000.00", null),
                new RequestSeed("Компьютер не загружается", "После обновления комплектующих не проходит POST.", "г. Минск, ул. Якуба Коласа, 30", "Настольный ПК", RequestStatus.IN_PROGRESS, Priority.HIGH, "2800.00", null),
                new RequestSeed("Замена аккумулятора Samsung", "Быстро разряжается и выключается на 20%.", "г. Минск, ул. Пулихова, 3", "Смартфон", RequestStatus.COMPLETED, Priority.MEDIUM, "4500.00", "4500.00"),
                new RequestSeed("Заправка МФУ в офисе", "Нужно заправить картридж и настроить сетевую печать.", "г. Минск, ул. Интернациональная, 25", "Принтер/МФУ", RequestStatus.NEW, Priority.LOW, "1800.00", null),
                new RequestSeed("Дрифт стика геймпада Xbox", "Левый стик уводит персонажа вверх.", "г. Минск, ул. Ленина, 10", "Игровая консоль", RequestStatus.CANCELLED, Priority.LOW, "2500.00", null),
                new RequestSeed("Сборка игрового ПК", "Нужно собрать новый ПК из купленных комплектующих.", "г. Минск, ул. Кирова, 5", "Настольный ПК", RequestStatus.ASSIGNED, Priority.MEDIUM, "6500.00", null),
                new RequestSeed("Нет зарядки у ноутбука", "Разъем питания болтается, заряд идет не всегда.", "г. Минск, ул. Орловская, 41", "Ноутбук", RequestStatus.IN_PROGRESS, Priority.HIGH, "5200.00", null),
                new RequestSeed("После воды не работает экран", "Телефон попал под дождь, появились пятна на дисплее.", "г. Минск, ул. Куйбышева, 91", "Смартфон", RequestStatus.COMPLETED, Priority.URGENT, "3000.00", "3000.00"),
                new RequestSeed("Консоль PlayStation не читает диск", "Привод щелкает и возвращает диск.", "г. Минск, ул. Тимирязева, 72", "Игровая консоль", RequestStatus.NEW, Priority.MEDIUM, "6000.00", null)
        );

        for (int i = 0; i < seeds.size(); i++) {
            RequestSeed seed = seeds.get(i);
            ServiceRequest request = ServiceRequest.builder()
                    .client(clients.get(i % clients.size()))
                    .equipmentType(equipmentTypeByName(equipmentTypes, seed.equipmentTypeName()))
                    .master(masterForStatus(masters, seed.status(), i))
                    .title(seed.title())
                    .description(seed.description())
                    .address(seed.address())
                    .status(seed.status())
                    .priority(seed.priority())
                    .estimatedCost(new BigDecimal(seed.estimatedCost()))
                    .finalCost(seed.finalCost() == null ? null : new BigDecimal(seed.finalCost()))
                    .build();
            serviceRequestRepository.save(request);
        }
        log.info("Service requests seeded.");
    }

    private EquipmentType equipmentTypeByName(List<EquipmentType> equipmentTypes, String name) {
        return equipmentTypes.stream()
                .filter(type -> type.getName().equals(name))
                .findFirst()
                .orElse(equipmentTypes.get(0));
    }

    private Master masterForStatus(List<Master> masters, RequestStatus status, int index) {
        if (masters.isEmpty() || status == RequestStatus.NEW || status == RequestStatus.CANCELLED) {
            return null;
        }
        return masters.get(index % masters.size());
    }

    private void seedNews() {
        createNewsIfMissing("Весенняя акция!",
                "Скидка 20% на замену аккумуляторов смартфонов до конца мая.",
                "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1200&q=80",
                true,
                LocalDateTime.now().plusMonths(1));
        createNewsIfMissing("Мы открылись!",
                "Наш новый филиал по адресу ул. Ленина 10 ждет вас.",
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
                false,
                null);
        createNewsIfMissing("График работы на праздники",
                "1 и 9 мая центр не работает. Остальные дни в обычном режиме.",
                "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80",
                false,
                null);
        createNewsIfMissing("Бесплатная диагностика ноутбуков",
                "До конца месяца проводим первичную диагностику ноутбуков бесплатно при последующем ремонте.",
                LAPTOP_IMAGE,
                true,
                LocalDateTime.now().plusWeeks(3));
        createNewsIfMissing("Новый участок ремонта консолей",
                "Открыли отдельную зону для ремонта PlayStation и Xbox с BGA-станцией и тестовыми стендами.",
                CONSOLE_IMAGE,
                false,
                null);
        createNewsIfMissing("Сервисное обслуживание для офисов",
                "Запускаем регулярное обслуживание принтеров, МФУ и рабочих станций для компаний.",
                PRINTER_IMAGE,
                false,
                null);

        updateExistingNewsImages();
        log.info("News seeded.");
    }

    private void createNewsIfMissing(String title, String content, String imageUrl, boolean isPromotion, LocalDateTime expiresAt) {
        boolean exists = newsRepository.findAll().stream().anyMatch(news -> news.getTitle().equals(title));
        if (exists) {
            return;
        }

        newsRepository.save(News.builder()
                .title(title)
                .content(content)
                .imageUrl(imageUrl)
                .isPromotion(isPromotion)
                .expiresAt(expiresAt)
                .build());
    }

    private void updateExistingNewsImages() {
        newsRepository.findAll().forEach(news -> {
            if (news.getImageUrl() == null || news.getImageUrl().isBlank()) {
                news.setImageUrl(NEWS_IMAGE);
                newsRepository.save(news);
            }
        });
    }

    private record RequestSeed(
            String title,
            String description,
            String address,
            String equipmentTypeName,
            RequestStatus status,
            Priority priority,
            String estimatedCost,
            String finalCost
    ) {
    }
}
