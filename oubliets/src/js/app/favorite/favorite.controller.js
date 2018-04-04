import {FavoritePresenter} from './favorite.presenter';

export class FavoriteController{
    constructor(favoriteService) {
        this.favoriteService = favoriteService;
        this.intialize();
    }

    intialize(){
        $(document).on('application:show', (e, name) => {
            if(name === 'favorites') this.showFavoritesHandler();
        });

        $(document).on('favorite:add', this.addFavoriteHandler.bind(this));

        $('#favorites-list').on('click', '.list-item-label, .list-item-load', event => {
            const id = $(event.target).closest('.list-item').attr('data-id');
            this.searchFromFavoriteHandler.call(this, id);
        });

        $('#favorites-list').on('click', '.list-item-remove', event => {
            const id = $(event.target).parent().parent().attr('data-id');
            this.removeFavoriteHandler.call(this, id);
        });

        $('#favorites-list, #favorites-list').on('click', '.list-item-edit', event => {
            const id = $(event.target).parent().parent().attr('data-id');
            this.editHandler.call(this, id);
        });

        $('[name="button-clear-favorites"]').click(this.clearFavoritesHandler.bind(this));
    }

    addFavoriteHandler(event, params){
        this.favoriteService.add(params);
        $(document).trigger('application:show', ['favorites']);
    }

    showFavoritesHandler() {
        FavoritePresenter.fillFavorites(this.favoriteService.list());
    }

    searchFromFavoriteHandler(id){
        let params = this.favoriteService.getAsParams(id);
        $(document).trigger('search:prefillAndSearch', [params]);
    }

    editHandler(id){
        let params = this.favoriteService.getAsParams(id);

        $(document).trigger('search:prefill', [params]);
        $(document).trigger('application:show', ['search']);
    }

    clearFavoritesHandler(){
        this.favoriteService.clear();
        this.showFavoritesHandler();
    }

    removeFavoriteHandler(id){
        this.favoriteService.remove(id);
        this.showFavoritesHandler();
    }
}