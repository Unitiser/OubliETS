import {Labels} from '../labels';

export class LogPresenter{

    static fillLogs(logs) {
        $('#logs-list').find('.list-item').remove();
        let display = '';
        let fn = this.renderLogEntry;
        
        $(logs).each((i, item) => {
            display += fn(item);
        });

        $('#logs-list').append(display);
    }

    static renderLogEntry(item){
        let id, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime;
        ({id, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime} = item);
        let locals = '',
            time = '';

        if (roomName || roomType) {
            locals = `<p>
                        Local ${!roomName ? '' : roomName + ' '}${!roomType ? '' : roomType}
                     </p>`;
        }

        if (timeslotStartTime && timeslotEndTime){
            time = `de ${timeslotStartTime}h00 à ${timeslotEndTime}h00`;
        }else if(timeslotStartTime){
            time = `à partir de ${timeslotStartTime}h00`;
        }else if(timeslotEndTime){
            time = `avant ${timeslotEndTime}h00`;
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
        </div>`;
    }
}