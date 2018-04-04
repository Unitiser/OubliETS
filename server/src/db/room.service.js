const Rx = require('rxjs/Rx');
const Observable = Rx.Observable;
const SqlString = require('sqlstring');

module.exports = class RoomService {
    constructor(db) {
        this.db = db;

        this.listAccessStmt = this.db.prepare("select distinct access from rooms");
    }

    listAccess() {
        return Observable.bindNodeCallback(this.listAccessStmt.all.bind(this.listAccessStmt))();
    }

    findResourcesForRoom(idRoom) {
        var query = `select r.idRessource, r.name
            from ressources r, room_ressource rr
            where r.idRessource = rr.idRessource
            and rr.idRoom = ${SqlString.escape(idRoom)}`
        return Observable.bindNodeCallback(this.db.all.bind(this.db))(query);
    }

    findTimeslotsForRoom(idRoom) {
        var query = `select t.idTimeslot, t.day, t.startTime, t.endTime
            from timeslots t, room_timeslot rt
            where t.idTimeslot = rt.idTimeslot
            and rt.idRoom = ${SqlString.escape(idRoom)}`
        return Observable.bindNodeCallback(this.db.all.bind(this.db))(query);
    }

    search(params) {
        // TODO: This way of building the query is quite horrible ... we should probably find something better.
        var select = `select r.idRoom, r.name, r.type, t.day, t.startTime, t.endTime, group_concat(so.name) as sof, group_concat(re.name) as res from rooms as r
            left join room_timeslot as rt on r.idRoom = rt.idRoom
            left join timeslots as t on t.idTimeslot = rt.idTimeslot
            left join room_software as rs on rs.idRoom = r.idRoom
            left join room_ressource as rr on rr.idRoom = r.idRoom
            left join softwares as so on rs.idSoftware = so.idSoftware
            left join ressources as re on rr.idRessource = re.idRessource `;
        var groupBy = ` group by r.name, t.day, t.startTime, t.endTime`;
        var having = ` having `;
        var havings = [];

        for(let key in params) {
            let values = params[key];
            let clause = this.getParamClause(this.getRealSearchField(key), values);
            if (clause) havings.push(clause);
        }

        var query = select + '\n' + groupBy + (havings.length ? '\n' + having + havings.join(' and '): "");

        return Observable.bindNodeCallback(this.db.all.bind(this.db))(query);
    }

    getRealSearchField(name){
        let mapping = {
            'accesses': { 'field' : 'r.access', 'operator' : '=', 'type': 'array', 'arrayOperator': 'or'},
            'resources': { 'field' : 'res', 'operator' : 'LIKE', 'type': 'array', 'arrayOperator': 'and'},
            'softwares': { 'field' : 'sof', 'operator' : 'LIKE', 'type': 'array', 'arrayOperator': 'and'},
            'room-name' : { 'field' : 'r.name', 'operator' : 'LIKE' },
            'start-time' : { 'field' : 't.startTime', 'operator' : '<=' },
            'end-time' : { 'field' : 't.endTime', 'operator' : '>=' },
            'room-type' : { 'field' : 'r.type', 'operator' : '=' },
            'day-of-week' : { 'field' : 't.day', 'operator' : '=' }
        };
        return mapping[name];
    }

    getParamClause(fieldInfo, values) {
        let clause;
        if (fieldInfo.type != undefined && fieldInfo.type == 'array') {
            let c = [];

            for(let val of values) {
                let condition = this.getConditionClause(fieldInfo.field, fieldInfo.operator, val);
                if (condition != null)
                    c.push(condition);
            }

            if (c.length !== 0) {
                clause = '(' + c.join(' ' + fieldInfo.arrayOperator + ' ') + ')';
            }

        } else {
            clause = this.getConditionClause(fieldInfo.field, fieldInfo.operator, values);
        }
        return clause;
    }

    getConditionClause(field, operator, value) {
        if (value == undefined){
            return null
        }

        let val = (operator === "LIKE") ? SqlString.escape(`%${value}%`) : SqlString.escape(value);
        return `${field} ${operator} ` + val;
    }
}