DROP TABLE IF EXISTS participations CASCADE;
DROP TABLE IF EXISTS competitions CASCADE;
DROP TABLE IF EXISTS sports CASCADE;
DROP TABLE IF EXISTS athletes CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
CREATE TABLE athletes (
    athlete_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    national_id VARCHAR(20),
    name_en VARCHAR(100) NOT NULL,
    surname_en VARCHAR(100) NOT NULL,
    gender CHAR(1),
    religion VARCHAR(50),
    nationality VARCHAR(20),
    blood_type CHAR(2),
    team_name VARCHAR(100),
    -- type_of_disability VARCHAR(100),
    -- disability_characteristics VARCHAR(25),
    is_wheelchair_dependant BOOLEAN,
    weight INT,
    height INT,
    disability_type VARCHAR(2)
);
CREATE TABLE sports (
    sport_id SERIAL PRIMARY KEY,
    sport_name VARCHAR(100) NOT NULL
);
CREATE TABLE registrations (
    registration_id SERIAL PRIMARY KEY,
    athlete_id INT REFERENCES athletes(athlete_id) ON DELETE CASCADE,
    registered_sport_id INT REFERENCES sports(sport_id) ON DELETE CASCADE
);
CREATE TABLE competitions (
    competition_id SERIAL PRIMARY KEY,
    competition_name VARCHAR(100) NOT NULL,
    sport_id INT REFERENCES sports(sport_id),
    gender CHAR(1),
    disability_type VARCHAR(50),
    date_time TIMESTAMP,
    is_finished BOOLEAN DEFAULT false
);
CREATE TABLE participations (
    competition_id INT NOT NULL REFERENCES competitions(competition_id) ON DELETE CASCADE,
    athlete_id INT REFERENCES athletes(athlete_id) ON DELETE CASCADE,
    attempt_number INT,
    score FLOAT,
    best_score FLOAT,
    medal VARCHAR(10),
    PRIMARY KEY (competition_id, athlete_id,attempt_number)
);