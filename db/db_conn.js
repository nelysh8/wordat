var mysql = require('mysql');
var config = require('./db_info').aws;
var config_jaw = require('./db_info').real;

module.exports = function(){
    return {
        init: function() {
            return mysql.createConnection({
                host: config_jaw.host,
                port: config_jaw.port,
                user: config_jaw.user,
                password: config_jaw.password,
                database: config_jaw.database,
                multipleStatements : config.multipleStatements
            })            
        },
        auth: function() {
            return mysql.createConnection({
                host: config.host,
                port: config.port,
                user: config.user,
                password: config.password,
                database: 'auth',
                multipleStatements : config.multipleStatements
            })            
        },        
        root: function() {
            return mysql.createConnection({
                host: config.host,
                port: config.port,
                user: config.user,
                password: config.password,
                database: '',
                multipleStatements : config.multipleStatements
            })            
        },    
        client: function (database) {
            return mysql.createConnection({
                host: config.host,
                port: config.port,
                user: config.user,
                password: config.password,
                database: database,
                multipleStatements : config.multipleStatements
            })
        }
    }
};
