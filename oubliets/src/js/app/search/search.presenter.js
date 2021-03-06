import {Labels} from '../labels';

export class SearchPresenter {
    static fillAccesses(accesses) {
        $(accesses).each((i, access) => {
            let a = access.access;
            $('#accesses').append(this._createLabelAndCheckbox(a, Labels.accesses[a]));
        });
    }

    static fillResources(resources) {
        $(resources).each((i, resource) => {
            let label = Labels.resources[resource.name];
            let checkbox = this._createLabelAndCheckbox(resource.name, label);
            $('#resources').append(checkbox);
        });
    }

    static fillSoftwares(softwares) {
        $(softwares).each((i, software) => {
            $('#softwares').append(this._createLabelAndCheckbox(software.name, software.name));
        });
    }

    static _createLabelAndCheckbox(value, name) {
        let id = `${name}_${value}_${Math.random().toString(36).substring(7)}`;
        let span = $('<span></span>');
        span.append('<label for="' + id + '">' + name + '</label>');
        span.append('<input id="' + id + '" type="checkbox" value="' + value + '"/>');
        
        return span;
    }
}