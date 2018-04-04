const Rx = require('rxjs/Rx');
const Observable = Rx.Observable;

module.exports = class SoftwareService {
    constructor(db) {
        this.db = db;

        this.listStmt = this.db.prepare('select * from softwares');
    }

    list() {
        return Observable.bindNodeCallback(this.listStmt.all.bind(this.listStmt))();
    }
};