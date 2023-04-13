CREATE TYPE os_options AS ENUM ('Windows', 'Linux', 'MacOS');

CREATE TABLE developers (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL
);

CREATE TABLE developer_infos(
	id SERIAL PRIMARY KEY,
	"developerSince" DATE NOT NULL,
	"preferredOS" os_options NOT NULL,
	"developerId" INTEGER UNIQUE NOT NULL, 
	FOREIGN KEY ("developerId") REFERENCES developers ON DELETE CASCADE
);

CREATE TABLE projects(
	id SERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
	description TEXT,
	"estimatedTime" VARCHAR(20) NOT NULL,
	repository VARCHAR(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE DEFAULT NULL,
	"developerId" INTEGER,
	FOREIGN KEY ("developerId") REFERENCES developers ON DELETE SET NULL
);

CREATE TABLE technologies(
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(30) NOT NULL
);

CREATE TABLE projects_technologies(
	id SERIAL PRIMARY KEY,
	"addedIn" DATE NOT NULL,
	"technologyId" INTEGER NOT NULL,
	"projectId" INTEGER NOT NULL,
	FOREIGN KEY ("technologyId") REFERENCES technologies ON DELETE CASCADE,
	FOREIGN KEY ("projectId") REFERENCES projects ON DELETE CASCADE
);

INSERT INTO 
	technologies (name)
VALUES
	('JavaScript'),
	('Python'),
	('React'),
	('Express.js'),
	('HTML'),
	('CSS'),
	('Django'),
	('PostgreSQL'),
	('MongoDB')
;