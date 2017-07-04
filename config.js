var config = {};

config.server = {
        port: process.env.PORT || 4000
    };

config.mongoDb =  {
        url: process.env.MONGOURL;
    };

config.nodemonConfig = {
       scripts: 'app.js',
       ext: 'js',
       env: {
           PORT: config.server.port
       },
       ignore: ['./node_module/**']
    };

module.exports = config;