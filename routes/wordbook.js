var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

// WORDBOOK List

router.get('/', function (req, res, next) {
    var sql = "SHOW tables";
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.render('wordlist', {title:'Wordlist', results:results});
    });
    /*
    var sql = "select idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate," +
        "date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate from board";
    res.render('wordlist', {title: 'Wordlist'});
    */
});

router.post('/', function (req, res, next) {
    var sql = "SHOW tables";
    console.log(sql);
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results);
    });
});

// WORDLIST

router.post('/wordlist', function (req, res, next) {    
    var wordbook_name = req.body.name;    
    var sql = "SELECT * FROM " + wordbook_name + " WHERE P_ID=0";
    console.log(sql);
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.json(results);        
    });
});
    
    // conn.query(wordbook_name, function(err, results){
    //     if (err) console.err("err:" + err);        
    //     res.json(results);
    // });

    


// var list_name = req.params.list_name;
//     var word_english = req.body.word_english;
//     var word_korean = req.body.word_korean;
//     var data = [word_english, word_korean];


/*
router.get('/list/:page', function (req,res,next){
    var page = req.params.page;
    var sql = "select idx, name, title, date_format(modidate, '%Y-%m-%d %H:%i:%s') modidate," +
        "date_format(regdate, '%Y-%m-%d %H:%i:%s') regdate from board";
    conn.query(sql, function(err, rows){
        if (err) console.err("err:" + err);
        res.render('list', {title:'게시판 리스트', rows: rows});
    });
});
*/
module.exports = router;