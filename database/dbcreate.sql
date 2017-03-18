-- Drop the tables if they already exist
drop table if exists rooms;
drop table if exists ressources;
drop table if exists room_ressource;
drop table if exists timeslots;
drop table if exists room_timeslot;
drop table if exists log;

-- Create the tables
create table rooms (
    idRoom integer PRIMARY KEY, 
    name text NOT NULL, 
    type text NOT NULL
);

create table ressources (
    idRessource integer PRIMARY KEY, 
    name text NOT NULL
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

create table favorites (
    idRoom integer PRIMARY KEY
);

create table log(
    idLog integer not null,
    type char(1) not null,
    searchJson text not null
);


