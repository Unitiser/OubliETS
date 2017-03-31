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

	findSoftwares() {
		return this.sqliteService.run(`select * from softwares`, [])
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
		var select = `select r.idRoom, r.name, r.type, t.day, t.startTime, t.endTime, group_concat(so.name) as sof, group_concat(re.name) as res from rooms as r
			left join room_timeslot as rt on r.idRoom = rt.idRoom
			left join timeslots as t on t.idTimeslot = rt.idTimeslot
			left join room_software as rs on rs.idRoom = r.idRoom
			left join room_ressource as rr on rr.idRoom = r.idRoom
			left join softwares as so on rs.idSoftware = so.idSoftware
			left join ressources as re on rr.idRessource = re.idRessource `
		var groupBy = ` group by r.name, t.day, t.startTime, t.endTime`
		var having = ` having `
		var havings = []

		$.each(params, function(key, values) {
			let clause = self.getParamClause(self.getRealSearchField(key), values)
			if (clause) havings.push(clause)
		});
		var query = select + '\n' + groupBy + (havings.length ? '\n' + having + havings.join(' and '): "")

		return this.sqliteService.run(query, [])
	}

	addLog(params) {
		var q = `insert into logs (
			roomName, roomType,
			timeslotDay, timeslotStartTime, timeslotEndTime,
			accesses, resources, softwares, isFavorite) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
		var p = [params['room-name'], params['room-type'],
		 	params['day-of-week'], params['start-time'], params['end-time'],
			params['accesses'], params['resources'], params['softwares'].join(','), 0];
		return this.sqliteService.run(q, p, false);
	}

	addFavorite(id) {
		return this.sqliteService.run(`update logs set isFavorite=1 where idLog = ?`, [id]);
	}

	removeFavorite(id){
		return this.sqliteService.run(`update logs set isFavorite=0 where idLog = ?`, [id]);
	}

	findFavorites(){
		return this.sqliteService.run(`select * from logs where isFavorite=1 order by idLog desc`, [])
	}

	clearFavorites(){
		return this.sqliteService.run(`update logs set isFavorite=0`)
	}

	removeLog(id){
		return this.sqliteService.run(`delete from logs where idLog = ?`, [id]);
	}

	findLog(id){
		var select = `select * from logs where idLog = ?`
		return this.sqliteService.run(select, [id])
	}

	findLogs(){
		return this.sqliteService.run(`select * from logs order by idLog desc`, [])
	}

	clearLogs(){
		return this.sqliteService.run(`delete from logs where isFavorite=0`)
	}

	getParamClause(fieldInfo, values) {
		var getConditionClause = function(field, operator, value) {
			if (value == undefined)
				return null

			let val = (operator === "LIKE") ? `"%${value}%"` : `"${value}"`
			return `${field} ${operator} ` + val
		}

		let clause
		if (fieldInfo.type != undefined && fieldInfo.type == 'array') {
			let c = []
			$(values).each((i, val) => {
				let condition = getConditionClause(fieldInfo.field, fieldInfo.operator, val)
				if (condition != null)
					c.push(condition)
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
			'accesses': { 'field' : 'r.access', 'operator' : '=', 'type': 'array', 'arrayOperator': 'or'},
			'resources': { 'field' : 'res', 'operator' : 'LIKE', 'type': 'array', 'arrayOperator': 'and'},
			'softwares': { 'field' : 'sof', 'operator' : 'LIKE', 'type': 'array', 'arrayOperator': 'and'},
			'room-name' : { 'field' : 'r.name', 'operator' : 'LIKE' },
			'start-time' : { 'field' : 't.startTime', 'operator' : '<=' },
			'end-time' : { 'field' : 't.endTime', 'operator' : '>=' },
			'room-type' : { 'field' : 'r.type', 'operator' : '=' },
			'day-of-week' : { 'field' : 't.day', 'operator' : '=' },
		}
		return mapping[name]
	}
}
