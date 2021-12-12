CREATE TABLE `grades_raw` (
  `grades_raw_id` bigint NOT NULL AUTO_INCREMENT,
  `student_name` varchar(200) DEFAULT NULL,
  `quarter` bigint DEFAULT NULL,
  `year` bigint DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  `value` decimal(23,2) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`grades_raw_id`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci