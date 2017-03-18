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

		this.sqliteService.ready().then(() => {
			this.searchService.findAccesses().then((res) => { ViewController.fillAccesses(res)})
			this.searchService.findResources().then((res) => { ViewController.fillResources(res)})
			this.searchService.findRoom(0).then((res) => { ViewController.renderResultItem(res)})
		})

		$('[name="button-search"]').click(this.searchHandler.bind(this));
		$("#results-list").on("click", ".result-item", this.showResultItemHandler.bind(this));
	},
	
	searchHandler: function(event){
		var getInputValue = function(name) { return $(`[name="${name}"]`).val() }
		var getInputArray = function(name) {
			let items = []
			$(`#${name} :input:checked`).each(function () {
				items.push(this.value)
			})
			return items
		}
		var inputs = ['room-name', 'day-of-week', 'start-time', 'end-time', 'room-type', 'resource']
		var params = {}
		inputs.forEach((name) => {
			var value = getInputValue(name)
			if(value) params[name] = value
		});

		var inputsArray = ['accesses', 'resources'] // We could merge with inputs.forEach function someday
		inputsArray.forEach((name) => {
			var values = getInputArray(name)
			if(values) params[name] = values
		})

		this.searchService.find(params)
			.then((res) => {
				ViewController.renderSearchResults(res);
			}).catch((err) => {
				console.log(err)
			});
	},
	
	showResultItemHandler: function(event){
		$("#results-list").append("id" + event);
		$("#results-list").append("id" + event.target.id);
		$("#results-list").append("id" + $(this).attr("id"));
		//this.searchService.findRoom(0).then((res) => { ViewController.renderResultItem(res)})
	},
};

app.initialize()
