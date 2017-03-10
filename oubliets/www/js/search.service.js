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