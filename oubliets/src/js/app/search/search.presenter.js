import {Labels} from "../labels"

export class SearchPresenter {
    static fillAccesses(accesses) {
        $(accesses).each((i, access) => {
            let a = access.access
            $('#accesses').append(this._createLabelAndCheckbox(a, Labels.accesses[a]))
        })
    }

    static fillResources(resources) {
        $(resources).each((i, resource) => {
            $('#resources').append(this._createLabelAndCheckbox(resource.name, Labels.resources[resource.name]))
        })
    }

    static fillSoftwares(softwares) {
        $(softwares).each((i, software) => {
            $('#softwares').append(this._createLabelAndCheckbox(software.name, software.name))
        })
    }

    static _createLabelAndCheckbox(value, name) {
        var id = name + "_" + value + "_" + Math.random().toString(36).substring(7);

        var span = $('<span></span>')
        span.append('<label for="' + id + '">' + name + '</label>')
        span.append('<input id="' + id + '" type="checkbox" value="' + value + '"/>')
        
        return span
    }
}