-- Drop the tables if they already exist
drop table if exists rooms;
drop table if exists softwares;
drop table if exists room_software;
drop table if exists ressources;
drop table if exists room_ressource;
drop table if exists timeslots;
drop table if exists room_timeslot;
drop table if exists favorites;
drop table if exists logs;

-- Create the tables
create table rooms (
    idRoom integer PRIMARY KEY,
    access text NOT NULL,
    name text NOT NULL,
    type text NOT NULL
);

create table ressources (
    idRessource integer PRIMARY KEY,
    name text NOT NULL
);

create table softwares (
    idSoftware integer PRIMARY KEY,
    name text NOT NULL
);

create table room_software (
    idSoftware integer not null,
    idRoom integer not null,
    foreign key (idSoftware) references softwares(idSoftware),
    foreign key (idRoom) references rooms(idRoom),
    primary key (idSoftware, idRoom)
);

create table room_ressource (
    idRessource integer not null,
    idRoom integer not null,
    foreign key (idRessource) references ressources(idRessource),
    foreign key (idRoom) references rooms(idRoom),
    primary key (idRessource, idRoom)
);

create table timeslots (
    idTimeslot integer primary key,
    day integer not null,
    startTime integer not null,
    endTime integer not null,
    UNIQUE (day, startTime, endTime) ON CONFLICT IGNORE
);

create table room_timeslot(
    idTimeslot integer not null,
    idRoom integer not null,
    foreign key (idTimeslot) references timeslots(idTimeslot),
    foreign key (idRoom) references rooms(idRoom),
    primary key (idTimeslot, idRoom)
);

create table logs (
    idLog integer PRIMARY KEY,
    roomName text,
    roomType text,
    timeslotDay integer,
    timeslotStartTime integer,
    timeslotEndTime integer,
    accesses text,
    softwares text,
    resources text,
    isFavorite boolean
);
