import {Labels} from "./labels"

export class ViewController {

    constructor() {
        $(document).on('application:show', this.show.bind(this))
        $(".navbar-item a").click(this.handleNavbarClick.bind(this));
    }

    /*
     *          NAVIGATION
     */

    show(event, name){
        this.hideAll();
        $("#" + name).show();
        $(".navbar-item").removeClass("active");
        $(`a[href="#${name}"]`).parent().addClass("active");
        $("body,html").scrollTop(0);
    }

    hideAll(){
        let views = ["search", "history", "results", "favorites"];
        $(views).each((i, v) => { $("#" + v).hide() });
    }

    handleNavbarClick(event){
        event.preventDefault();
        let targetName = event.target.attributes.href.value.replace("#", "");
        $(document).trigger('application:show', [targetName]);
    }
	
    /*
     *          LOG / FAVORITES VIEW
     */

	static renderFavoriteAddedMessage(){
		$('[name="button-favorite"]').after("<p class='favorite-added-msg'>Cette recherche est maintenant dans vos favoris</p>");
		$(".favorite-added-msg").animate({
			opacity: 0
		}, 2000, function() {
			$(".favorite-added-msg").remove();
		});
	}
	
	static fillFavorites(favorites) {
		$('#favorites-list').find(".list-item").remove();
		var display = "";
        var fn = this.renderLogEntry

        $(favorites).each((i, item) => {
            display += fn(item)
        });
		$('#favorites-list').append(display);
	}

	static fillLogs(logs) {
		$('#logs-list').find(".list-item").remove();
		var display = "";
        var fn = this.renderLogEntry
		
        $(logs).each((i, item) => {
            display += fn(item)
        });

		$('#logs-list').append(display);
	}

    static renderLogEntry(item){
        var idLog, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime;
        ({idLog, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime} = item);
        var locals = '',
            time = ''

        if (roomName !== null || roomType !== null) {
            locals = `<p>
                        Local ${roomName === null ? "" : roomName + " "}${roomType === null ? "" : roomType}
                     </p>`
        }

        if (timeslotStartTime && timeslotEndTime){
            time = `de ${timeslotStartTime}h00 à ${timeslotEndTime}h00`
        }else if(timeslotStartTime){
            time = `à partir de ${timeslotStartTime}h00`
        }else if(timeslotEndTime){
            time = `avant ${timeslotEndTime}h00`
        }

        return `<div class="list-item" data-id="${idLog}">
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

    static unrenderFavorites() {
        $('#favorites-list').find(".favorite-item").remove();
    }

    static unrenderFavorite(id){
        $('#favorites-list').find("[data-id="+id+"]").remove();
    }
}
