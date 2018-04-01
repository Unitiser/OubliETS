const Rx = require('rxjs/Rx');
const Observable = Rx.Observable;

module.exports = class RoomService {
    constructor(db) {
        this.db = db;

        this.listAccessStmt = this.db.prepare("select distinct access from rooms");
    }

    listAccess() {
        return Observable.bindNodeCallback(this.listAccessStmt.all.bind(this.listAccessStmt))();
    }
}