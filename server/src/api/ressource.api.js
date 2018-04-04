module.exports = class RessourceApi {
    constructor(app, ressourceService){
        this.ressourceService = ressourceService;

        // Register routes
        app.use('/ressources', this.list.bind(this));
    }

    list(req, res) {
        this.ressourceService.list()
            .subscribe((rows) => {
                res.json(rows);
            }, () => res.sendStatus(500).send('Internal server error.'));
    }
};