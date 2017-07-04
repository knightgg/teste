var md5 = require('md5');
var guid = require('guid');

var userController = function(app) {
    var util = app.util.util;
    var dataAccess = app.models.userModel;

    return {
        create: function(req,res) {
            
            var newUser = req.body;
            var schema = {
                'nome' : {
                    notEmpty: true,
                    errorMessage: 'Nome é obrigatório!'
                },
                'senha' : {
                    notEmpty: true,
                    errorMessage: 'Senha é obrigatória!'
                },
                'email' : {
                    notEmpty: {
                        errorMessage : 'Email é obrigatório!'
                    },
                    isEmail : {
                        errorMessage : 'Email inválido!'
                    }
                }
            };
            req.checkBody(schema);

            req.getValidationResult()
            .then(function(result) {                
                    if(!result.isEmpty()){                    
                    var mensagem = util.getMessageFromErrors(result.array());
                    res.status(400);
                    res.json({                    
                        mensagem: mensagem                        
                    });
                    return;
                }
                dataAccess.checkUserExistbyEmail(newUser.email)
                .then(function(userExists) {
                    if(userExists){
                        res.status(409);
                        res.json({                    
                            mensagem: 'E-mail já existente'
                        });
                        return;
                    }

                    newUser.id = guid.raw();
                    newUser.senha = md5(newUser.senha);
                    var token = util.generateToken(newUser.id);
                    newUser.token = md5(token);
                    dataAccess.createUser(newUser)
                    .then(function(user) {
                        res.status(201);
                        user.token = token;
                        res.json(user); 
                        return;
                    });
                });
            });     
        },

        login: function(req,res) {
            
            var userLogin = req.body;
            var schema = {
                'senha' : {
                    notEmpty: true,
                    errorMessage: 'Senha é obrigatória!'
                },
                'email' : {
                    notEmpty: {
                        errorMessage : 'Email é obrigatório!'
                    },
                    isEmail : {
                        errorMessage : 'Email inválido!'
                    }
                }
            };
            req.checkBody(schema);

            req.getValidationResult()
            .then(function(result) {
                    if(!result.isEmpty()){                    
                    var mensagem = util.getMessageFromErrors(result.array());
                    res.status(400);
                    res.json({                    
                        mensagem: mensagem
                    });
                    return;
                }

                userLogin.senha = md5(userLogin.senha);

                dataAccess.getUserByLogin(userLogin)
                .then(function(resultLogin) {
                    if(resultLogin.length < 1)
                    {
                        res.status(401);
                        res.json({                    
                            mensagem: 'Usuário e/ou senha inválidos'
                        });
                        return;
                    }
                    
                    var user = resultLogin[0]._doc;
                    user.ultimo_login = Date();
                    var token = util.generateToken(user.id);
                    user.token = md5(token);

                    dataAccess.updateUser(user)
                    .then(function() {
                        user.token = token;
                        res.status(200);
                        res.json(user);
                        return;
                    });
                });
            });
        },

        search: function(req,res) {
            var bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader === 'undefined') {
                res.status(403);
                res.json({                    
                    mensagem: 'Não autorizado'
                });
                return;
            }

            var bearer = bearerHeader.split(' ');
            var bearerToken = bearer[1];
            var tokenDecoded = util.decodeToken(bearerToken);

            if(!tokenDecoded.success)
            {
                res.status(401);
                res.json({                    
                    mensagem: tokenDecoded.error
                });
                return;
            }

            if(req.params.user_id !== tokenDecoded.data.data)
            {
                res.status(401);
                res.json({                    
                    mensagem: 'Não autorizado'
                });
                return;
            }

            dataAccess.getUserById(tokenDecoded.data.data)
            .then(function(result) {
                if(result.length < 1)
                {
                    res.status(404);
                    res.json({                    
                        mensagem: 'Usuário não encontrado'
                    });
                    return;
                }
                var user = result[0];

                if(user.token !== md5(bearerToken)){
                    res.status(401);
                    res.json({                    
                        mensagem: 'Não autorizado'
                    });
                    return;
                }
                
                res.status(200);
                res.json(user);
                return;
            });
        }
    };
};

module.exports = userController;