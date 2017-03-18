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

export class DispoService {
	constructor(sqliteService) {
		this.sqliteService = sqliteService
	}

	findAccesses() {
		return this.sqliteService.run(`select distinct access from rooms`, [])
	}

	findResources() {
		return this.sqliteService.run(`select * from ressources`, [])
	}

	findResourcesForRoom(idRoom) {
		var query = `select r.idRessource, r.name
			from ressources r, room_ressource rr
			where r.idRessource = rr.idRessource
			and rr.idRoom = ` + idRoom
		return this.sqliteService.run(query, [])
	}

	findTimeslotsForRoom(idRoom) {
		var query = `select t.idTimeslot, t.day, t.startTime, t.endTime
			from timeslots t, room_timeslot rt
			where t.idTimeslot = rt.idTimeslot
			and rt.idRoom = ` + idRoom
		return this.sqliteService.run(query, [])
	}

	search(params) {
		var self = this
		// TODO: This way of building the query is quite horrible ... we should probably find something better.
		var select = `select r.idRoom, r.name, r.type, t.day, t.startTime, t.endTime, group_concat(re.name) as res from rooms as r
			left join room_timeslot as rt on r.idRoom = rt.idRoom
			left join timeslots as t on t.idTimeslot = rt.idTimeslot
			left join room_ressource as rr on rr.idRoom = r.idRoom
			left join ressources as re on rr.idRessource = re.idRessource `
		var having = ` having `
		var havings = []
		var groupBy = ` group by r.name, t.day, t.startTime, t.endTime`
		//$("favorites-list").append(select);
		$.each(params, function(key, values) {
			let clause = self.getParamClause(self.getRealSearchField(key), values)
			if (clause) havings.push(clause)
		});
		var query = select + groupBy + (havings.length ? having + havings.join(' and '): "")

		return this.sqliteService.run(query, [])
	}

	addFavorite(params){
		var q = `insert into favorites (roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime) values (?, ?, ?, ?, ?)`;
		var p = [params['room-name'], params['room-type'], params['day-of-week'], params['start-time'], params['end-time']];
		return this.sqliteService.run(q, p);
	}

	removeFavorite(id){
		return this.sqliteService.run(`delete from favorites where idFavorite = ?`, [id]);
	}

	findFavorites(){
		return this.sqliteService.run(`select idFavorite, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime from favorites`, [])
	}

	findFavorite(id){
		var select = `select idFavorite, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime from favorites where idFavorite = ?`
		return this.sqliteService.run(select, [id])
	}

	clearFavorites(){
		return this.sqliteService.run(`delete from favorites`)
	}

	addLog(params){
		var q = `insert into logs (roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime) values (?, ?, ?, ?, ?)`;
		var p = [params['room-name'], params['room-type'], params['day-of-week'], params['start-time'], params['end-time']];
		return this.sqliteService.run(q, p);
	}

	removeLog(id){
		return this.sqliteService.run(`delete from logs where idLog = ?`, [id]);
	}

	findLog(id){
		var select = `select idLog, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime from logs where idLog = ?`
		return this.sqliteService.run(select, [id])
	}

	findLogs(){
		return this.sqliteService.run(`select idLog, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime from logs`, [])
	}

	clearLogs(){
		return this.sqliteService.run(`delete from logs`)
	}

	getParamClause(fieldInfo, values) {
		var getConditionClause = function(field, operator, value) {
			let val = (operator === "LIKE") ? `"%${value}%"` : `"${value}"`
			return `${field} ${operator} ` + val
		}

		let clause
		if (fieldInfo.type != undefined && fieldInfo.type == 'array') {
			let c = []
			$(values).each((i, val) => {
				c.push(getConditionClause(fieldInfo.field, fieldInfo.operator, val))
			})

			if (c.length !== 0) {
				clause = '(' + c.join(' ' + fieldInfo.arrayOperator + ' ') + ')'
			}

		} else {
			clause = getConditionClause(fieldInfo.field, fieldInfo.operator, values)
		}
		return clause
	}

	getRealSearchField(name){
		let mapping = {
			'accesses': { 'field' : 'r.access', 'operator' : '=', 'type': 'array', 'arrayOperator': 'or'}, // This is a proposition ... we should probably find something better.
			'resources': { 'field' : 'res', 'operator' : 'LIKE', 'type': 'array', 'arrayOperator': 'and'},
			'room-name' : { 'field' : 'r.name', 'operator' : '=' },
			'start-time' : { 'field' : 't.startTime', 'operator' : '<=' },
			'end-time' : { 'field' : 't.endTime', 'operator' : '>=' },
			'room-type' : { 'field' : 'r.type', 'operator' : '=' },
			'day-of-week' : { 'field' : 't.day', 'operator' : '=' },
		}
		return mapping[name]
	}
}
