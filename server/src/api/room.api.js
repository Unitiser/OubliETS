module.exports = class RoomApi {
    constructor(app, roomService){
        this.roomService = roomService;

        // Register routes
        app.use('/room/access', this.listAccess.bind(this));
        app.use('/room/search', this.search.bind(this));
        app.use('/room/ressources/:id', this.findResourcesForRoom.bind(this));
        app.use('/room/timeslots/:id', this.findTimeslotsForRoom.bind(this));
    }

    listAccess(req, res) {
        this.roomService.listAccess()
            .subscribe((rows) => {
                res.json(rows);
            }, () => res.sendStatus(500).send('Internal server error.'));

    }

    search(req, res){
        let params = req.body;
        this.roomService.search(params)
            .subscribe((r) => {
                res.json(r);
            },
            (err) => console.log(err));
    }

    findResourcesForRoom(req, res) {
        let idRoom = req.params.id;
        this.roomService.findResourcesForRoom(idRoom)
            .subscribe((r) => {
                res.json(r);
            },
            (err) => console.log(err));
    }

    findTimeslotsForRoom(req, res) {
        let idRoom = req.params.id;
        this.roomService.findTimeslotsForRoom(idRoom)
            .subscribe((r) => {
                res.json(r);
            },
            (err) => console.log(err));
    }
};