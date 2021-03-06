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
	_.each(softwares, addSoftware);
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
	db.run(`insert into rooms (name, type, access) values (?, ?, ?)`, [r.name, r.type, r.access], () => {
		_.each(r.ressources, (ressource_name) => addRoomResource(r.name, ressource_name));
		_.each(r.softwares, (software_name) => addRoomSoftware(r.name, software_name));
		_.each(r.timeslots, (ts) => addRoomTimeslot(r.name, ts));
	});
}

// Create a new ressource
function addRessource(r){
	db.run(`insert into ressources (name) values ('${r.name}')`);
}

// Create a new software
function addSoftware(s){
	db.run(`insert into softwares (name) values ('${s.name}')`);
}

// Link a room to a ressource
function addRoomResource(room_name, ressource_name){
	db.run(`insert into room_ressource (idRoom, idRessource)
	values((select idRoom from rooms where name = ?),
	(select idRessource from ressources where name = ?))`,
	[room_name, ressource_name]);
}

// Link a room to a software
function addRoomSoftware(room_name, software_name){
	db.run(`insert into room_software (idRoom, idSoftware)
	values((select idRoom from rooms where name = ?),
	(select idSoftware from softwares where name = ?))`,
	[room_name, software_name]);
}


// Link a room to a time slot
function addRoomTimeslot(room_name, ts){
	// Parse the time slot string using regex
	var [ts, day, start, end ] = new RegExp(/([a-z]{3}) ([\d]{1,2})-([\d]{1,2})/g).exec(ts);

	db.run(`insert into timeslots (day, startTime, endTime) values (?, ?, ?)`, [days[day], start, end],
	(err) => {
		db.run(`insert into room_timeslot (idRoom, idTimeslot)
		values ((select idRoom from rooms where name = ?),
		(select idTimeslot from timeslots where day = ? and startTime = ? and endTime = ?))`,
		[room_name, days[day], start, end])
	}
)
}

// Mock data

// Map for days of the week to ID
// 0. Sunday - Sun.
// 1. Monday - Mon.
// 2. Tuesday - Tue.
// 3. Wednesday - Wed.
// 4. Thursday - Thu.
// 5. Friday - Fri.
// 6. Saturday - Sat.
var days = {
	sun : 0,
	mon : 1,
	tue : 2,
	wed : 3,
	thu : 4,
	fri : 5,
	sat : 6
}


var ressources = [{
	name: 'computer'
},{
	name: 'whiteboard'
},{
	name: 'television'
}];

var softwares = [{
	name: 'Visual Studio 2016'
}, {
	name: 'Unity 6.1'
}, {
	name: 'MatLab'
}, {
	name: '3DS Max'
}];

var rooms = [{
	name: 'A1600',
	type: 'classroom',
	access: 'all',
	ressources: ['whiteboard'],
	softwares: [],
	timeslots: ['sat 8-24', 'sun 8-24', 'fri 10-13']
},{
	name: 'Bibliotheque - salle de groupe',
	type: 'classroom',
	access: 'all',
	ressources: ['whiteboard', 'television'],
	softwares: [],
	timeslots: ['sat 8-19', 'sun 8-19', 'mon 8-22', 'fri 10-13']
},{
	name: 'A1234',
	type: 'classroom',
	access: 'all',
	ressources: ['whiteboard'],
	softwares: [],
	timeslots: ['wed 8-9', 'fri 10-13']
},{
	name: 'E3457',
	type: 'lab',
	access: 'graduates',
	ressources: ['computer', 'whiteboard'],
	softwares: ['Visual Studio 2016'],
	timeslots: ['mon 11-12', 'tue 20-24', 'mon 15-18']
},{
	name: 'A3456',
	type: 'lab',
	access: 'software-it',
	ressources: ['computer', 'whiteboard'],
	softwares: ['Visual Studio 2016', 'Unity 6.1'],
	timeslots: ['mon 11-14', 'tue 20-22', 'mon 15-19']
},{
	name: 'B1234',
	type: 'classroom',
	access: 'software-it',
	ressources: ['whiteboard'],
	softwares: [],
	timeslots: ['thu 11-13', ' fri 12-13']
},{
	name: 'C2234',
	type: 'lab',
	access: 'mecanical',
	ressources: ['computer'],
	softwares: ['MatLab'],
	timeslots: ['sat 8-14']
}];
