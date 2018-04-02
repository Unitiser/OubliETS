export class FavoriteService{
    constructor(){
        this.favorites = JSON.parse(localStorage.getItem('favorites'));
        if(!this.favorites){
            this.favorites = [];
            this.updateLocalStorage();
        }
    }

    add(params) {
        let fav = {
            id: this._getRandomNumber(),
            roomName: params['room-name'],
            roomType: params['room-type'],
            timeslotDay: params['day-of-week'],
            timeslotStartTime: params['start-time'],
            timeslotEndTime: params['end-time'],
            accesses: params['accesses'],
            resources: params['resources'],
            softwares: params['softwares']
        };

        this.favorites.push(fav);
        this.updateLocalStorage();

        return fav.id;
    }

    remove(id){
        let index = this.favorites.findIndex((fav) => fav.id === Number(id));
        this.favorites.splice(index, 1);
        this.updateLocalStorage();
    }

    get(id){
        return this.favorites.find((fav) => fav.id === Number(id));
    }

    list() {
        return this.favorites;
    }

    clear() {
        this.favorites = [];
        this.updateLocalStorage();
    }

    updateLocalStorage() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    getAsParams(id) {
        let item = this.get(id);
        var params = {};
        if (item !== undefined) {
            params['room-name'] = item.roomName
            params['room-type'] = item.roomType
            params['day-of-week'] = item.timeslotDay
            params['start-time'] = item.timeslotStartTime
            params['end-time'] = item.timeslotEndTime
            if (item.accesses !== undefined && item.accesses !== "") params['accesses'] = item.accesses
            if (item.resources !== undefined && item.resources !== "") params['resources'] = item.resources
            if (item.softwares !== undefined && item.softwares !== "") params['softwares'] = item.softwares
        }

        return params;
    }

    _getRandomNumber(){
        let array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0];
    }
}