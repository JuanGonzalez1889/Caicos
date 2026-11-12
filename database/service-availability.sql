CREATE TABLE IF NOT EXISTS service_availability (
  service_slug VARCHAR(64) NOT NULL,
  availability_date DATE NOT NULL,
  is_available TINYINT(1) NOT NULL,
  updated_by VARCHAR(254) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (service_slug, availability_date),
  CONSTRAINT chk_service_availability_boolean CHECK (is_available IN (0, 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
