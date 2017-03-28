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

		// App launch data
		this.sqliteService.ready().then(() => {
			this.dispoService.findAccesses().then((res) => { ViewController.fillAccesses(res)})
			this.dispoService.findResources().then((res) => { ViewController.fillResources(res)})
			this.dispoService.findSoftwares().then((res) => { ViewController.fillSoftwares(res)})
			this.dispoService.findFavorites().then((res) => { ViewController.fillFavorites(res)})
			this.dispoService.findLogs().then((res) => { ViewController.fillLogs(res)})
		})

		// Events
		$('[name="button-search"]').click(this.searchHandler.bind(this));
		$('[name="button-favorite"]').click(this.favoriteHandler.bind(this));
		$('[name="button-clear-favorites"]').click(this.clearFavoritesHandler.bind(this));
		$('[name="button-clear-logs"]').click(this.clearLogsHandler.bind(this));
		$("#results-list").on("click", ".result-item", event => {
			const id = $(event.target).closest('.result-item').attr("data-id");
			const fn = this.showResultItemHandler.bind(this);
			fn(id);
		});
		$("#favorites-list").on("click", ".list-item-label", event => {
			const id = $(event.target).closest('.list-item').attr("data-id");
			const fn = this.searchFromFavoriteHandler.bind(this);
			fn(id);
		});
		$("#favorites-list").on("click", ".list-item-remove", event => {
			const id = $(event.target).parent().parent().attr("data-id");
			const fn = this.removeFavoriteHandler.bind(this);
			fn(id);
		});
		$("#logs-list").on("click", ".list-item-label", event => {
			const id = $(event.target).closest('.list-item').attr("data-id");
			const fn = this.searchFromLogHandler.bind(this);
			fn(id);
		});
		$("#logs-list").on("click", ".list-item-remove", event => {
			const id = $(event.target).parent().parent().attr("data-id");
			const fn = this.removeLogHandler.bind(this);
			fn(id);
		});
	},

	_getParamsFromInputs: function() {
		var getInputValue = function(name) { return $(`[name="${name}"]`).val() }
		var getInputArray = function(name) {
			let items = []
			$(`#${name} :input:checked`).each(function () {
				items.push(this.value)
			})
			return items
		}
		var inputs = [
			['room-name', 'string'], ['day-of-week', 'string'],
			['start-time' , 'string'], ['end-time', 'string'],
			['room-type', 'string'], ['accesses', 'array'],
			['resources', 'array'], ['softwares', 'array']
		]

		var params = {}
		inputs.forEach((input) => {
			var value = (input[1] === 'array') ? getInputArray(input[0]) : getInputValue(input[0])
			if (value) {
				params[input[0]] = value
			}
		});

		return params
	},

	searchHandler: function(event){
		var params = this._getParamsFromInputs()
		var searchResults;
		var logId;

		this.dispoService.search(params)
			.then((rooms) => {
				searchResults = rooms;
				return this.dispoService.addLog(params)
			})
			.then((id) => {
				logId = id;
				return this.dispoService.findLogs()
			})
			.then((logs) => {
				ViewController.fillLogs(logs)
				ViewController.renderSearchResults(searchResults, logId);
			})
			.catch((e) => console.log(e));
	},

	favoriteHandler: function(event){
		this.dispoService.addFavorite($("#results-list").attr("data-id"))
			.then((res) => {
				return this.dispoService.findFavorites()
			})
			.then((res) => { 
				ViewController.fillFavorites(res)
				ViewController.renderFavoriteAddedMessage();
			})
			.catch((err) => {
				console.log(err)
			});
	},

	showResultItemHandler: function(id){
		var resultItem = $("#results-list [data-id="+id+"]");

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

	clearFavoritesHandler: function(event){
		this.dispoService.clearFavorites().then((res) => { ViewController.unrenderFavorites()})
	},

	clearLogsHandler: function(event){
		this.dispoService.clearLogs().then((res) => { ViewController.unrenderLogs()})
	},

	removeFavoriteHandler: function(id){
		this.dispoService.removeFavorite(id)
			.then((res) => {
				ViewController.unrenderFavorite(id)
			}).catch((err) => {
				console.log(err)
			});
	},

	removeLogHandler: function(id){
		this.dispoService.removeLog(id)
			.then((res) => {
				ViewController.unrenderLog(id)
			}).catch((err) => {
				console.log(err)
			});
	},

	_getParamsFromSearchItem: function(item) {
		var params = {}

		if (item !== undefined) {
			params['room-name'] = item.roomName
			params['room-type'] = item.roomType
			params['day-of-week'] = item.timeslotDay
			params['start-time'] = item.timeslotStartTime
			params['end-time'] = item.timeslotEndTime
			if (item.accesses !== undefined && item.accesses !== "") params['accesses'] = item.accesses.split(',')
			if (item.resources !== undefined && item.resources !== "") params['resources'] = item.resources.split(',')
			if (item.softwares !== undefined && item.softwares !== "") params['softwares'] = item.softwares.split(',')
		}

		return params

	},

	searchFromFavoriteHandler: function(id) {
		this.dispoService.findFavorites(id)
			.then((favorites) => {
				this.dispoService.search(this._getParamsFromSearchItem(favorites[0]))
					.then((res) => {
						ViewController.renderSearchResults(res, id);
					});
			});
	},

	searchFromLogHandler: function(id){
		this.dispoService.findLog(id)
			.then((logs) => {
				console.log(logs)
				this.dispoService.search(this._getParamsFromSearchItem(logs[0]))
					.then((res) => {
						ViewController.renderSearchResults(res, id);
					});
			});
	},
};

app.initialize()
