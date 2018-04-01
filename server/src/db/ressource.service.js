const Rx = require('rxjs/Rx');
const Observable = Rx.Observable;

module.exports = class RessourceService {
    constructor(db) {
        this.db = db;

        this.listStmt = this.db.prepare("select * from ressources");
    }

    list() {
        return Observable.bindNodeCallback(this.listStmt.all.bind(this.listStmt))();
    }
}