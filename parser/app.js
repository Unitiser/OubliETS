var fs = require('fs');
var PDFParser = require('pdf2json');

var pdfParser = new PDFParser();

let HOUR_REGEX =/^([0-9]{2})[-:]([0-9]{2}) - ([0-9]{2})[-:]([0-9]{2})$/;
let LOCAL_REGEX = /^[ABE]-[0-9]{4}$/;
let CLASS_REGEX = /^[A-Z]{3}[0-9]{3}$/;

var DATA = {};

var pdfs = fs.readdirSync('./pdfs/');
parseNext();

function parseNext() {
    if(pdfs.length == 0) {
        printData();
    }
    else {
        var pdf = pdfs.pop();
        //pdf = "Horaires_Gen_E17.pdf";
        console.log('Parsing', pdf);
        pdfParser.loadPDF('./pdfs/' + pdf);
        setTimeout( () => { parseNext(); }, 1000);
    }
}

pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));

pdfParser.on('pdfParser_dataReady', pdfData => {
    parsePdfData(pdfData);
});

function printData() {
    /*for(var local in DATA) {
        var schedule = DATA[local];
        for(var day in schedule) {
            console.log(local, day, "=>", schedule[day]);
        }
    }*/
    console.log(JSON.stringify(DATA));
}

function parsePdfData(pdfData) {

    let forClass = '';
    let forDay = '';
    let forPeriod = '';
    let forType = '';
    let forLocals = [];

    for(let page of pdfData.formImage.Pages) {
    //let page = pdfData.formImage.Pages[1]; {
        for(let textObj of page.Texts)
        {
            let isClass = false, isDay = false, isHour = false, isActivity = false, isLocal = false;
            let text = decodeURI(textObj.R[0].T).replace(/%3A/g, '-').replace(/%2C/g, ',').trim();

            isClass = CLASS_REGEX.test(text);
            if(!isClass) {
                isHour = HOUR_REGEX.test(text);
                if(!isHour) {
                    isType = text == 'C' || text == 'TP' || text == 'Labo';
                    if(!isType) {
                        isDay = ['Lun','Mar','Mer','Jeu','Ven'].indexOf(text) >= 0;
                        if(!isDay) {
                            isLocal = LOCAL_REGEX.test(text);
                        }
                    }
                }
            }

            let suffix = '[UNSUPPORTED]';

            if(isClass) {
                suffix = '[CLASS]';
                forClass = text;
                forDay = '';
                forPeriod = '';
                forLocal = '';
                forType = '';
            }
            if(isDay) {
                suffix = '[DAY]';
                forDay = text;
            }
            if(isHour) {
                suffix = '[HOUR]';
                forPeriod = text;
            }
            if(isType) {
                suffix = '[TYPE]';
                forType = text;
            }

            if(isLocal) {
                suffix = '[LOCAL]';
            }
            if(!isDay && !isHour && !isType && !isLocal && !isClass) {
                //console.log('Unsupported text:', text);
            }
            else {
                //console.info('Text:', text, suffix);
            }

            if(isLocal) {

                // for multi local lines, i.e 'A-0610, A-3608'
                forLocals = text.split(', ');
                for(var local of forLocals) {
                    if(DATA[local] == undefined) {
                        DATA[local] = {
                            'Lun': [],
                            'Mar': [],
                            'Mer': [],
                            'Jeu': [],
                            'Ven': [],
                        };
                    }
                    if(DATA[local][forDay] == undefined) {
                        console.error(`Unable to add period '${forPeriod}' for local = '${local}' and day = '${forDay}' (invalid day)`);
                    }
                    else {
                        if(DATA[local][forDay].indexOf(forPeriod) == -1) {
                            DATA[local][forDay].push(forPeriod);
                            console.log(`Adding '${forPeriod}' for day '${forDay}' for class '${forClass}' to local '${local}'`);
                        }
                    }
                }
            }
        }
    }
}
