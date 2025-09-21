CREATE TABLE IF NOT EXISTS `subscriber_image_usage` (
  `device_id` varchar(255) PRIMARY KEY,
  `daily_count` int DEFAULT 0,
  `last_reset_date` date DEFAULT (CURRENT_DATE),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;