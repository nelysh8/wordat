var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

router.get('/', function(req,res,next) {
    conn.connect(function (err) {
        if (err) {
            res.render('mysql', {connect: '연결실패', err: err});
            console.error(err);
            throw err;
        } else {
            res.render('mysql', {connect: '연결성공', err: '없음'});
        }
    });
    conn.end();
});

/*
router.get('/', function(req,res,next){
    var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '#1tsom0926',
        database: 'basic_DB'
    });

    connection.connect(function(err){
        if (err) {
            res.render('mysql', {connect: '연결실패', err: err});
            console.error(err);
            throw err;
        } else{
            res.render('mysql', {connect:'연결성공', err:'없음'});
        }
    });
    connection.end();
});
*/


module.exports = router;

