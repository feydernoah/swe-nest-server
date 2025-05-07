-- Copyright (C) 2022 - present Juergen Zimmermann, Hochschule Karlsruhe
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with this program.  If not, see <https://www.gnu.org/licenses/>.

-- docker compose exec postgres bash
-- psql --dbname=bike --username=bike --file=/scripts/create-table-bike.sql

-- text statt varchar(n):
-- "There is no performance difference among these three types, apart from a few extra CPU cycles
-- to check the length when storing into a length-constrained column"
-- ggf. CHECK(char_length(nachname) <= 255)

-- Indexe mit pgAdmin auflisten: "Query Tool" verwenden mit
--  SELECT   tablename, indexname, indexdef, tablespace
--  FROM     pg_indexes
--  WHERE    schemaname = 'bike'
--  ORDER BY tablename, indexname;

-- https://www.postgresql.org/docs/devel/app-psql.html
-- https://www.postgresql.org/docs/current/ddl-schemas.html
-- https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-CREATE
-- "user-private schema" (Default-Schema: public)

CREATE SCHEMA IF NOT EXISTS AUTHORIZATION bike;

ALTER ROLE bike SET search_path = 'bike';

-- https://www.postgresql.org/docs/current/sql-createtable.html
-- https://www.postgresql.org/docs/current/datatype.html
CREATE TABLE IF NOT EXISTS bike (
    id            integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY USING INDEX TABLESPACE bikespace,
    brand         text NOT NULL,
    type          text NOT NULL,
    frame_size    text NOT NULL,
    price         decimal(8,2) NOT NULL,
    available     boolean NOT NULL DEFAULT TRUE,
    created_at    timestamp NOT NULL DEFAULT NOW(),
    updated_at    timestamp NOT NULL DEFAULT NOW()
) TABLESPACE bikespace;

CREATE TABLE IF NOT EXISTS bike_title (
    id          integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY USING INDEX TABLESPACE bikespace,
    title       text NOT NULL,
    subtitle    text,
    bike_id     integer NOT NULL UNIQUE USING INDEX TABLESPACE bikespace REFERENCES bike
) TABLESPACE bikespace;

CREATE TABLE IF NOT EXISTS bike_image (
    id              integer GENERATED ALWAYS AS IDENTITY(START WITH 1000) PRIMARY KEY USING INDEX TABLESPACE bikespace,
    description     text NOT NULL,
    content_type    text NOT NULL,
    bike_id         integer NOT NULL REFERENCES bike
) TABLESPACE bikespace;
CREATE INDEX IF NOT EXISTS bike_image_bike_id_idx ON bike_image(bike_id) TABLESPACE bikespace;
