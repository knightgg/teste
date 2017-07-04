var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id: {
        type: String,
        trim: true,
        required: true,
    },
    nome: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    senha: {
		type: String,
		required: true,
    },
    telefones: [],
    data_criacao: {
		type: Date,
		default: Date.now,
    },
    data_atualizacao: {
		type: Date,
		default: Date.now,
    },
    ultimo_login:{
		type:Date,
		default: Date.now
    },
    token: {
		type: String,
    },
    __v: {
        type: Number, 
        select: false
    }
});

var userModel = mongoose.model('User', userSchema);

var userDataAccess = function() {
    return {
        checkUserExistbyEmail: function(email) {
            return userModel
                .find({
                    email: email
                })
                .limit(1)
                .exec()
                .then(function(result) {
                    if(result.length > 0)
                        return true;
                    return false;
                });
        },

        getUserByLogin: function(user) {
            return userModel
                .find({
                    email: user.email,
                    senha: user.senha
                })
                .exec()
                .then(function(result) {                    
                    return result;
                });
        },

        getUserById: function(id) {
            return userModel
                .find({
                    id: id
                })
                .exec()
                .then(function(result) {                    
                    return result;
                });
        },

        createUser: function(newUser) {
            return userModel
                .create(newUser)
                .then(function(user) {
                    return user._doc;
                });
        },

        updateUser: function(newUser) {
            return userModel
                .findByIdAndUpdate(newUser._id, newUser)
                .exec()
                .then(function(result) {                    
                    return result;
                });
        },

        deleteUserById: function(id) {
            return userModel
                .findByIdAndRemove(id)
                .exec()
                .then(function(result) {                    
                    return result;
                });
        }
    };
};

module.exports = userDataAccess;