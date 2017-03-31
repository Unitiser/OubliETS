import {Labels} from "./labels"

export class ViewController {
    /*
     *          NAVIGATION
     */

    static show(name){
        this.hideAll();
        $("#" + name).show();
        $(".navbar-item").removeClass("active");
        $(`a[href="#${name}"]`).parent().addClass("active");
        $("body,html").scrollTop(0);
    }

    static hideAll(){
        let views = ["search", "history", "results", "favorites"];
        $(views).each((i, v) => { $("#" + v).hide() });
    }

    /*
     *          SEARCH VIEW
     */
	static fillAccesses(accesses) {
		$(accesses).each((i, access) => {
			let a = access.access
			$('#accesses').append(ViewController._createLabelAndCheckbox(a, Labels.accesses[a]))
		})
	}

	static fillResources(resources) {
		$(resources).each((i, resource) => {
			$('#resources').append(ViewController._createLabelAndCheckbox(resource.name, Labels.resources[resource.name]))
		})
	}

	static fillSoftwares(softwares) {
		$(softwares).each((i, software) => {
			$('#softwares').append(ViewController._createLabelAndCheckbox(software.name, software.name))
		})
	}

	static _createLabelAndCheckbox(value, name) {
		var id = name + "_" + value + "_" + Math.random().toString(36).substring(7);

		var span = $('<span></span>')
		span.append('<label for="' + id + '">' + name + '</label>')
		span.append('<input id="' + id + '" type="checkbox" value="' + value + '"/>')
		
		return span
	}

    /*
     *          SEARCH RESULTS VIEW
     */

    static renderSearchResults(searchResults, idLog){
        var display = "";
        $("#results-list").empty();
        $("#results-list").attr("data-id", idLog)

        if(!searchResults.length) display = `<p>${Labels.noResults}</p>`;

        $(searchResults).each((i, item) => {
            var idRoom, type, name, startTime, endTime;
            ({idRoom, type, name, startTime, endTime} = item); // L33t destructuring assignment, a new ES6 kewl feature

            display += `<div class="result-item" data-show="false" data-id="${idRoom}">
                            <h3>${name} : ${Labels.roomTypeMap[type]}</h3>
                            <p>Disponible de ${startTime}h00 à ${endTime}h00</p>
                        </div>`;
        });

        $("#results-list").append($(display));
        this.show("results");
    }

	static renderRoomResources(resultItem, res){
		if ($(res).length > 0){
			var display = `<br/><p>Ressource(s) :</p>`;
			$(res).each((i, item) => {
				var idRessource, name;
				({idRessource, name} = item);
				display += `<p>${name}</p>`;
			});
			resultItem.append(`<span class="roomResources">` + display + `</span>`);
		}
	}

	static unrenderRoomResources(resultItem){
		resultItem.find(".roomResources").remove();
	}

	static renderRoomTimeslots(resultItem, res){
		if ($(res).length > 0){
			var display = `<br/><p>Disponibilité(s) :</p>`;
			$(res).each((i, item) => {
				var idTimeslot, day, startTime, endTime;
				({idTimeslot, day, startTime, endTime} = item);
				display += `<p>${Labels.day[day]} de ${startTime}h00 à ${endTime}h00</p>`;
			});
			resultItem.append(`<span class="roomTimeslots">` + display + `</span>`);
		}
	}

	static unrenderRoomTimeslots(resultItem){
		resultItem.find(".roomTimeslots").remove();
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

	static unrenderLogs() {
		$('#logs-list').find(".log-item").remove();
	}

	static unrenderLog(id){
		$('#logs-list').find("[data-id="+id+"]").remove();
	}

    static unrenderFavorites() {
        $('#favorites-list').find(".favorite-item").remove();
    }

    static unrenderFavorite(id){
        $('#favorites-list').find("[data-id="+id+"]").remove();
    }
}
