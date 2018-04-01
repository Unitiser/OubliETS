module.exports = class RoomApi {
    constructor(app, roomService){
        this.roomService = roomService;

        // Register routes
        app.use('/room/access', this.listAccess.bind(this));
        app.use('/room/search', this.search.bind(this))
    }

    listAccess(req, res) {
        this.roomService.listAccess()
            .subscribe((rows) => {
                res.json(rows);
            }, (err) => res.sendStatus(500).send('Internal server error.'));

    }

    search(req, res){
        let params = req.body;
        this.roomService.search(params)
            .subscribe((r) => {
                res.json(r)
            },
            (err) => console.log(err))
    }
}