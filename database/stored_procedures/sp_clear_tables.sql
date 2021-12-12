CREATE DEFINER=`admin`@`%` PROCEDURE `edukasyon`.`sp_clear_tables`()
BEGIN
SET FOREIGN_KEY_CHECKS = 0; 

	TRUNCATE TABLE edukasyon.grades_raw;
	TRUNCATE TABLE edukasyon.grades; 
	TRUNCATE TABLE edukasyon.student; 

SET FOREIGN_KEY_CHECKS = 1;
END