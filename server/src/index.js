const express = require('express')
const app = express()

// Constants
const APP_DIRECTORY = '../oubliets/dist/';

// Init database
const db = require('./db/sqlite.config');
const RoomService = new (require('./db/room.service.js'))(db);
const RessourceService = new (require('./db/ressource.service.js'))(db);
const SoftwareService = new (require('./db/software.service.js'))(db);

// Init static server
app.use("/", express.static(APP_DIRECTORY));

// Init APIs
const SearchAPI = new (require('./api/search.api.js'))(app, db);
const RoomAPI = new (require('./api/room.api.js'))(app, RoomService);
const RessourceAPI = new (require('./api/ressource.api.js'))(app, RessourceService);
const SoftwareAPI = new (require('./api/software.api.js'))(app, SoftwareService);

app.listen(3000, () => console.log('OubliETS listening on port 3000!'))