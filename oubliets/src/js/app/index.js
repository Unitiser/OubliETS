import "babel-polyfill"
import {SqliteService} from './sqlite.service'
import {DispoService} from './dispo.service'
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
		this.dispoService = new DispoService(this.sqliteService)

		ViewController.show("search");

 		// Hookup functionalities
		$(".navbar-item a").click((event) => {
			event.preventDefault();
			let targetName = event.target.attributes.href.value.replace("#", "");
			ViewController.show(targetName);
		});

		this.sqliteService.ready().then(() => {
			this.dispoService.findAccesses().then((res) => { ViewController.fillAccesses(res)})
			this.dispoService.findResources().then((res) => { ViewController.fillResources(res)})
			this.dispoService.findFavorites().then((res) => { ViewController.fillFavorites(res)})
		})

		$('[name="button-search"]').click(this.searchHandler.bind(this));
		$('[name="button-favorite"]').click(this.favoriteHandler.bind(this));
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

		this.dispoService.search(params)
			.then((res) => {
				this.dispoService.addLog(params)
					.then((res) => {
						this.dispoService.findLogs().then((res) => { ViewController.fillLogs(res)})
						ViewController.renderSearchResults(res);
					}).catch((err) => {
						console.log(err)
					});
			}).catch((err) => {
				console.log(err)
			});
	},
	
	favoriteHandler: function(event){
		var getInputValue = function(name) { return $(`[name="${name}"]`).val() }
		var inputs = ['room-name', 'room-type', 'day-of-week', 'start-time', 'end-time']
		var params = {}
		inputs.forEach((name) => {
			var value = getInputValue(name)
			if(value) params[name] = value
		});
		this.dispoService.addFavorite(params)
			.then((res) => {
				this.dispoService.findFavorites().then((res) => { ViewController.fillFavorites(res)})
			}).catch((err) => {
				console.log(err)
			});
	},
	
	showResultItemHandler: function(id){
		var resultItem = $("#" + id);

		if (resultItem.attr("data-show") === "false") {
			this.dispoService.findResourcesForRoom(id).then((res) => { ViewController.renderRoomResources(resultItem, res)})
			this.dispoService.findTimeslotsForRoom(id).then((res) => { ViewController.renderRoomTimeslots(resultItem, res)})
			resultItem.attr("data-show", "true");
		} else {
			ViewController.unrenderRoomResources(resultItem);
			ViewController.unrenderRoomTimeslots(resultItem);
			resultItem.attr("data-show", "false");
		}
	},
};

app.initialize()
