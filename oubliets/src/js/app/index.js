'use strict';
import 'babel-polyfill';

import { ViewController } from './view.controller';
import { RessourceService } from './service/ressource.service';
import { RoomService } from './service/room.service';
import { SoftwareService } from './service/software.service';
import { LogService } from './service/log.service';
import { FavoriteService } from './service/favorite.service';

import { SearchController } from './search/search.controller';
import { ResultController } from './result/result.controller';
import { LogController } from './log/log.controller';
import { FavoriteController } from './favorite/favorite.controller';

let app = {
    // Application Constructor
    initialize: function() {
        this.dispoService = {};
        this.ressourceService = new RessourceService();
        this.roomService = new RoomService();
        this.softwareService = new SoftwareService();
        this.logService = new LogService();
        this.favoriteService = new FavoriteService();
        
        // Init controllers
        new ViewController();
        new SearchController(this.roomService,
                             this.softwareService,
                             this.ressourceService,
                             this.logService);
        new ResultController(this.roomService);
        new LogController(this.logService);
        new FavoriteController(this.favoriteService);

        $(document).trigger('application:show', ['search']);


        if ('serviceWorker' in navigator) {
            console.log("Will the service worker register?");
            navigator.serviceWorker.register('worker.js')
                .then(function(reg){
                    console.log("Yes, it did.");
                }).catch(function(err) {
                    console.log("No it didn't. This happened: ", err)
                });
        }
    }
};

app.initialize();