CREATE TABLE `grades` (
  `grades_id` bigint NOT NULL AUTO_INCREMENT,
  `student_id` bigint DEFAULT NULL,
  `quarter` bigint DEFAULT NULL,
  `year` bigint DEFAULT NULL,
  `type` varchar(200) NOT NULL,
  `value` decimal(23,2) NOT NULL,
  `timestamp` datetime NOT NULL,
  PRIMARY KEY (`grades_id`),
  KEY `grades_FK` (`student_id`),
  CONSTRAINT `grades_FK` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci