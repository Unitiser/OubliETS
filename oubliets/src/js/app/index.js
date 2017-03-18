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
		$("#results-list").on("click", ".result-item", event => {
			const id = $(event.target).closest('.result-item')[0].id;
			const fn = this.showResultItemHandler.bind(this);
			fn(id);
		});
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
	
	showResultItemHandler: function(id){
		var resultItem = $("#" + id);

		if (resultItem.attr("data-show") === "false") {
			this.searchService.findResourcesForRoom(id).then((res) => { ViewController.renderRoomResources(resultItem, res)})
			this.searchService.findTimeslotsForRoom(id).then((res) => { ViewController.renderRoomTimeslots(resultItem, res)})
			resultItem.attr("data-show", "true");
		} else {
			ViewController.unrenderRoomResources(resultItem);
			ViewController.unrenderRoomTimeslots(resultItem);
			resultItem.attr("data-show", "false");
		}
	},
};

app.initialize()
