export class LogService{
    constructor(){
        this.logs = JSON.parse(localStorage.getItem('logs'));
        if(!this.logs){
            this.logs = [];
            this.updateLocalStorage();
        }
    }

    add(params) {
        let log = {
            id: this._getRandomNumber(),
            roomName: params['room-name'],
            roomType: params['room-type'],
            timeslotDay: params['day-of-week'],
            timeslotStartTime: params['start-time'],
            timeslotEndTime: params['end-time'],
            accesses: params.accesses,
            resources: params.resources,
            softwares: params.softwares
        };

        this.logs.push(log);
        this.updateLocalStorage();

        return log.id;
    }

    remove(id){
        let index = this.logs.findIndex((log) => log.id === Number(id));
        this.logs.splice(index, 1);
        this.updateLocalStorage();
    }

    get(id){
        return this.logs.find((log) => log.id === Number(id));
    }

    list() {
        return this.logs;
    }

    clear() {
        this.logs = [];
        this.updateLocalStorage();
    }

    updateLocalStorage() {
        localStorage.setItem('logs', JSON.stringify(this.logs));
    }

    getAsParams(id) {
        let item = this.get(id);
        let params = {};

        if (item !== undefined) {
            params['room-name'] = item.roomName;
            params['room-type'] = item.roomType;
            params['day-of-week'] = item.timeslotDay;
            params['start-time'] = item.timeslotStartTime;
            params['end-time'] = item.timeslotEndTime;
            if (item.accesses !== undefined && item.accesses !== '') {
                params.accesses = item.accesses;
            }
            if (item.resources !== undefined && item.resources !== '') {
                params.resources = item.resources;
            }
            if (item.softwares !== undefined && item.softwares !== '') {
                params.softwares = item.softwares;
            }
        }

        return params;
    }

    _getRandomNumber(){
        let array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0];
    }
}