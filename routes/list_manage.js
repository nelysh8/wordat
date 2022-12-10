var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

router.post('/', function (req, res, next) {
    var newlist_name = req.body.newlist_name;
    var sql = "CREATE TABLE " + newlist_name + " (ID INT(11) NOT NULL AUTO_INCREMENT, P_ID INT(11) NOT NULL DEFAULT '0', ENG TEXT, KOR TEXT, SAVEDATE DATETIME NOT NULL, LOADDATE DATETIME NOT NULL, LOAD_NUM INT(11) NOT NULL DEFAULT '0', PRIMARY KEY(ID))";
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.redirect('/wordlist');
    });
});

router.post('/remove/:list_name', function (req, res, next) {
    var list_name = req.params.list_name;
    var sql = "DROP TABLE " + list_name;
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.redirect('/wordlist');
    });
});

module.exports = router;
/*
" ('ID' INT(11) NOT NULL AUTO INCREMENT, 'P_ID' INT(11) NOT NULL DEFAULT '0', 'ENG' TEXT, 'KOR' TEXT, 'SAVEDATE' DATETIME NOT NULL, 'LOADDATE' DATETIME NOT NULL, 'LOAD_NUM' INT(11) NOT NULL DEFAULT '0', PRIMARY KEY('ID'))";
*/