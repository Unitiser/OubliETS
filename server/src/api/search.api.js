module.exports = class SearchApi {
    constructor(app, db) {
        // TODO: Register the god damn endpoints ...

        app.use('/search', this.search);
    }

    search(req, res){
        res.send('Allo');
    }



}