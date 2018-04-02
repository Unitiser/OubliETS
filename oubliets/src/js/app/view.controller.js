import {Labels} from "./labels"

export class ViewController {
    constructor() {
        $(document).on('application:show', this.show.bind(this))
        $(".navbar-item a").click(this.handleNavbarClick.bind(this));
    }

    show(event, name){
        this.hideAll();
        $("#" + name).show();
        $(".navbar-item").removeClass("active");
        $(`a[href="#${name}"]`).parent().addClass("active");
        $("body,html").scrollTop(0);
    }

    hideAll(){
        let views = ["search", "history", "results", "favorites"];
        $(views).each((i, v) => { $("#" + v).hide() });
    }

    handleNavbarClick(event){
        event.preventDefault();
        let targetName = event.target.attributes.href.value.replace("#", "");
        $(document).trigger('application:show', [targetName]);
    }
}
