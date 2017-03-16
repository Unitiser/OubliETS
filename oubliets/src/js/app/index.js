import "babel-polyfill"
import {SqliteService} from './sqlite.service'
import {SearchService} from './search.service'

var app = {
	// Application Constructor
	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false)
	},

	// deviceready Event Handler
	//
	// Bind any cordova events here. Common events are:
	// 'pause', 'resume', etc.
	onDeviceReady: function() {
		this.sqliteService = new SqliteService('dispo.db')
		this.searchService = new SearchService(this.sqliteService)

		// Hookup functionalities
		$('[name="button-search"]').click(this.searchHandler.bind(this))
	},

	searchHandler: function(event){
		var getInputValue = function(name) { return $(`[name="${name}"]`).val() }
		var inputs = ['room-name', 'start-time', 'end-time', 'room-type', 'resource']
		var params = {}
		inputs.forEach((name) => {
			var value = getInputValue(name)
			if(value) params[name] = value
		});

		this.searchService.find(params)
	}
};

app.initialize()
