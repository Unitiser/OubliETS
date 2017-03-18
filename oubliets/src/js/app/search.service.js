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

	find(params) {
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

		$.each(params, function(key, values) {
			let clause = self.getParamClause(self.getRealSearchField(key), values)
			if (clause) havings.push(clause)
			console.log(key, values)
		});
		var query = select + groupBy + (havings.length ? having + havings.join(' and '): "")
		console.log(query);

		return this.sqliteService.run(query, [])
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
			'resource' : { 'field' : 'rr.name', 'operator' : '=' },
			'room-type' : { 'field' : 'r.type', 'operator' : '=' },
			'day-of-week' : { 'field' : 't.day', 'operator' : '=' },
		}
		return mapping[name]
	}
}
