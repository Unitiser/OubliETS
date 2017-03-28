export class SqliteService {
	constructor(dbname) {
		this.dbname = dbname

		// TODO: We should probably find a way to avoid doing this everytime ...
		//       If we store new stuff (favorites and whatnot) they will be erased
		this.resetDatabase(dbname)

		// Open database connection
		this.db = this.openDatabase(dbname)

		window.sqliteservice1 = this
		$(window).bind('beforeunload', () => {
			this.closeDatabase()
		});
	}

	// Open database connection
	openDatabase(dbname) {
		return window.sqlitePlugin.openDatabase({name: dbname, location: 'default'})
	}

	closeDatabase() {
		this.db.close()
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
		var self = this
		window.plugins.sqlDB.copy(dbname, 0, (success) => {
			console.log("Initialised disponibility database.")
			self._ready = true;
		}, (error) => {
			console.log("Database already exist.")
			self._ready = true;
		});
	}

	ready() {
		var self = this
		return new Promise(waitForReady)
		function waitForReady(resolve, error) {
			if (self._ready) {
				return resolve()
			}
			setTimeout(waitForReady.bind(this, resolve, error), 50)
		}
	}

	run(query, args = [], isRows = true) {
		var self = this;
		return new Promise((resolve, error) => {
			self.db.executeSql(query, args,
				(res) =>{ resolve((isRows) ? self.extractQueryResults(res) : res.insertId)}, error)
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
