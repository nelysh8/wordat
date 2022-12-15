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

// WORDBOOK ADD

router.post('/add', function (req, res, next) {    
    var newlist_name = req.body.title;
    var sql = "CREATE TABLE " + newlist_name + " (ID INT(11) NOT NULL AUTO_INCREMENT, P_ID INT(11) NOT NULL DEFAULT '0', ENG TEXT, KOR TEXT, SAVEDATE DATETIME NOT NULL, LOADDATE DATETIME NOT NULL, LOAD_NUM INT(11) NOT NULL DEFAULT '0', PRIMARY KEY(ID))";
    console.log(sql);
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results);
    });
});

// WORDBOOK DELETE

router.post('/remove', function (req, res, next) {    
    var wordbook_title = req.body.title;
    var sql = "DROP TABLE " + wordbook_title;
    console.log(sql);
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results);
    });
});

// WORDBOOK EDIT

router.post('/edit', function (req, res, next) {    
    var wordbook_oldtitle = req.body.oldtitle;
    var wordbook_newtitle = req.body.newtitle;
    var sql = "ALTER TABLE " + wordbook_oldtitle + " RENAME " + wordbook_newtitle;
    console.log(sql);
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results);
    });
});


// WORD LIST

router.post('/wordlist', function (req, res, next) {    
    var wordbook_title = req.body.title;    
    var sql = "SELECT * FROM " + wordbook_title + " WHERE P_ID=0";
    console.log(sql);
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.json(results);        
    });
});

// WORD ADD

router.post('/wordlist/add/', function (req, res, next) {        
    var wordbook_title = req.body.title;
    console.log(wordbook_title);
    var word_english = req.body.eng;
    console.log(word_english);
    var word_korean = req.body.kor;
    console.log(word_korean);
    var data = [word_english, word_korean];
    console.log(wordbook_title + ' ---- ' + data);
    
    var sql = "INSERT INTO " + wordbook_title + " (ENG, KOR, SAVEDATE, LOADDATE) VALUE (?,?,now(), now())";
    conn.query(sql, data, function(err, results){
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