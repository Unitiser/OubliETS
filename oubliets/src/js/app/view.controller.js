import {Labels} from "./labels"

export class ViewController {

    static show(name){
        this.hideAll();
        $("#" + name).show();
        $(".navbar-item").removeClass("active");
        $(`a[href="#${name}"]`).parent().addClass("active");
        $("body,html").scrollTop(0);

        switch(name){
            case "search":
                var now = new Date();
                $('input[name=start-time]').val(now.getHours())
                $('input[name=end-time]').val(now.getHours() + 1)
			    $('select[name=day-of-week]').val(now.getDay())
            break;
        }
    }

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

	static _createLabelAndCheckbox(value, name) {
		var id = name + "_" + value + "_" + Math.random().toString(36).substring(7);

		var span = $('<span></span>')
		span.append('<label for="' + id + '">' + name + '</label>')
		span.append('<input id="' + id + '" type="checkbox" value="' + value + '"/>')
		
		return span
	}

    static hideAll(){
        let views = ["search", "history", "results", "favorites"];
        $(views).each((i, v) => { $("#" + v).hide() });
    }

    static renderSearchResults(searchResults){
        var display = "";
        $("#results-list").empty();
                
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
	
	static renderFavoriteAddedMessage(){
		$('[name="button-favorite"]').after("<p class='favorite-added-msg'>Cette recherche est maintenant dans vos favoris</p>");
		$(".favorite-added-msg").animate({
			opacity: 0
		}, 2000, function() {
			$(".favorite-added-msg").remove();
		});
	}
	
	static fillFavorites(favorites) {
		$('#favorites-list').find(".favorite-item").remove();
		var display = "";
		$(favorites).each((i, item) => {
            var idFavorite, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime;
            ({idFavorite, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime} = item);
            display += `<div class="favorite-item" data-id="${idFavorite}">`;
			if (roomName !== null || roomType !== null) {
				display += "<p>Local ";
				display += roomName === null ? " " : roomName;
				display += roomType === null ? "" : roomType;
				display += "</p>";
			}
			display += `<p>${Labels.day[timeslotDay]} de ${timeslotStartTime}h00 à ${timeslotEndTime}h00</p>
				<button type="submit" name="button-remove-favorite">Poubelle</button></div>`;
        });
		$('#favorites-list').append(display);
	}
	
	static unrenderFavorites() {
		$('#favorites-list').find(".favorite-item").remove();
	}
	
	static unrenderFavorite(id){
		$('#favorites-list').find("[data-id="+id+"]").remove();
	}
	
	static fillLogs(logs) {
		$('#logs-list').find(".log-item").remove();
		var display = "";
		$(logs).each((i, item) => {
            var idLog, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime;
            ({idLog, roomName, roomType, timeslotDay, timeslotStartTime, timeslotEndTime} = item);
            display += `<div class="log-item" data-id="${idLog}">`;
			if (roomName !== null || roomType !== null) {
				display += "<p>Local ";
				display += roomName === null ? "" : roomName + " ";
				display += roomType === null ? "" : roomType;
				display += "</p>";
			}
			display += `<p>${Labels.day[timeslotDay]} de ${timeslotStartTime}h00 à ${timeslotEndTime}h00</p>
				<button type="submit" name="button-remove-favorite">Poubelle</button></div>`;
        });
		$('#logs-list').append(display);
	}
	
	static unrenderLogs() {
		$('#logs-list').find(".log-item").remove();
	}
	
	static unrenderLog(id){
		$('#logs-list').find("[data-id="+id+"]").remove();
	}
}