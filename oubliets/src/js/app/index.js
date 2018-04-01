import "babel-polyfill"
import {SqliteService} from './sqlite.service'
import {DispoService} from './dispo.service'
import {ViewController} from './view.controller'
import {RessourceService} from './service/ressource.service'
import {RoomService} from './service/room.service'
import {SoftwareService} from './service/software.service'

import { SearchController } from './search/search.controller'

var app = {
	// Application Constructor
	initialize: function() {
		// this.sqliteService = new SqliteService('dispo.db')
		// this.dispoService = new DispoService(this.sqliteService)
		this.dispoService = {}
		this.ressourceService = new RessourceService();
		this.roomService = new RoomService();
		this.softwareService = new SoftwareService();

		ViewController.show("search")

 		// Hookup functionalities
		$(".navbar-item a").click((event) => {
			event.preventDefault();
			let targetName = event.target.attributes.href.value.replace("#", "");
			ViewController.show(targetName);
		});

		// App launch data

		// this.dispoService.findFavorites().then((res) => { ViewController.fillFavorites(res)})
		// this.dispoService.findLogs().then((res) => { 
		// 	if(res.length){
		// 		this._fillParamsInput(this._getParamsFromSearchItem(res[0]))
		// 	}else{
		// 		this._clearParamsInput()
		// 	}
		// 	ViewController.fillLogs(res)
		// })
		
		// Init controllers
		let searchCtrl = new SearchController(this.roomService,
											  this.softwareService,
											  this.ressourceService,
											  undefined);

		// Events
		
		// Favorite stuff
		$('[name="button-favorite"]').click(this.favoriteHandler.bind(this));
		$('[name="button-clear-favorites"]').click(this.clearFavoritesHandler.bind(this));
		$('[name="button-clear-logs"]').click(this.clearLogsHandler.bind(this));
		$("#results-list").on("click", ".result-item", event => {
			const id = $(event.target).closest('.result-item').attr("data-id");
			this.showResultItemHandler.call(this, id);
		});
		$("#favorites-list").on("click", ".list-item-label, .list-item-load", event => {
			const id = $(event.target).closest('.list-item').attr("data-id");
			this.searchFromFavoriteHandler.call(this, id);
		});
		$("#favorites-list").on("click", ".list-item-remove", event => {
			const id = $(event.target).parent().parent().attr("data-id");
			this.removeFavoriteHandler.call(this, id);
		});

		// Log stuff
		$("#logs-list").on("click", ".list-item-label, .list-item-load", event => {
			const id = $(event.target).closest('.list-item').attr("data-id");
			this.searchFromLogHandler.call(this, id);
		});
		$("#logs-list").on("click", ".list-item-remove", event => {
			const id = $(event.target).parent().parent().attr("data-id");
			this.removeLogHandler.call(this, id);
		});
		$("#logs-list, #favorites-list").on("click", ".list-item-edit", event => {
			const id = $(event.target).parent().parent().attr("data-id");
			this.editHandler.call(this, id);
		});
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
				this.dispoService.search(this._getParamsFromSearchItem(logs[0]))
					.then((res) => {
						ViewController.renderSearchResults(res, id);
					});
			});
	},

	editHandler : function(id){
		this.dispoService.findLog(id)
			.then((res) => {
				this._fillParamsInput(res[0])
				ViewController.show("search")
			})
	}
};

app.initialize();