export class SoftwareService{
    constructor(){
        this.SOFTWARE_LIST = "/softwares";
    }

    list() {
        return $.getJSON(this.SOFTWARE_LIST);
    }
}