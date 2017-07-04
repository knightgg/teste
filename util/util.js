var jwt = require('jwt-simple');
var secret = 'desafio';

var util = function(app) {
    return {
        getMessageFromErrors: function(errors) {
            var mensagem = '';
            errors.forEach(function(error){
                mensagem += (error.msg + '\n');
            });
            return mensagem;
        },

        generateToken: function(data) {
            var seconds = 60 * 30;
            return jwt.encode({data: data, nbf: (Date.now() / 1000), exp: ((Date.now() / 1000) + seconds) }, secret);
        },

        decodeToken: function(token) {
            try{
                return {
                    data:jwt.decode(token, secret),
                    success: true
                };
            }catch(error){
                return {
                    success:false,
                    error: (error === 'Token expired' ? 'Sessão inválida' : 'Não autorizado')
                };
            }
        } 
    };
};

module.exports = util;