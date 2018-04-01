var fs = require('fs');
var PDFParser = require('pdf2json');
var sqlite3 = require('sqlite3').verbose();

var pdfParser = new PDFParser();

let HOUR_REGEX =/^([0-9]{2})[-:]([0-9]{2}) - ([0-9]{2})[-:]([0-9]{2})$/;
let LOCAL_REGEX = /^[ABE]-[0-9]{4}$/;
let CLASS_REGEX = /^[A-Z]{3}[0-9]{3}$/;

var DATA = {};
var db = new sqlite3.Database('dispo.db');

var pdfs = fs.readdirSync('./pdfs/');
parseNext();

function parseNext() {
    if(pdfs.length == 0) {
        printData();
        insertDataIntoDb();
    }
    else {
        var pdf = pdfs.pop();
        //pdf = "Horaires_Gen_E17.pdf";
        console.log('Parsing', pdf);
        pdfParser.loadPDF('./pdfs/' + pdf);
        setTimeout( () => { parseNext(); }, 5000);
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
                console.log(forType);

                // for multi local lines, i.e 'A-0610, A-3608'
                forLocals = text.split(', ');
                for(var local of forLocals) {
                    insertData(local, forDay, forPeriod, forClass);
                }
            }
        }
    }
}

function insertData(local, day, period, classSigil) {
    if(DATA[local] == undefined) {
        let emptyDay = buildDayArray();
        DATA[local] = {
            0 : emptyDay,
            1 : emptyDay,
            2 : emptyDay,
            3 : emptyDay,
            4 : emptyDay,
            5 : emptyDay,
            6 : emptyDay
        };
    }
    day = convertDay(day);
    if(DATA[local][day] == undefined) {
        console.error(`Unable to add period '${period}' for local = '${local}' and day = '${day}' (invalid day)`);
    }
    else {
        let hoursBusy = convertPeriod(period);
        if(hoursBusy != undefined) {
            for(let hour of hoursBusy) {
                let index = DATA[local][day].indexOf(hour);
                if(index != -1)
                    DATA[local][day].splice(index, 1); // remove the time from available hours
            }
            DATA[local][day].sort((a,b) => parseInt(a) > parseInt(b));
            // console.log(`Removing '${period}' for day '${day}' for class '${classSigil}' to local '${local}'`);
        }
    }
}

function convertPeriod(raw_period) {
    let parts = HOUR_REGEX.exec(raw_period);
    if(parts != undefined && parts.length >= 4) {
        let start = parseInt(parts[1]);
        let end =  parseInt(parts[3]);
        let res = [];
        for(; start <= end; start++)
        {
            res.push(start);
        }
        // console.log(`From ${raw_period} to ${res}`);
        return res;
    }
    else
    {
        console.log(`unable to convert period '${raw_period}'`);
        return undefined;
    }

}

function convertDay(raw_day) {
    switch(raw_day) {
        case 'Sun': return 0;
        case 'Lun': return 1;
        case 'Mar': return 2;
        case 'Mer': return 3;
        case 'Jeu': return 4;
        case 'Ven': return 5;
        case 'Sat': return 6;
    }
}

function buildDayArray() {
    let startTime = 7;
    let endTime = 21;
    let res = [];
    for(let time = startTime; time <= endTime; time++)
    {
        res.push(time);
    }
    return res;
}

function insertDataIntoDb() {

    db.run(`DELETE FROM timeslots`);
    db.run(`DELETE FROM rooms`);
    db.run(`DELETE FROM room_timeslot`);
    for(var i = 0; i <= 6; ++i){
		for (var j = 8; j < 24; ++j){
			db.run(`insert into timeslots (day, startTime, endTime) values (?, ?, ?)`, [i, j, j+1]);
		}
	}

    for(let local in DATA) {
        let localDays = DATA[local];
        let insertRoomSql = `INSERT INTO rooms (access, name, type) VALUES ("all", "${local}", "lab")`;
        db.run(insertRoomSql);
        let stmt = db.prepare(`SELECT idRoom FROM rooms WHERE name="${local}"`); // sqlite3's this.lastID not working
        stmt.get((err, row) => {
            if(err || !row) {
                console.error("Unable to add (or get id) of room:", err);
                return;
            }

            var idRoom = row.idRoom;
            //console.log("Added room", idRoom);
            for(let day in localDays)
            {
                let dayHours = localDays[day];
                //let insertTimeslotSql = `INSERT INTO timeslots (day, startTime, endTime) VALUES (${day}, 12, 17)`;
                //console.log(dayHours);
                for(let freeHour of dayHours) {
                    //console.log(`Selecting: SELECT idTimeslot FROM timeslots WHERE day=${day} AND startTime=${freeHour}`);
                    db.get(`SELECT idTimeslot FROM timeslots WHERE day=${day} AND startTime=${freeHour}`, (err, row) => {
                        if(row) {
                            try{
                                let insertRoomSlotSql = `INSERT INTO room_timeslot (idRoom, idTimeslot) VALUES (${idRoom},${row.idTimeslot})`;
                                console.log(insertRoomSlotSql);
                                db.run(insertRoomSlotSql);
                            } catch(e) {
                                console.log(e);
                            }
                        }
                    });
                }
                /*db.run(insertTimeslotSql, () => {
                    let idTimeSlot = this.lastID;

                });*/

            }
        });

    }
}
