CREATE DEFINER=`admin`@`%` PROCEDURE `edukasyon`.`sp_populate_tables`()
BEGIN
INSERT INTO edukasyon.student
(student_name)
SELECT
	student_name
FROM edukasyon.grades_raw
WHERE student_name NOT IN (
	SELECT
		student_name
	FROM edukasyon.student
	GROUP BY student_name 
)
GROUP BY student_name
;

DELETE G
FROM edukasyon.grades G
INNER JOIN (
	SELECT
		student_id 
		,`year`
		,`quarter`
		,`type`
		,MAX(timestamp) AS latestUpdate
	FROM edukasyon.grades_raw GR
	INNER JOIN edukasyon.student S
		ON S.student_name = GR.student_name 
	GROUP BY 
		student_id
		,`year`
		,`quarter`
		,`type`
) AS S1
 	ON S1.student_id = G.student_id
 	AND S1.`year` = G.`year`
 	AND S1.`quarter` = G.`quarter`
 	AND S1.`type` = G.`type`
WHERE S1.latestUpdate > G.timestamp
;

INSERT INTO edukasyon.grades 
(
	student_id 
	,`year`
	,`quarter`
	,`type`
	,value
	,timestamp
)
SELECT
	S.student_id 
	,GR.`year`
	,GR.`quarter`
	,GR.`type`
	,GR.value
	,GR.timestamp
FROM (
	SELECT
		GR1.student_name
		,GR1.`year`
		,GR1.`quarter`
		,GR1.`type`
		,GR1.value
		,GR1.timestamp
		,DENSE_RANK() OVER(PARTITION BY GR1.student_name ,GR1.`year` ,GR1.`quarter` ,GR1.`type` ,GR1.value ORDER BY GR1.timestamp DESC) AS RK
	FROM edukasyon.grades_raw GR1
) GR
INNER JOIN edukasyon.student S
	ON S.student_name = GR.student_name
INNER JOIN (
	SELECT 
		MAX(timestamp) AS lastUpdate
	FROM edukasyon.grades 
) G
 	ON COALESCE(G.lastUpdate,'2001-01-01') < GR.timestamp
WHERE 
	GR.RK = 1
;

SELECT * FROM edukasyon.vw_grades;
END