var express = require('express');
const fs = require("fs");
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

var http = require('http');


router.get('/:list_name', function (req, res, next) {
    var list_name = req.params.list_name;
    var sql = "SELECT * FROM " + list_name + " WHERE P_ID=0";
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.render('word_manage', {title:list_name, results:results});

    });
});

router.get('/:list_name/:word_ID', function (req, res, next) {
    var list_name = req.params.list_name;
    var word_ID = req.params.word_ID;
    var sql = "SELECT * FROM " + list_name + " WHERE P_ID=" + word_ID;
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.render('word_manage', {title:list_name, results:results});

    });
});


router.post('/add/:list_name', function (req, res, next) {
    var list_name = req.params.list_name;
    var word_english = req.body.word_english;
    var word_korean = req.body.word_korean;
    var data = [word_english, word_korean];
    var sql = "INSERT INTO " + list_name + " (ENG, KOR, SAVEDATE, LOADDATE) VALUE (?,?,now(), now())";
    conn.query(sql, data, function(err, results){
        if (err) console.err("err:" + err);
        res.redirect('/word_manage/' + list_name);
    });
});

router.post('/example/:list_name', function (req, res, next) {
    var list_name = req.params.list_name;
    // var example_num = 5;
    var example_num = Number(req.body.example_num);
    // var example_eng = "abd";
    var example_eng = req.body.example_eng;
    // var example_kor = "가나다";
    var example_kor = req.body.example_kor;
    var data = [example_num, example_eng, example_kor];
    var sql = "INSERT INTO " + list_name + " (P_ID, ENG, KOR, SAVEDATE, LOADDATE) VALUE (?,?,?,now(), now())";
    conn.query(sql, data, function(err, results){
        if (err) console.err("err:" + err);
        res.redirect('/word_manage/' + list_name);
    });
});

router.post('/remove/:list_name', function (req, res, next) {
    var list_name = req.params.list_name;
    var word_id = req.body.word_id;
    var sql = "DELETE FROM " + list_name + " WHERE ID=" + word_id ;
    conn.query(sql, function(err, results){
        if (err) console.err("err:" + err);
        res.redirect('/word_manage/' + list_name);
    });
});

router.post('/modify/:list_name', function (req, res, next) {
    var list_name = req.params.list_name;
    var word_id = req.body.btn_mod;
    var mod_ENG = req.body.mod_ENG;
    var mod_KOR = req.body.mod_KOR;
    var data = [mod_ENG, mod_KOR, word_id];
    var sql = "UPDATE " + list_name + " SET ENG=?, KOR=?, SAVEDATE=now() WHERE ID=?";
    conn.query(sql, data, function(err, results){
        if (err) console.err("err:" + err);
        res.redirect('/word_manage/' + list_name);
    });
});






module.exports = router;
