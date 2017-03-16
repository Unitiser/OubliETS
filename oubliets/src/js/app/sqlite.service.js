export class SqliteService {
	constructor(dbname) {
		this.dbname = dbname

		// TODO: We should probably find a way to avoid doing this everytime ...
		//       If we store new stuff (favorites and whatnot) they will be erased
		this.resetDatabase(dbname)

		// Open database connection
		this.db = this.openDatabase(dbname)
	}

	// Open database connection
	openDatabase(dbname) {
		return window.sqlitePlugin.openDatabase({name: dbname, location: 'default'})
	}

	// Delete old version and create new from preset db file.
	resetDatabase(dbname) {
		// Remove old version of DB
		window.plugins.sqlDB.remove(dbname, 0,
			(success) => console.log('Old database removed'),
			(error) => console.log(error)
		);
		this.initDatabase(dbname);
	}

	// Copy preset db file to default sqlite location
	initDatabase(dbname) {
		// Copy the prefilled db to the default location
		window.plugins.sqlDB.copy(dbname, 0, (success) => {
			console.log("Initialised disponibility database.")
		}, (error) => {
			console.log("Database already exist.")
		});
	}

	run(query, args = []) {
		var self = this;
		return new Promise((resolve, error) => {
			self.db.executeSql(query, args,
				(res) => resolve(self.extractQueryResults(res)), error)
			}
		);
	}

	extractQueryResults(results) {
		var res = [];
		for(var i = 0; i < results.rows.length; ++i) {
			res.push(results.rows.item(i))
		}
		return res;
	}
}
