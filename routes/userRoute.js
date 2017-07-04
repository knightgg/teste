var routes = function(app) {    
    var controller = app.controllers.userController;

    app.post('/signup/', function(req, res) {
        controller.create(req, res);
    });

    app.post('/signin/', function(req, res) {
        controller.login(req, res);
    });

    app.get('/searchUser/:user_id', function(req, res) {
        controller.search(req, res);
    });

    app.get('*', function(req, res){
        res.send({mensagem:'Não encontrado'}, 404);
    });
};

module.exports = routes;