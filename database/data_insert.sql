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
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    national_id VARCHAR(20),
    name_en VARCHAR(100),
    surname_en VARCHAR(100),
    gender CHAR(1),
    religion VARCHAR(50),
    nationality VARCHAR(20),
    blood_type CHAR(3),
    team_name VARCHAR(100),
    -- type_of_disability VARCHAR(100),
    -- disability_characteristics VARCHAR(25),
    is_wheelchair_dependant BOOLEAN,
    weight INT,
    height INT,
    disability_type VARCHAR(2)
);

INSERT INTO athletes
VALUES 
   
    (DEFAULT,'Nap','1','nap@gmail.com','123456789012','NAPHAPACH','PUNBUA','F','BUDDHISM','THAI','O+','THAILAND',TRUE,55,165,'42'),
    (DEFAULT,'Didit','2','didit@gmail.com','234567890123','DIDIT','DIANTORO','M','NONE','INDONESIAN','A+','INDONESIA',FALSE,70,18,'31'),
    (DEFAULT,'Siti','3','siti@gmail.com','345678901234','SITI','NURHALIZA','F','ISLAM','MALAYSIAN','B+','MALAYSIA',FALSE,60,170,'42');
-- Insert Admin
INSERT INTO athletes
VALUES
    (DEFAULT,'Admin','Explosion123%','admin@gmail.com','','ADMIN','USER','M','NONE','THAI','O-','THAILAND',FALSE,0,0,'');
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
    ,(1,3,3,NULL,NULL);
INSERT INTO user_role
VALUES
    (1,'athlete'),
    (2,'athlete'),
    (3,'athlete')
    ,(4,'admin');