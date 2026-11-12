CREATE TABLE IF NOT EXISTS schedule_lock (
  id TINYINT NOT NULL PRIMARY KEY
) ENGINE=InnoDB;
INSERT IGNORE INTO schedule_lock (id) VALUES (1);

CREATE TABLE IF NOT EXISTS schedule_entries (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  service_slug VARCHAR(64) NOT NULL,
  event_date DATE NOT NULL,
  start_minute SMALLINT UNSIGNED NOT NULL,
  end_minute SMALLINT UNSIGNED NOT NULL,
  state ENUM('reserved', 'blocked') NOT NULL,
  updated_by VARCHAR(254) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX schedule_date_idx (event_date),
  CONSTRAINT chk_schedule_interval CHECK (start_minute < 1440 AND end_minute > start_minute AND end_minute <= start_minute + 1440)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS schedule_migrations (
  name VARCHAR(64) NOT NULL PRIMARY KEY
) ENGINE=InnoDB;

START TRANSACTION;
SELECT id FROM schedule_lock WHERE id = 1 FOR UPDATE;

-- Preserve legacy closed days as service-specific blocks, not reservations.
INSERT INTO schedule_entries (service_slug, event_date, start_minute, end_minute, state, updated_by)
SELECT CASE old.service_slug
  WHEN 'infantil' THEN 'eventos-infantiles'
  WHEN 'casamientos' THEN 'eventos-sociales'
  WHEN 'salon-completo' THEN 'eventos-empresariales'
  ELSE old.service_slug END,
  old.availability_date, 0, 1440, 'blocked', old.updated_by
FROM service_availability old
WHERE old.is_available = 0
AND NOT EXISTS (SELECT 1 FROM schedule_migrations WHERE name = 'legacy-day-blocks')
AND NOT EXISTS (
  SELECT 1 FROM schedule_entries current_entry
  WHERE current_entry.event_date = old.availability_date
    AND current_entry.service_slug = CASE old.service_slug
      WHEN 'infantil' THEN 'eventos-infantiles'
      WHEN 'casamientos' THEN 'eventos-sociales'
      WHEN 'salon-completo' THEN 'eventos-empresariales'
      ELSE old.service_slug END
);
INSERT IGNORE INTO schedule_migrations (name) VALUES ('legacy-day-blocks');
COMMIT;
