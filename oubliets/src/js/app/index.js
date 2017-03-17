import "babel-polyfill"
import {SqliteService} from './sqlite.service'
import {SearchService} from './search.service'
import {ViewController} from './view.controller'


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

		ViewController.show("search");

		// Hookup functionalities
		$(".navbar-item a").click((event) => {
			event.preventDefault();
			let targetName = event.target.attributes.href.value.replace("#", "");
			ViewController.show(targetName);
		});

		$('[name="button-search"]').click(this.searchHandler.bind(this));
	},

	searchHandler: function(event){
		var getInputValue = function(name) { return $(`[name="${name}"]`).val() }
		var inputs = ['room-name', 'day-of-week', 'start-time', 'end-time', 'room-type', 'resource']
		var params = {}
		inputs.forEach((name) => {
			var value = getInputValue(name)
			if(value) params[name] = value
		});

		this.searchService.find(params)
			.then((res) => {
				ViewController.renderSearchResults(res);
				
			}).catch((err) => {
				console.log(err)
			});
	}
};

app.initialize()
