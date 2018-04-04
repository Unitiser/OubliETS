export class RoomService{
    constructor(){
        this.ACCESS_LIST = '/room/access';
        this.SEARCH = '/room/search';
        this.RESSOURSES_FOR_ROOM = '/room/ressources/:id';
        this.TIMESLOTS_FOR_ROOM = '/room/timeslots/:id';
    }

    listAccess() {
        return $.getJSON(this.ACCESS_LIST);
    }

    search(params) {
        return $.ajax(this.SEARCH, {
            data : JSON.stringify(params),
            contentType : 'application/json',
            type : 'POST'
        });
    }

    findResourcesForRoom(idRoom) {
        return $.getJSON(this.RESSOURSES_FOR_ROOM.replace(':id', idRoom));
    }

    findTimeslotsForRoom(idRoom) {
        return $.getJSON(this.TIMESLOTS_FOR_ROOM.replace(':id', idRoom));
    }
}