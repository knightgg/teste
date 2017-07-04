var request = require('supertest');
var app = require('../app');
var expect = require('chai').expect;

/* jshint -W117 */
describe('Api usuário', function() {
    var invalidUser = {
        'nome': 'teste',
        'email': 'teste1@teste.com',
        'senha': 'senha'
    };

    var validUser = {
        'nome' : 'teste',
        'email': 'teste@teste.com',
        'senha': 'senha'
    };

    var loggedUser = {};

    var createUserId;

    var session = request.agent(app);

    after(function (done) {
        app.models.userModel.deleteUserById(createUserId)
        .then(function(){
            done();
        });
    });

    it('Cadastro de usuário', function(done) {
        session
           .post('/signup/')
           .send(validUser)
           .expect(201)
           .expect(function(response) {
              expect(response.body).to.have.property('_id');
           })
           .end(function(err,res) {
                createUserId = res.body._id;
                done(err);
            });
    });

    it('Cadastro de usuário com dados validos', function(done) {
        session
           .post('/signup/')
           .expect(400)
           .expect(function(response)   {
              expect(response.body).to.have.property('mensagem');
           })
           .end(function(err,res) {
                done(err);
            });
    });

    it('Cadastro de usuário com email existente', function(done) {
        session
           .post('/signup/')
           .send(validUser)
           .expect(409)
           .expect(function(response) {
              expect(response.body).to.have.property('mensagem');
           })
           .end(function(err,res) {
                loggedUser = res.body;
                done(err);
            });
    });

    it('Login com dados validos', function(done) {
        session
           .post('/signin/')
           .send(validUser)
           .expect(200)
           .expect(function(response)   {
              expect(response.body).to.have.property('token');
           })
           .end(function(err,res) {
                loggedUser = res.body;
                done(err);
            });
    });

    it('Login sem email ou senha', function(done) {
        session
           .post('/signin/')
           .expect(400)
           .expect(function(response) {
              expect(response.body).to.have.property('mensagem');
           })
           .end(function(err,res) {
                done(err);
            });
    });

    it('Login com usuário inexistente', function(done) {
        session
           .post('/signin/')
           .send(invalidUser)
           .expect(401)
           .expect(function(response) {
              expect(response.body).to.have.property('mensagem');
           })
           .end(function(err,res) {
                done(err);
            });
    });

    it('Procura usuário', function(done) {
        session
           .get('/searchUser/'+ loggedUser.id)
           .set('authorization', 'Bearer ' + loggedUser.token)
           .expect(200)
           .expect(function(response) {
              expect(response.body).to.have.property('token');
           })
           .end(function(err,res) {
                done(err);
            });
    });

    it('Procura usuário com header invalido', function(done) {
        session
           .get('/searchUser/'+ loggedUser.id)
           .set('authorization', loggedUser.token)
           .expect(401)
           .expect(function(response) {
              expect(response.body).to.have.property('mensagem');
           })
           .end(function(err,res) {
                done(err);
            });
    });

    it('Procura usuário com user_id diferente', function(done) {
        session
           .get('/searchUser/erro')
           .set('authorization', 'Bearer ' + loggedUser.token)
           .expect(401)
           .expect(function(response) {
              expect(response.body).to.have.property('mensagem');
           })
           .end(function(err,res) {
                done(err);
            });
    });
});