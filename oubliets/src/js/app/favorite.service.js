export class FavoriteService {
	constructor(sqliteService) {
		this.sqliteService = sqliteService
	}

	find() {
		return this.sqliteService.run(`select * from favorites`, [])
	}

	remove(id) {
	}
}
