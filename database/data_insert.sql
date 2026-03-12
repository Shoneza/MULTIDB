INSERT INTO sports 
VALUES
    (DEFAULT, 'Javelin Throw'),
    (DEFAULT, 'High Jump'),
    (DEFAULT, 'Long Jump'),
    (DEFAULT, 'Shot Put'),
    (DEFAULT, 'Discus Throw'),
    (DEFAULT, 'Pole Vault'),
    (DEFAULT, 'Triple Jump');
CREATE TABLE athletes (
    athlete_id SERIAL PRIMARY KEY,
    national_id INT,
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
    height INT
);
INSERT INTO athletes
VALUES 
    -- (DEFAULT,'Nap','1','nap@gmail.com','123456789012','NAPHAPACH','PUNBUA','F','BUDDHISM','THAI','O+','THAILAND','PHYSICAL','LOWER LIMB',TRUE,55,165),
    -- (DEFAULT,'Didit','2','didit@gmail.com','234567890123','DIDIT','DIANTORO','M','NONE','INDONESIAN','A+','INDONESIA','PHYSICAL','LOWER LIMB',FALSE,70,180),
    -- (DEFAULT,'Siti','3','siti@gmail.com','345678901234','SITI','NURHALIZA','F','ISLAM','MALAYSIAN','B+','MALAYSIA','VISUAL','TOTAL BLINDNESS',FALSE,60,170);
    (DEFAULT,'Nap','1','nap@gmail.com','123456789012','NAPHAPACH','PUNBUA','F','BUDDHISM','THAI','O+','THAILAND',TRUE,55,165,'42'),
    (DEFAULT,'Didit','2','didit@gmail.com','234567890123','DIDIT','DIANTORO','M','NONE','INDONESIAN','A+','INDONESIA',FALSE,70,18,'31'),
    (DEFAULT,'Siti','3','siti@gmail.com','345678901234','SITI','NURHALIZA','F','ISLAM','MALAYSIAN','B+','MALAYSIA',FALSE,60,170,'42');
INSERT INTO competitions
VALUES
    (DEFAULT,'Javaellin Throw Female Semi-Final',1,'F','42','2026-01-23 09:00:00'), -- Javelin Throw
    (DEFAULT,'High Jump Female Semi-Final',2,'F','42','2026-01-24 14:00:00'), -- High Jump
    (DEFAULT,'Long Jump Female Semi-Final',3,'F','42','2026-01-22 15:00:00'), -- Long Jump
    (DEFAULT,'Shot Put Male Semi-Final',4,'M','31','2026-01-21 14:00:00'); -- Shot Put

INSERT INTO registrations
VALUES
    (DEFAULT,1,1),
    (DEFAULT,1,2),
    (DEFAULT,1,3),
    (DEFAULT,3,1),
    (DEFAULT,3,2),
    (DEFAULT,3,3),
    (DEFAULT,3,4);
CREATE TABLE participations (
    competition_id INT NOT NULL REFERENCES competitions(competition_id) ON DELETE CASCADE,
    athlete_id INT REFERENCES athletes(athlete_id) ON DELETE CASCADE,
    attempt_number INT,
    score FLOAT,
    best_score FLOAT,
    medal VARCHAR(10),
    PRIMARY KEY (competition_id, athlete_id,attempt_number)
);
INSERT INTO participations
VALUES
    (1,1,1,NULL,NULL)
    ,(1,1,2,NULL,NULL)
    ,(1,1,3,NULL,NULL)
    ,(1,3,1,NULL,NULL)
    ,(1,3,2,NULL,NULL)
    ,(1,3,3,NULL,NULL)