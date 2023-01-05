var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var mysql_odbc = require('../db/db_conn')();
// var conn = mysql_odbc.client('oq4p2dxa5zpnk9gu');
// var conn = mysql_odbc.init();
var conn = mysql_odbc.init();
var auth_conn = mysql_odbc.auth(); // 회원관리 db
var client_conn;   // = mysql_odbc.client(); 로그인 회원 db

var moment = require('moment');
var today = moment();

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
    console.log(req.cookies.client_email_chg);
    var client_email_chg = req.cookies.client_email_chg;    
    client_conn = mysql_odbc.client(client_email_chg);    

    var sql = "SHOW tables";
    console.log(sql);
    client_conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);                
        res.json(results);
    });
});

// WORDBOOK ADD

 // 식별번호, 영어문장, 한글문장, [{예문1 영어, 예문1 한글, 저장시각, 로드시각, 로드횟수}, 저장시각, 로드시각, 로드횟수]

router.post('/add', function (req, res, next) {        
    var client_email_chg = req.cookies.client_email_chg;
    client_conn = mysql_odbc.client(client_email_chg);

    var newlist_name = (req.body.title).replace(/ /gi, '_');        
    var sql = "CREATE TABLE " + newlist_name + " (ID INT(11) NOT NULL AUTO_INCREMENT, WORDBOOK_TITLE TEXT, ENG TEXT, KOR TEXT, EXAMPLE JSON, SAVEDATE DATETIME NOT NULL, LOADDATE DATETIME NOT NULL, LOAD_NUM INT(11) NOT NULL DEFAULT '0', QUIZ_NUM INT(11) NOT NULL DEFAULT '0', QUIZ_RESULT INT(11) NOT NULL DEFAULT '0', QUIZ_DATE DATETIME NOT NULL, PRIMARY KEY(ID))";
    console.log(sql);
    client_conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results);
    });
});

// WORDBOOK DELETE

router.post('/remove', function (req, res, next) {    
    var client_email_chg = req.cookies.client_email_chg;
    client_conn = mysql_odbc.client(client_email_chg);

    console.log('remove wordbook_title');
    var wordbook_title = req.body.title;
    var sql = "DROP TABLE " + wordbook_title;
    console.log(sql);
    client_conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results);
    });
});

// WORDBOOK EDIT

router.post('/edit', function (req, res, next) {
    var client_email_chg = req.cookies.client_email_chg;
    client_conn = mysql_odbc.client(client_email_chg);

    console.log('edit wordbook_title');    
    var wordbook_oldtitle = req.body.oldtitle;
    var wordbook_newtitle = req.body.newtitle;
    var sql = "ALTER TABLE " + wordbook_oldtitle + " RENAME " + wordbook_newtitle;
    console.log(sql);
    client_conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results);
    });
});


// WORDLIST

router.post('/wordlist', function (req, res, next) {   
    var client_email_chg = req.cookies.client_email_chg;
    client_conn = mysql_odbc.client(client_email_chg);

    var wordbook_title = req.body.title;        
    console.log(wordbook_title);
    var sql = `SELECT * FROM ${wordbook_title}`;
    // var sql = "SELECT * FROM " + wordbook_title + " WHERE P_ID=0";
    console.log(sql);
    client_conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.json(results);        
    });
});

// WORD

router.post('/word', function (req, res, next) {   
    var client_email_chg = req.cookies.client_email_chg;
    client_conn = mysql_odbc.client(client_email_chg);

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
    client_conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results[1]);        
    });
});

// WORD ADD

router.post('/word/add/', function (req, res, next) {        
    var client_email_chg = req.cookies.client_email_chg;
    client_conn = mysql_odbc.client(client_email_chg);

    var wordbook_title = req.body.wordbook_title;
    console.log(wordbook_title);
    var word_english = req.body.eng;
    console.log(word_english);
    var word_korean = req.body.kor;
    console.log(word_korean);
    var data = [wordbook_title, word_english, word_korean, '[]'];
    console.log(wordbook_title + ' ---- ' + data);        
    var time = today.format('YYYYMMDD');

    var sql = `INSERT INTO ${wordbook_title} (WORDBOOK_TITLE, ENG, KOR, EXAMPLE, SAVEDATE, LOADDATE, QUIZ_DATE) VALUE (?,?,?,?,${time}, ${time}, ${time})`;
    client_conn.query(sql, data, function(err, results){
        if (err) console.err("err:" + err);
        res.json(results);   
    });    
});

// WORD REMOVE

