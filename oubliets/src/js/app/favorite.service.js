export class FavoriteService {
	constructor(sqliteService) {
		this.sqliteService = sqliteService
	}

	add(params){
		var q = `insert into favorites (roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime) values (?, ?, ?, ?, ?)`;
		var p = [params['room-name'], params['room-type'], params['day-of-week'], params['start-time'], params['end-time']];
		return this.sqliteService.run(q, p);
	}
	
	find(){
		return this.sqliteService.run(`select idFavorite, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime from favorites`, [])
	}

	remove(id){
		var q = `delete from favorites where idFavorite = ?`
		var p = [id]
		return this.sqliteService.run(q, p);
	}
}
