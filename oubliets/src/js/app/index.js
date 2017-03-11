/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import "babel-polyfill";
import {SqliteService} from './sqlite.service';
import {SearchService} from './search.service';

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.sqliteService = new SqliteService('dispo.db');
        this.searchService = new SearchService(this.sqliteService);


        // Hookup functionalities
        $('[name="button-search"]').click(this.searchHandler.bind(this));
    },

    searchHandler: function(event){
        var getInputValue = function(name){ return $(`[name="${name}"]`).val(); };
        var inputs = ['room-name', 'start-time', 'end-time', 'room-type', 'resource'];
        var params = {};
        inputs.forEach((name) => {
            var value = getInputValue(name);
            if(value) params[name] = value;
        } );

        this.searchService.find(params);
    }
};

app.initialize();