var fs = require('fs');
var _ = require('lodash')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('dispo.db');
var creationScript = fs.readFileSync('dbcreate.sql', 'utf8');

// Create the DB then launch the populate script
db.exec(creationScript, populate);

// Populate the dataset
function populate(err){
    if(err){
        console.log(err);
        return;
    }

    createTimeSlots();
    _.each(ressources, addRessource);
    _.each(rooms, addRoom);
}

// We have 1 timeslot for every day of the week (identified as 0 to 6) from 8h to 24h
function createTimeSlots(){
    for(var i = 0; i <= 6; ++i){
        for (var j = 8; j < 24; ++j){
            db.run(`insert into timeslots (day, startTime, endTime) values (?, ?, ?)`, [i, j, j+1]);
        }
    }
}

// Create a new room
function addRoom(r){
    db.run(`insert into rooms (name, type) values (?, ?)`, [r.name, r.type], () => {
        _.each(r.ressources, (ressource_name) => addRoomResource(r.name, ressource_name));
        _.each(r.timeslots, (ts) => addRoomTimeslot(r.name, ts));
    });
}

// Create a new ressource
function addRessource(r){
    db.run(`insert into ressources (name) values ('${r.name}')`);
}

// Link a room to a ressource
function addRoomResource(room_name, ressource_name){
    db.run(`insert into room_ressource (idRoom, idRessource) 
                values((select idRoom from rooms where name = ?), 
                       (select idRessource from ressources where name = ?))`, 
            [room_name, ressource_name]);
}

// Link a root to a time slot
function addRoomTimeslot(room_name, timeslot){
    var ts = timeslot.split('-');
    db.run(`insert into room_timeslot (idRoom, idTimeslot)
                values ((select idRoom from rooms where name = ?),
                        (select idTimeslot from timeslots where startTime = ? and endTime = ?))`, 
            [room_name, ts[0], ts[1]]);
}

// Mock data
var ressources = [{
    name: 'computer'
},{
    name: 'whiteboard'
}];

var rooms = [{
    name: 'A1234',
    type: 'classroom',
    ressources: ['whiteboard'],
    timeslots: ['8-9', '12-13']
},{
    name: 'A3456',
    type: 'lab',
    ressources: ['computer', 'whiteboard'],
    timeslots: ['11-12', '21-22']
}];

