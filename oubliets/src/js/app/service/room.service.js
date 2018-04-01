export class RoomService{
    constructor(){
        this.ACCESS_LIST = "/room/access";
    }

    listAccess() {
        return $.getJSON(this.ACCESS_LIST);
    }
}