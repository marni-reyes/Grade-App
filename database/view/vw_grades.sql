CREATE OR REPLACE VIEW `edukasyon`.`vw_grades` AS
SELECT
    `T`.`student_name` AS `student_name`,
    `T`.`quarter` AS `quarter`,
    `T`.`year` AS `year`,
    (SUM(`T`.`AVGHomework`) / COUNT(`T`.`AVGHomework`)) AS `AVGHomework`,
    (SUM(`T`.`AVGTest`) / COUNT(`T`.`AVGTest`)) AS `AVGTest`,
    ROUND((((SUM(`T`.`AVGTest`) / COUNT(`T`.`AVGTest`)) * 0.6) + ((SUM(`T`.`AVGHomework`) / COUNT(`T`.`AVGHomework`)) * 0.4)), 1) AS `grade`
FROM
    (
    SELECT
        `S`.`student_name` AS `student_name`,
        `G`.`quarter` AS `quarter`,
        `G`.`year` AS `year`,
        AVG(`G`.`value`) AS `AVGHomework`,
        NULL AS `AVGTest`
    FROM
        (`edukasyon`.`grades` `G`
    JOIN `edukasyon`.`student` `S` ON
        ((`S`.`student_id` = `G`.`student_id`)))
    WHERE
        (`G`.`type` = 'homework')
    GROUP BY
        `S`.`student_name`,
        `G`.`quarter`,
        `G`.`year`
UNION
    SELECT
        `S`.`student_name` AS `student_name`,
        `G`.`quarter` AS `quarter`,
        `G`.`year` AS `year`,
        NULL AS `AVGHomework`,
        AVG(`G`.`value`) AS `AVGTest`
    FROM
        (`edukasyon`.`grades` `G`
    JOIN `edukasyon`.`student` `S` ON
        ((`S`.`student_id` = `G`.`student_id`)))
    WHERE
        (`G`.`type` = 'test')
    GROUP BY
        `S`.`student_name`,
        `G`.`quarter`,
        `G`.`year`) `T`
GROUP BY
    `T`.`student_name`,
    `T`.`quarter`,
    `T`.`year`
UNION
SELECT
    `T`.`student_name` AS `student_name`,
    100 AS `quarter`,
    `T`.`year` AS `year`,
    (SUM(`T`.`AVGHomework`) / COUNT(`T`.`AVGHomework`)) AS `AVGHomework`,
    (SUM(`T`.`AVGTest`) / COUNT(`T`.`AVGTest`)) AS `AVGTest`,
    ROUND((((SUM(`T`.`AVGTest`) / COUNT(`T`.`AVGTest`)) * 0.6) + ((SUM(`T`.`AVGHomework`) / COUNT(`T`.`AVGHomework`)) * 0.4)), 1) AS `grade`
FROM
    (
    SELECT
        `T`.`student_name` AS `student_name`,
        `T`.`quarter` AS `quarter`,
        `T`.`year` AS `year`,
        (SUM(`T`.`AVGHomework`) / COUNT(`T`.`AVGHomework`)) AS `AVGHomework`,
        (SUM(`T`.`AVGTest`) / COUNT(`T`.`AVGTest`)) AS `AVGTest`,
        ROUND((((SUM(`T`.`AVGTest`) / COUNT(`T`.`AVGTest`)) * 0.6) + ((SUM(`T`.`AVGHomework`) / COUNT(`T`.`AVGHomework`)) * 0.4)), 1) AS `grade`
    FROM
        (
        SELECT
            `S`.`student_name` AS `student_name`,
            `G`.`quarter` AS `quarter`,
            `G`.`year` AS `year`,
            AVG(`G`.`value`) AS `AVGHomework`,
            NULL AS `AVGTest`
        FROM
            (`edukasyon`.`grades` `G`
        JOIN `edukasyon`.`student` `S` ON
            ((`S`.`student_id` = `G`.`student_id`)))
        WHERE
            (`G`.`type` = 'homework')
        GROUP BY
            `S`.`student_name`,
            `G`.`quarter`,
            `G`.`year`
    UNION
        SELECT
            `S`.`student_name` AS `student_name`,
            `G`.`quarter` AS `quarter`,
            `G`.`year` AS `year`,
            NULL AS `AVGHomework`,
            AVG(`G`.`value`) AS `AVGTest`
        FROM
            (`edukasyon`.`grades` `G`
        JOIN `edukasyon`.`student` `S` ON
            ((`S`.`student_id` = `G`.`student_id`)))
        WHERE
            (`G`.`type` = 'test')
        GROUP BY
            `S`.`student_name`,
            `G`.`quarter`,
            `G`.`year`) `T`
    GROUP BY
        `T`.`student_name`,
        `T`.`quarter`,
        `T`.`year`) `T`
GROUP BY
    `T`.`student_name`,
    `T`.`year`
ORDER BY
    `year`,
    `quarter`,
    `student_name`