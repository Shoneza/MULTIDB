import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  boolean,
  timestamp,
  real,
  primaryKey,
  foreignKey,
  decimal,
  uniqueIndex,
  char,
} from "drizzle-orm/pg-core";

export const athletes = pgTable("athletes", {
  athleteId: serial("athlete_id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  nationalId: varchar("national_id", { length: 20 }),
  nameEn: varchar("name_en", { length: 100 }),
  surnameEn: varchar("surname_en", { length: 100 }),
  gender: char("gender", { length: 1 }),
  religion: varchar("religion", { length: 50 }),
  nationality: varchar("nationality", { length: 20 }),
  bloodType: char("blood_type", { length: 3 }),
  teamName: varchar("team_name", { length: 100 }),
  isWheelchairDependant: boolean("is_wheelchair_dependant"),
  weight: integer("weight"),
  height: integer("height"),
  disabilityType: varchar("disability_type", { length: 2 }),
});

export const sports = pgTable("sports", {
  sportId: serial("sport_id").primaryKey(),
  sportName: varchar("sport_name", { length: 100 }).notNull(),
});

export const registrations = pgTable("registrations", {
  registrationId: serial("registration_id").primaryKey(),
  athleteId: integer("athlete_id")
    .notNull()
    .references(() => athletes.athleteId, { onDelete: "cascade" }),
  registeredSportId: integer("registered_sport_id")
    .notNull()
    .references(() => sports.sportId, { onDelete: "cascade" }),
});

export const competitions = pgTable("competitions", {
  competitionId: serial("competition_id").primaryKey(),
  competitionName: varchar("competition_name", { length: 100 }).notNull(),
  sportId: integer("sport_id")
    .notNull()
    .references(() => sports.sportId),
  gender: char("gender", { length: 1 }),
  disabilityType: varchar("disability_type", { length: 50 }),
  dateTime: timestamp("date_time"),
  isFinished: boolean("is_finished").default(false),
});

export const participations = pgTable(
  "participations",
  {
    competitionId: integer("competition_id")
      .notNull()
      .references(() => competitions.competitionId, { onDelete: "cascade" }),
    athleteId: integer("athlete_id")
      .notNull()
      .references(() => athletes.athleteId, { onDelete: "cascade" }),
    attemptNumber: integer("attempt_number").notNull(),
    score: real("score"),
    bestScore: real("best_score"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.competitionId, table.athleteId, table.attemptNumber],
    }),
  })
);

export const medals = pgTable(
  "medals",
  {
    competitionId: integer("competition_id")
      .notNull()
      .references(() => competitions.competitionId, { onDelete: "cascade" }),
    athleteId: integer("athlete_id")
      .notNull()
      .references(() => athletes.athleteId, { onDelete: "cascade" }),
    medalType: varchar("medal_type", { length: 10 }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.competitionId, table.athleteId],
    }),
  })
);

export const usersRole = pgTable(
  "user_role",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => athletes.athleteId, { onDelete: "cascade" }),
    userRole: varchar("user_role", { length: 20 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.userRole],
    }),
  })
);