router.post('/word/remove/', function (req, res, next) {        
    var client_email_chg = req.cookies.client_email_chg;
    client_conn = mysql_odbc.client(client_email_chg);

    console.log('remove word');
    var wordbook_title = req.body.wordbook_title;    
    var word_id = req.body.word_id;           
    
    var sql = `DELETE FROM ${wordbook_title} WHERE id = ${word_id}`;
    client_conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results);
    });   
});

// WORD EDIT

router.post('/word/edit/', function (req, res, next) {    
    var client_email_chg = req.cookies.client_email_chg;
    client_conn = mysql_odbc.client(client_email_chg);
    
    console.log('edit word');
    var wordbook_title = req.body.wordbook_title;    
    var word_id = req.body.word_id;           
    var word_eng = req.body.word_eng;           
    var word_kor = req.body.word_kor;           
    
    var sql = `UPDATE ${wordbook_title} SET ENG = '${word_eng}', KOR = '${word_kor}' WHERE ID = ${word_id};`;
    console.log(sql);
    client_conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);        
        res.json(results);
    });   
});

// EXAMPLE ADD

router.post('/exam/add/', function (req, res, next) {        
    var client_email_chg = req.cookies.client_email_chg;
    client_conn = mysql_odbc.client(client_email_chg);

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
    client_conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.json(results);   
    });
});

// Quiz search

router.post('/quiz', async function (req, res, next) {
	var client_email_chg = req.cookies.client_email_chg;
    client_conn = mysql_odbc.client(client_email_chg);

    var sql = req.body.sql_query;
	var filtered_results;
	var ranged_results;
	var target_result;
	var random_num;

	client_conn.query(sql, function(err, results){
		if (err) console.err("err:" + err);
		if (results.length === 0) {  // 총 문장수가 0개
			res.send(0);
		} else if ((results.length>0) && (results.length <= 10 )){ // 총 문장수가 x개 이하
			random_num = Math.floor(Math.random() * results.length);
			console.log(`오늘의 숫자는 ${random_num}(총 문장갯수 ${results.length})입니다`);
			console.log(`오늘의 문장은 ${(results[random_num].ENG)}입니다.`);
			res.send(results[random_num]);
		} else { // 그외
			// 1. 최종조회기간 평균 초과범위
			var interval=0;
			var interval_avg;
			for (result of results) {            
				interval += today.diff(moment(result.LOADDATE),'days');
			}
			interval_avg = interval / results.length;
			console.log(`총 ${results.length}개 문장과의 평균기간도과일은 ${interval_avg}일입니다.`);
			filtered_results = results.filter(function(result){
					if (today.diff(moment(result.LOADDATE),'days') > interval_avg) {
							return true;
					}					
			});
			console.log(`평균기간도과 문장은 총 ${filtered_results.length}개입니다.`);
			if (filtered_results.length <= 10) { // 필터된 문장수가 x개 이하인 경우
				console.log(`필터된 문장갯수는 ${filtered_results.length}개 입니다`);
				filtered_results = results;
				random_num = Math.floor(Math.random() * filtered_results.length);
				console.log(`오늘의 숫자는 ${random_num}(총 대상문장갯수 ${filtered_results.length})입니다`);
				console.log(`오늘의 문장은 ${(filtered_results[random_num].ENG)}입니다.`);                
				res.send(filtered_results[random_num]);
			} else {
				// 2. 정확도 체크(1. 정답률 -> 2. 응답률) 향후 구현
				console.log(`필터된 문장갯수는 ${filtered_results.length}개 입니다`);
				filtered_results = results;
				random_num = Math.floor(Math.random() * filtered_results.length);
				console.log(`오늘의 숫자는 ${random_num}(총 대상문장갯수 ${filtered_results.length})입니다`);
				console.log(`오늘의 문장은 ${(filtered_results[random_num].ENG)}입니다.`);
				res.send(filtered_results[random_num]);
			}			
		}
	});
});
    
router.post('/quiz_result', async function (req, res, next) {
    var client_email_chg = req.cookies.client_email_chg;
    client_conn = mysql_odbc.client(client_email_chg);

    var time = today.format('YYYYMMDD');

    var wordbook_title = req.body.wordbook_title;
    var word_id = req.body.word_id;
    var quiz_num = req.body.quiz_num;
    var quiz_result = req.body.quiz_result;
    
    var sql = `UPDATE ${wordbook_title} SET QUIZ_NUM = QUIZ_NUM + ${quiz_num}, QUIZ_RESULT = QUIZ_RESULT + ${quiz_result}, QUIZ_DATE = ${time} WHERE ID = ${word_id};`;
    console.log(sql);

    client_conn.query(sql, function(err, results){
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