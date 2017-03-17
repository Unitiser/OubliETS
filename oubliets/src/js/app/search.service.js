// Sample queries

// Select local by ressource

// select r.name, r.type from rooms as r
//  left join room_ressource as rr on rr.idRoom = r.idRoom
//  left join ressources as re on rr.idRessource = re.idRessource
//  where re.name='computer'
//  group by r.idRoom;


// Select room by timeslot

// select r.name, t.startTime, t.endTime from rooms as r
//     left join room_timeslot as rt on r.idRoom = rt.idRoom
//     left join timeslots as t on t.idTimeslot = rt.idTimeslot
//     where t.startTime = 8
//     group by r.idRoom;

export class SearchService {
	constructor(sqliteService) {
		this.sqliteService = sqliteService
	}

	find(params) {
		var self = this
		// TODO: This way of building the query is quite horrible ... we should probably find something better.
		var select = `select r.idRoom, r.name, r.type, t.day, t.startTime, t.endTime from rooms as r
			left join room_timeslot as rt on r.idRoom = rt.idRoom
			left join timeslots as t on t.idTimeslot = rt.idTimeslot
			left join room_ressource as rr on rr.idRoom = r.idRoom
			left join ressources as re on rr.idRessource = re.idRessource `
		var where = `where `
		var wheres = []

		$.each(params, function(key, val) {
			let fieldInfo = self.getRealSearchField(key)
			wheres.push(`${fieldInfo.field} ${fieldInfo.operator} "${val}" `)
			console.log(key, val)
		});
		var query = select + (wheres.length ? where + wheres.join(' and ') : "")
		console.log(query);

		return this.sqliteService.run(query, [])
	}

	getRealSearchField(name){
		let mapping = {
			'room-name' : { 'field' : 'r.name', 'operator' : '=' },
			'start-time' : { 'field' : 't.startTime', 'operator' : '<=' },
			'end-time' : { 'field' : 't.endTime', 'operator' : '>=' },
			'resource' : { 'field' : 'rr.name', 'operator' : '=' },
			'room-type' : { 'field' : 'r.type', 'operator' : '=' },
		}
		return mapping[name]
	}
}
