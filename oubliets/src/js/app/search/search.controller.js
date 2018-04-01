import {SearchPresenter} from './search.presenter'

export class SearchController{
    constructor(roomService, softwareService, ressourceService, logService){
        this.roomService = roomService
        this.softwareService = softwareService
        this.ressourceService = ressourceService
        this.logService = logService

        this.initialize();
    }

    // Public stuff
    initialize(){
        // Load the display data
        this.ressourceService.list().then((res) => { SearchPresenter.fillResources(res)})
        this.roomService.listAccess().then((res) => { SearchPresenter.fillAccesses(res)})
        this.softwareService.list().then((res) => { SearchPresenter.fillSoftwares(res)})

        // Register the jQuery events
        $('[name="button-search"]').click(this._searchHandler.bind(this))
        $("#clear-search").click(this._clearParamsInput.bind(this))
    }

    fillParamsInput(params){
        $.each(params, (k, val) => {
            if(Array.isArray(val)){
                $.each(val, (k, val) => {
                    $(`[value="${val}"]`).prop("checked", true) 
                })
            }else{
                $(`[name="${k}"]`).val(val)
            }
        })
    }

    // Event handlers
    _searchHandler(event){
        var params = this._getParamsFromInputs()
        var searchResults;
        var logId;

        this.roomService.search(params)
            .then((res) => {
                // TODO: Log search
                $(document).trigger("search:result", [res])
            })
            .catch((e) => console.log(e))
        // this.dispoService.search(params)
        //     .then((rooms) => {
        //         searchResults = rooms;
        //         return this.dispoService.addLog(params)
        //     })
        //     .then((id) => {
        //         logId = id;
        //         return this.dispoService.findLogs()
        //     })
        //     .then((logs) => {
        //         ViewController.fillLogs(logs)
        //         ViewController.renderSearchResults(searchResults, logId);
        //     })
        //     .catch((e) => console.log(e));
    }

    _getParamsFromInputs() {
        var getInputValue = function(name) { return $(`[name="${name}"]`).val() }
        var getInputArray = function(name) {
            let items = []
            $(`#${name} :input:checked`).each(function () {
                items.push(this.value)
            })
            return items
        }
        var inputs = [
            ['room-name', 'string'], ['day-of-week', 'string'],
            ['start-time' , 'string'], ['end-time', 'string'],
            ['room-type', 'string'], ['accesses', 'array'],
            ['resources', 'array'], ['softwares', 'array']
        ]

        var params = {}
        inputs.forEach((input) => {
            var value = (input[1] === 'array') ? getInputArray(input[0]) : getInputValue(input[0])
            if (value) {
                params[input[0]] = value
            }
        });

        return params
    }

    _clearParamsInput(e){
        $(`input[type="text"]`).val("")
        $(`select`).val("")
        $(`input[type="checkbox"]`).prop("checked", false)
        var now = new Date();
        this.fillParamsInput({
            "start-time" : now.getHours(),
            "end-time" : now.getHours() + 1,
            "day-of-week" : now.getDay()
        })
        $("body,html").scrollTop(0);
    }

}