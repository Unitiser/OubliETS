export class RoomService{
    constructor(){
        this.ACCESS_LIST = '/room/access';
        this.SEARCH = '/room/search';
    }

    listAccess() {
        return $.getJSON(this.ACCESS_LIST);
    }

    search(params) {
        return $.ajax(this.SEARCH, {
            data : JSON.stringify(params),
            contentType : 'application/json',
            type : 'POST'
        })
    }
}