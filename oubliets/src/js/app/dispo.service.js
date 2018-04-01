export class DispoService {
	constructor(sqliteService) {
		this.sqliteService = sqliteService
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
}
