import {LogPresenter} from './log.presenter'

export class LogController{
    constructor(logService) {
        this.logService = logService;
        this.intialize();
    }

    intialize(){
        $(document).on('application:show', (e, name) => {
            if(name == 'history') this.showLogsHandler();
        })

        $("#logs-list").on("click", ".list-item-label, .list-item-load", event => {
            const id = $(event.target).closest('.list-item').attr("data-id");
            this.searchFromLogHandler.call(this, id);
        });

        $("#logs-list").on("click", ".list-item-remove", event => {
            const id = $(event.target).parent().parent().attr("data-id");
            this.removeLogHandler.call(this, id);
        });

        $("#logs-list, #favorites-list").on("click", ".list-item-edit", event => {
            const id = $(event.target).parent().parent().attr("data-id");
            this.editHandler.call(this, id);
        });

        $('[name="button-clear-logs"]').click(this.clearLogsHandler.bind(this));
    }

    showLogsHandler() {
        LogPresenter.fillLogs(this.logService.list());
    }

    searchFromLogHandler(id){
        let params = this.logService.getAsParams(id);
        $(document).trigger('search:prefillAndSearch', [params]);
    }

    editHandler(id){
        let params = this.logService.getAsParams(id);
        console.log(params);

        $(document).trigger('search:prefill', [params]);
        $(document).trigger('application:show', ["search"]);
    }

    clearLogsHandler(event){
        this.logService.clear();
        this.showLogsHandler();
    }

    removeLogHandler(id){
        this.logService.remove(id);
        this.showLogsHandler();
    }
}