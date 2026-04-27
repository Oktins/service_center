CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    parent_id BIGINT REFERENCES categories(id)
);

-- Drop index and old column
DROP INDEX idx_service_catalog_category;
ALTER TABLE service_catalog DROP COLUMN category;

-- Add new column and foreign key
ALTER TABLE service_catalog ADD COLUMN category_id BIGINT;
ALTER TABLE service_catalog ADD CONSTRAINT fk_service_catalog_category FOREIGN KEY (category_id) REFERENCES categories(id);

CREATE INDEX idx_service_catalog_category_id ON service_catalog(category_id);
