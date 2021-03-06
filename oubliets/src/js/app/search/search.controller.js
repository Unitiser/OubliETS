import {SearchPresenter} from './search.presenter';

export class SearchController{
    constructor(roomService, softwareService, ressourceService, logService){
        this.roomService = roomService;
        this.softwareService = softwareService;
        this.ressourceService = ressourceService;
        this.logService = logService;

        this.initialize();
    }

    // Public stuff
    initialize(){
        // Load the display data
        this.ressourceService.list().then((res) => SearchPresenter.fillResources(res));
        this.roomService.listAccess().then((res) => SearchPresenter.fillAccesses(res));
        this.softwareService.list().then((res) => SearchPresenter.fillSoftwares(res));

        // Register the jQuery events
        $('[name="button-search"]').click(this._searchHandler.bind(this));
        $('#clear-search').click(this._clearParamsInput.bind(this));
        
        $(document).on('search:prefillAndSearch', (e, params) => { 
            this.fillParamsInput(params);
            this._searchHandler(e, true);
        });

        $(document).on('search:prefill', (e, params) => {
            this.fillParamsInput(params);
        });
    }

    fillParamsInput(params){
        $.each(params, (k, val) => {
            if(Array.isArray(val)){
                $.each(val, (k, val) => {
                    $(`[value="${val}"]`).prop('checked', true);
                });
            }else{
                $(`[name="${k}"]`).val(val);
            }
        });
    }

    // Event handlers
    _searchHandler(event, skipLog){
        var params = this._getParamsFromInputs();

        this.roomService.search(params)
            .then((res) => {
                if(!skipLog) {
                    this.logService.add(params);
                }
                $(document).trigger('search:result', [res, params]);
            })
            .catch((e) => console.log(e));
    }

    _getParamsFromInputs() {
        let getInputValue = function(name) { return $(`[name="${name}"]`).val(); };
        let getInputArray = function(name) {
            let items = [];
            $(`#${name} :input:checked`).each(function () {
                items.push(this.value);
            });
            return items;
        };
        let inputs = [
            ['room-name', 'string'], ['day-of-week', 'string'],
            ['start-time' , 'string'], ['end-time', 'string'],
            ['room-type', 'string'], ['accesses', 'array'],
            ['resources', 'array'], ['softwares', 'array']
        ];

        let params = {};
        inputs.forEach((input) => {
            let value = (input[1] === 'array') ? getInputArray(input[0]) : getInputValue(input[0]);
            if (value) {
                params[input[0]] = value;
            }
        });

        return params;
    }

    _clearParamsInput(){
        $(`input[type="text"]`).val('');
        $(`select`).val('');
        $(`input[type="checkbox"]`).prop('checked', false);
        let now = new Date();
        this.fillParamsInput({
            'start-time' : now.getHours(),
            'end-time' : now.getHours() + 1,
            'day-of-week' : now.getDay()
        });
        $('body,html').scrollTop(0);
    }

}