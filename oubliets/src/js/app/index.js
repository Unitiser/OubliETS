import "babel-polyfill"

import { ViewController } from './view.controller'
import { RessourceService } from './service/ressource.service'
import { RoomService } from './service/room.service'
import { SoftwareService } from './service/software.service'
import { LogService } from './service/log.service'
import { FavoriteService } from './service/favorite.service'

import { SearchController } from './search/search.controller'
import { ResultController } from './result/result.controller'
import { LogController } from './log/log.controller'
import { FavoriteController } from './favorite/favorite.controller'

var app = {
	// Application Constructor
	initialize: function() {
		this.dispoService = {}
		this.ressourceService = new RessourceService();
		this.roomService = new RoomService();
		this.softwareService = new SoftwareService();
		this.logService = new LogService();
		this.favoriteService = new FavoriteService();
		
		// Init controllers
		let viewCtrl = new ViewController();
		let searchCtrl = new SearchController(this.roomService,
											  this.softwareService,
											  this.ressourceService,
											  this.logService);
		let resultCtrl = new ResultController(this.roomService);
		let logCtrl = new LogController(this.logService);
		let favoriteCtrl = new FavoriteController(this.favoriteService);

		$(document).trigger('application:show', ['search']);
	}
};

app.initialize();