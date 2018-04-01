import {Labels} from "../labels"

export class ResultPresenter {
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
}