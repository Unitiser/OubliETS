export class RessourceService{
    constructor(){
        this.RESSOURCE_LIST = "/ressources";
    }

    list() {
        return $.getJSON(this.RESSOURCE_LIST);
    }
}