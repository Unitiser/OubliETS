module.exports = class SoftwareApi {
    constructor(app, softwareService){
        this.softwareService = softwareService;

        // Register routes
        app.use('/softwares', this.list.bind(this));
    }

    list(req, res) {
        this.softwareService.list()
            .subscribe((rows) => {
                res.json(rows);
            }, () => res.sendStatus(500).send('Internal server error.'));
    }
};