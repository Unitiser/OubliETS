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
            
            display += `<div id="${idRoom}" class="result-item">
                            <h3>${name} : ${Labels.roomTypeMap[type]}</h3>
                            <p>Disponible de ${startTime}h00 à ${endTime}h00</p>
                        </div>`;
        });

        $("#results-list").append($(display));
        this.show("results");
    }

}