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

 // 식별번호, 영어문장, 한글문장, [{예문1 영어, 예문1 한글, 저장시각, 로드시각, 로드횟수}, 저장시각, 로드시각, 로드횟수]

router.post('/add', function (req, res, next) {    
    var newlist_name = (req.body.title).replace(/ /gi, '_');        
    var sql = "CREATE TABLE " + newlist_name + " (ID INT(11) NOT NULL AUTO_INCREMENT, ENG TEXT, KOR TEXT, EXAMPLE JSON, SAVEDATE DATETIME NOT NULL, LOADDATE DATETIME NOT NULL, LOAD_NUM INT(11) NOT NULL DEFAULT '0', PRIMARY KEY(ID))";
    console.log(sql);
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results);
    });
});

// WORDBOOK DELETE

router.post('/remove', function (req, res, next) {    
    console.log('remove wordbook_title');
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
    console.log('edit wordbook_title');    
    var wordbook_oldtitle = req.body.oldtitle;
    var wordbook_newtitle = req.body.newtitle;
    var sql = "ALTER TABLE " + wordbook_oldtitle + " RENAME " + wordbook_newtitle;
    console.log(sql);
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results);
    });
});


// WORDLIST

router.post('/wordlist', function (req, res, next) {    
    var wordbook_title = req.body.title;        
    console.log(wordbook_title);
    var sql = `SELECT * FROM ${wordbook_title}`;
    // var sql = "SELECT * FROM " + wordbook_title + " WHERE P_ID=0";
    console.log(sql);
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.json(results);        
    });
});

// WORD

router.post('/word', function (req, res, next) {    
    console.log(req.body);
    var wordbook_title = req.body.wordbook_title;    
    var word_id = req.body.word_id;
    console.log(wordbook_title, word_id);
    let now = new Date();
    let time = `${now.getFullYear()}${now.getMonth()+1}${now.getDate()}`;
    var sql = `
        UPDATE ${wordbook_title} SET LOADDATE = ${time}, LOAD_NUM = LOAD_NUM + 1 WHERE ID = ${word_id};
        SELECT * FROM ${wordbook_title} WHERE ID = ${word_id};`;
    // var sql = "SELECT * FROM " + wordbook_title + " WHERE P_ID=0";
    //  
    console.log(sql);
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results[1]);        
    });
});

// WORD ADD

router.post('/word/add/', function (req, res, next) {        
    var wordbook_title = req.body.wordbook_title;
    console.log(wordbook_title);
    var word_english = req.body.eng;
    console.log(word_english);
    var word_korean = req.body.kor;
    console.log(word_korean);
    var data = [word_english, word_korean, '[]'];
    console.log(wordbook_title + ' ---- ' + data);
    let now = new Date();
    let time = `${now.getFullYear()}${now.getMonth()+1}${now.getDate()}`;
    console.log(time);

    var sql = `INSERT INTO ${wordbook_title} (ENG, KOR, EXAMPLE, SAVEDATE, LOADDATE) VALUE (?,?,?,${time}, ${time})`;
    conn.query(sql, data, function(err, results){
        if (err) console.err("err:" + err);
        res.json(results);   
    });    
});

// EXAMPLE ADD

router.post('/exam/add/', function (req, res, next) {        
    console.log('exam add start');
    var wordbook_title = req.body.wordbook_title;        
    var word_id = req.body.word_id;        
    var exam_eng = req.body.exam_eng;        
    var exam_kor = req.body.exam_kor;        
    console.log('elements : ' + wordbook_title, word_id, exam_eng, exam_kor);
    var data = {'ENG' : exam_eng, 'KOR' : exam_kor};
    var example = JSON.stringify(data);
    console.log(example);    
    // value change //
        // var sql = `UPDATE ${wordbook_title} SET EXAMPLE = 'aaa' WHERE ID = ${word_id}`;
    // value add //            
        var sql = `UPDATE ${wordbook_title} SET EXAMPLE = JSON_ARRAY_APPEND(EXAMPLE, '$', CAST('${example}' AS JSON)) WHERE ID = ${word_id}`;
    console.log(sql);
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.json(results);   
    });
});

// Quiz search

router.post('/quiz', async function (req, res, next) {
    var sql = req.body.sql_query;
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.json(results);
    });
});
    


// 
// router.post('/exam/add/', function (req, res, next) {        
//     var word_title = req.body.title;
//     console.log(wordbook_title);
//     var exam_english = req.body.eng;
//     console.log(word_english);
//     var exam_korean = req.body.kor;
//     console.log(word_korean);
//     var data = [exam_english, exam_korean];
//     console.log(word_title + ' ---- ' + data);
    
//     var sql = `UPDATE  ${table_name} SET EXAM = '${example.data}' WHERE id = ${target.id};`;
//     conn.query(sql, data, function(err, results){
//         if (err) console.err("err:" + err);
//         res.json(results);   
//     });
// });

// UPDATE table_name SET name = '김현우', country = '대한민국' WHERE id = 1004;
    
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