import {Labels} from "../labels"

export class FavoritePresenter{

    static fillFavorites(favorites) {
        $('#favorites-list').find(".list-item").remove();
        var display = "";
        var fn = this.renderFavoriteEntry
        
        $(favorites).each((i, item) => {
            display += fn(item)
        });

        $('#favorites-list').append(display);
    }

    static renderFavoriteEntry(item){
        var id, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime;
        ({id, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime} = item);
        var locals = '',
            time = ''

        if (roomName || roomType) {
            locals = `<p>
                        Local ${!roomName ? "" : roomName + " "}${!roomType ? "" : roomType}
                     </p>`
        }

        if (timeslotStartTime && timeslotEndTime){
            time = `de ${timeslotStartTime}h00 à ${timeslotEndTime}h00`
        }else if(timeslotStartTime){
            time = `à partir de ${timeslotStartTime}h00`
        }else if(timeslotEndTime){
            time = `avant ${timeslotEndTime}h00`
        }

        return `<div class="list-item" data-id="${id}">
            <div class="list-item-action">
                <span class="list-item-load fa fa-external-link"></span>
                <span class="list-item-edit fa fa-pencil"></span>
                <span class="list-item-remove fa fa-trash"></span>
            </div>
            <div class="list-item-label">
                ${locals}
                <p>${Labels.day[timeslotDay]} ${time}</p>
            </div>
        </div>`
    }
}