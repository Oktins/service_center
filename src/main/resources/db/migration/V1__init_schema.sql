-- Таблица 1: Пользователи системы
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255),
                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100) NOT NULL,
                       phone VARCHAR(20),
                       role VARCHAR(20) NOT NULL DEFAULT 'CLIENT',
                       oauth_provider VARCHAR(50),
                       oauth_id VARCHAR(255),
                       is_active BOOLEAN NOT NULL DEFAULT true,
                       created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                       updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица 2: Refresh токены для JWT
CREATE TABLE refresh_tokens (
                                id BIGSERIAL PRIMARY KEY,
                                token VARCHAR(512) NOT NULL UNIQUE,
                                user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                expires_at TIMESTAMP NOT NULL,
                                created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица 3: Типы оборудования
CREATE TABLE equipment_types (
                                 id BIGSERIAL PRIMARY KEY,
                                 name VARCHAR(100) NOT NULL UNIQUE,
                                 description TEXT,
                                 created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица 4: Профили мастеров
CREATE TABLE masters (
                         id BIGSERIAL PRIMARY KEY,
                         user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                         specialization VARCHAR(255),
                         experience_years INT DEFAULT 0,
                         rating DECIMAL(3,2) DEFAULT 0.00,
                         is_available BOOLEAN NOT NULL DEFAULT true,
                         created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                         updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица 5: Заявки на ремонт
CREATE TABLE service_requests (
                                  id BIGSERIAL PRIMARY KEY,
                                  client_id BIGINT NOT NULL REFERENCES users(id),
                                  equipment_type_id BIGINT NOT NULL REFERENCES equipment_types(id),
                                  master_id BIGINT REFERENCES masters(id),
                                  title VARCHAR(255) NOT NULL,
                                  description TEXT,
                                  address VARCHAR(500) NOT NULL,
                                  latitude DECIMAL(10,8),
                                  longitude DECIMAL(11,8),
                                  status VARCHAR(30) NOT NULL DEFAULT 'NEW',
                                  priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
                                  estimated_cost DECIMAL(10,2),
                                  final_cost DECIMAL(10,2),
                                  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                                  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица 6: Выезды мастеров
CREATE TABLE dispatches (
                            id BIGSERIAL PRIMARY KEY,
                            service_request_id BIGINT NOT NULL REFERENCES service_requests(id),
                            master_id BIGINT NOT NULL REFERENCES masters(id),
                            scheduled_at TIMESTAMP NOT NULL,
                            started_at TIMESTAMP,
                            completed_at TIMESTAMP,
                            status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
                            notes TEXT,
                            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица 7: Склад запчастей
CREATE TABLE spare_parts (
                             id BIGSERIAL PRIMARY KEY,
                             name VARCHAR(255) NOT NULL,
                             article VARCHAR(100) UNIQUE,
                             description TEXT,
                             quantity INT NOT NULL DEFAULT 0,
                             unit VARCHAR(50) NOT NULL DEFAULT 'шт',
                             price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                             min_quantity INT NOT NULL DEFAULT 5,
                             created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                             updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица 8: Списание запчастей на ремонт
CREATE TABLE spare_parts_usage (
                                   id BIGSERIAL PRIMARY KEY,
                                   service_request_id BIGINT NOT NULL REFERENCES service_requests(id),
                                   spare_part_id BIGINT NOT NULL REFERENCES spare_parts(id),
                                   quantity INT NOT NULL,
                                   price_per_unit DECIMAL(10,2) NOT NULL,
                                   created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица 9: Отзывы клиентов
CREATE TABLE reviews (
                         id BIGSERIAL PRIMARY KEY,
                         service_request_id BIGINT NOT NULL UNIQUE REFERENCES service_requests(id),
                         client_id BIGINT NOT NULL REFERENCES users(id),
                         master_id BIGINT NOT NULL REFERENCES masters(id),
                         rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                         comment TEXT,
                         created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_service_requests_client ON service_requests(client_id);
CREATE INDEX idx_service_requests_master ON service_requests(master_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);
CREATE INDEX idx_dispatches_master ON dispatches(master_id);
CREATE INDEX idx_dispatches_scheduled ON dispatches(scheduled_at);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);