// Sample queries

// Select local by ressource 

// select r.name, r.type from rooms as r 
//  left join room_ressource as rr on rr.idRoom = r.idRoom  
//  left join ressources as re on rr.idRessource = re.idRessource 
//  where re.name='computer'
//  group by r.idRoom;


// Select room by timeslot

// select r.name, t.startTime, t.endTime from rooms as r 
//     left join room_timeslot as rt on r.idRoom = rt.idRoom 
//     left join timeslots as t on t.idTimeslot = rt.idTimeslot 
//     where t.startTime = 8
//     group by r.idRoom;
function SearchService(db){
    this.db = db;
};


SearchService.prototype.find = function find(params){
    var self = this;
    var select = `select r.name, r.type from rooms as r 
                    left join room_timeslot as rt on r.idRoom = rt.idRoom 
                    left join timeslots as t on t.idTimeslot = rt.idTimeslot 
                    left join room_ressource as rr on rr.idRoom = r.idRoom  
                    left join ressources as re on rr.idRessource = re.idRessource `
    var where = `where `;
    var groupby = `group by r.idRoom`;

    $.each(params, function(key, val){
        where += `${self.getRealSearchField(key)} = ${val} `;
        console.log(key, val);
    });
    
    var query = select + where + groupby;

    console.log(this.db);
    this.db.executeSql(query, function(res){
        console.log(query);
        console.log(res);
        console.log(res.rows);
    });
};

SearchService.prototype.getRealSearchField = function(name){
    let mapping = {
        'room-name' : 'r.name',
        'start-time' : 'rt.startTime',
        'end-time' : 'rt.endTime',
        'resource' : 'rr.name',
        'room-type' : 'r.type',
    }
    return mapping[name];
};