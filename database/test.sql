SELECT athlete_id, gender, disability_type
FROM athletes
WHERE athlete_id IN (1,2,3);
SELECT 
    *
FROM registrations r
WHERE r.registered_sport_id =1;
SELECT
    a.athlete_id,
    a.name_en,
    a.surname_en,
    a.gender
FROM athletes a
WHERE a.disability_type = 'Impaired Muscle Power' AND a.gender= 'F';
SELECT
    r.athlete_id,
    r.registered_sport_id,
    a.name_en,
    a.surname_en,
    a.gender,
    a.disability_type
FROM registrations r
INNER JOIN athletes a ON r.athlete_id = a.athlete_id
WHERE r.registered_sport_id = 1 AND a.disability_type = 'Impaired Muscle Power' AND a.gender = 'F';