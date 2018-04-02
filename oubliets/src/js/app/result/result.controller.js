import {ResultPresenter} from './result.presenter'

export class ResultController {
    constructor(roomService) {
        this.roomService = roomService; 
        this.initialize()
    }

    initialize() {
        $(document).on('search:result', this.handleSearchResult.bind(this))
        $("#results-list").on("click", ".result-item", event => {
            const id = $(event.target).closest('.result-item').attr("data-id");
            this.showResultItemHandler.call(this, id);
        });

        $('[name="button-favorite"]').click(this.handleAddFavorite.bind(this));
    }

    handleSearchResult(event, results, params) {
        ResultPresenter.renderSearchResults(results, params);
        $(document).trigger('application:show', ['results']);
    }

    showResultItemHandler(id){
        var resultItem = $("#results-list [data-id="+id+"]");

        if (resultItem.attr("data-show") === "false") {
            this.roomService.findResourcesForRoom(id).then((res) => { ResultPresenter.renderRoomResources(resultItem, res)})
            this.roomService.findTimeslotsForRoom(id).then((res) => { ResultPresenter.renderRoomTimeslots(resultItem, res)})
            resultItem.attr("data-show", "true");
        } else {
            ResultPresenter.unrenderRoomResources(resultItem);
            ResultPresenter.unrenderRoomTimeslots(resultItem);
            resultItem.attr("data-show", "false");
        }
    }

    handleAddFavorite(event) {
        console.log("Add favorites")
        let params = JSON.parse($('#results-list').attr('data-params'));
        $(document).trigger('favorite:add', [params]);
    }
}