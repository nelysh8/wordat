var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// my db
var mysql_odbc = require('./db/db_conn')();
var conn = mysql_odbc.init();
var auth_conn = mysql_odbc.auth(); // 회원관리 db
var root_conn = mysql_odbc.root(); // 루트 db
var client_conn;   // = mysql_odbc.client(); 로그인 회원 db

var moment = require('moment');
var today = moment();



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var formRouter = require('./routes/form');
var mysqlRouter = require('./routes/mysql');
var boardRouter = require('./routes/board');


// my Router

var wordbookRouter = require('./routes/wordbook');
var list_manageRouter = require('./routes/list_manage');
var word_manageRouter = require('./routes/word_manage');

// my setting

var http = require('http');
var fs = require('fs');
const { traceDeprecation } = require('process');
// const { last } = require('cheerio/lib/api/traversing');



//
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/form', formRouter);
app.use('/mysql', mysqlRouter);
app.use('/board', boardRouter);

// my app setting

app.use('/wordbook', wordbookRouter);
app.use('/list_manage', list_manageRouter);
app.use('/word_manage', word_manageRouter);
app.use(express.static('public'));

// my image folder

app.get('/images/:img_name', function(req,res){
  var img_name = req.params.img_name;
  fs.readFile('/images/icon_google.png',function(err, data) {
    // res.send(data);
    res.setHeader('Content-Type', 'image/jpg');
    res.setHeader('Content-Length', ''); // Image size here
    res.setHeader('Access-Control-Allow-Origin', '*'); // If needs to be public
    res.send(data);
    // res.writeHead(200, {'Content-Type' : 'image/jpg'});
    // res.write(data);
    // res.end(data);    
  });
});

// papago

app.post('/translate', function (req, res) {

  console.log('papago launch1');

  var client_id = 'jfubHYsSNbt90eWAe_lY';  // 'YOUR_CLIENT_ID';
  var client_secret = 'k3g0N0ERA6';  // YOUR_CLIENT_SECRET';

  var api_url = 'https://openapi.naver.com/v1/papago/n2mt';
  var source = req.body.source;
  var target = req.body.target;
  var query = req.body.word;  

  console.log(query);

  var request = require('request');
  var options = {
    url: api_url,
    form: {'source':source, 'target':target, 'text':query},
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  };
  
  console.log('papago launch2');

  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

// app.listen(3000, function () {
//   console.log('http://127.0.0.1:3000/translate app listening on port 3000!');
// });




// websearch_cambrg

app.post('/websearch_cambrg', function (req, res) {
  const axios = require("axios");
  const cheerio = require("cheerio");
  
  const word = req.body.word;

  const getHtml = async () => {
      try {
        return await axios.get("https://dictionary.cambridge.org/dictionary/english-korean/" + word);
      } catch (error) {
        console.error(error);
      }
    };
    
  getHtml()
  .then(html => {
      let whList = [];
      let ulList = [];
      const $ = cheerio.load(html.data);      
      const $wordhead = $('div.di-body');      
      // console.log('hi : ' + $wordhead.find('div.entry-body__el').length);
      // console.log('next : ' + $wordhead.find('div.entry-body__el').html());     
      let i = 0;

      for (let headhtml of $wordhead.find('div.entry-body__el')) {        
        const $head = $wordhead.find(`div.entry-body__el:nth-child(${i+1})`);
        
        whList[i] = {
          word : $head.find('div.di-title h2.headword span').text(),
          part : $head.find('span.pos').text(),         
          pronounce : $head.find('span.us').parent().find('span.ipa').text(),
          pronounce_link : $head.find('span.us source').attr('src')
        };                

        // console.log('hi : ' + $head.find('div.sense-block').length);
        
        let j = 0;
        ulList = [];

        for (let meaningbox of $head.find('div.sense-block')) {
          const $meaningline = $head.find(`div.sense-block:nth-child(${j+1})`);          

          ulList[j] = {
                meaning_eng : $meaningline.find('div.ddef_d').text().trim(),                  
                meaning_kor : $meaningline.find('span.trans').text().trim(),
                example : [$meaningline.find('div.def-body div.examp:nth-child(2) span').text().trim(), $meaningline.find('div.def-body div.examp:nth-child(3) span').text().trim()]                
          };                    
          j += 1;        
        };  
        
        // console.log(ulList);
        whList[i].meanings = ulList; 
        // console.log('-------------WL-----------------' + whList);
        i += 1;
      };
      // console.log('next : ' + $wordhead.find('div.entry-body__el').html());     
    const data = whList;    
    return data;
    })

.then(result => {      
  // console.log(result);          
  res.json(result);
});
});

// cartoon

app.post('/cartoon', function (req, res) {  
  const axios = require("axios");
  const cheerio = require("cheerio");  
  var moment = require('moment');  
  var today = moment().subtract(1, 'days');
  var links = {
    'cartoon_peanuts' : '',
    'cartoon_calvin' : '',
    'cartoon_garfield' : ''
  };
  function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
  } 

  console.log(today.format('YYYY/MM/DD'));
  const getHtml_1 = async () => {
      try {
        return await axios.get("https://www.gocomics.com/peanuts/" + today.format('YYYY/MM/DD'));
      } catch (error) {
        console.error(error);
      }
    };    
  getHtml_1()
  .then(html => {      
    var cheerio = require('cheerio')
    var $ = cheerio.load(html.data);
    var $content = $('div.comic__image');    
    const $cartoon_img = $content.find('img.img-fluid').attr('src');      
    console.log($cartoon_img);
    return $cartoon_img;
  })
  .then(result => {              
    links.cartoon_peanuts = result;
  });

  const getHtml_2 = async () => {
    try {
      return await axios.get("https://www.gocomics.com/calvinandhobbes/" + today.format('YYYY/MM/DD'));
    } catch (error) {
      console.error(error);
    }
  };    
  getHtml_2()
  .then(html => {      
    var cheerio = require('cheerio')
    var $ = cheerio.load(html.data);
    var $content = $('div.comic__image');    
    const $cartoon_img = $content.find('img.img-fluid').attr('src');      
    console.log($cartoon_img);
    return $cartoon_img;
  })
  .then(result => {               
    links.cartoon_calvin = result;
  });

  const getHtml_3 = async () => {
    try {
      return await axios.get("https://www.gocomics.com/garfield/" + today.format('YYYY/MM/DD'));
    } catch (error) {
      console.error(error);
    }
  };    
  getHtml_3()
  .then(html => {      
    var cheerio = require('cheerio')
    var $ = cheerio.load(html.data);
    var $content = $('div.comic__image');    
    const $cartoon_img = $content.find('img.img-fluid').attr('src');      
    console.log($cartoon_img);
    return $cartoon_img;
  })
  .then(result => {                
    links.cartoon_garfield = result;
  });

  async function result() {
    var time_interval = 1.5;
    if ((links.cartoon_peanuts !== '') && (links.cartoon_calvin !== '')) {
      console.log('cartoon s0 : ');
      console.log(links);
      res.send(links);
    } else {
      console.log(links);                    
      await sleep(time_interval);      
      if ((links.cartoon_peanuts !== '') && (links.cartoon_calvin !== '')) {
        console.log('cartoon s1 : ');                    
        console.log(links);
        res.send(links);
      } else {
        await sleep(time_interval);                          
        if ((links.cartoon_peanuts !== '') && (links.cartoon_calvin !== '')) {
          console.log('cartoon s2 : ');                    
          console.log(links);
          res.send(links);
        } else {
          await sleep(time_interval);
          if ((links.cartoon_peanuts !== '') && (links.cartoon_calvin !== '')) {
            console.log('cartoon s3 : ');                    
            console.log(links);
            res.send(links);
          } else {
            await sleep(time_interval);
            if ((links.cartoon_peanuts !== '') && (links.cartoon_calvin !== '')) {
              console.log('cartoon s4 : ');                    
              console.log(links);
              res.send(links);
            } else {
              await sleep(time_interval);
              if ((links.cartoon_peanuts !== '') && (links.cartoon_calvin !== '')) {
                console.log('cartoon s5 : ');                    
                console.log(links);
                res.send(links);
              } else {
                await sleep(time_interval);
                if ((links.cartoon_peanuts !== '') && (links.cartoon_calvin !== '')) {
                  console.log('cartoon s6 : ');                    
                  console.log(links);
                  res.send(links);
                } else {
                  await sleep(time_interval);
                  if ((links.cartoon_peanuts !== '') && (links.cartoon_calvin !== '')) {
                    console.log('cartoon s7 : ');                    
                    console.log(links);
                    res.send(links);
                  } else {
                    console.log('error cartoon s7 : ');                    
                    console.log(links);
                    res.send(links);
                  }
                }
              }
            }
          }
        }        
      }      
    }  
  }  
  result();
});
        
app.post('/paper', function (req, res) {  
  const axios = require("axios");
  const cheerio = require("cheerio");  
  var moment = require('moment');  
  var today = moment().subtract(1, 'days');
  var random_num, urban_random_num;
  var links = {
    'word' : {
      'title' : '',      
      'pronun' : '',
      'part' : '',
      'image_link' : '',
      'image_title' : '', 
      'definition' : '',
      'example' : ''
    },
    'quote' : {
      'image_link' : '',
      'quote_text' : '',
      'author' : ''
    },
    'urban' : {
      'word_title' : '',
      'word_meaning' : '',
      'word_example' : ''
    },
    'history' : {
      'image_link' : '',
      'title' : '',
      'description' : '',
      'date' : ''
    }
  };
  function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
  } 

  console.log(today.format('YYYY/MM/DD'));
  const getHtml_1 = async () => {
      try {
        return await axios.get("https://www.britannica.com/dictionary/eb/word-of-the-day");
      } catch (error) {
        console.error(error);
      }
    };    
  getHtml_1()
  .then(html => {      
    var cheerio = require('cheerio')
    var $ = cheerio.load(html.data);
    var $content = $('div.lwod_main_c');    
    const $title = $content.find('div.hw_m.box_sizing');
    links.word.title = $title.find('div.hw_line span').text();    
    links.word.pronun = $title.find('div.text_prons span.hpron_word').text();
    links.word.part = $title.find('div.fl').text();
    links.word.image_link = $content.find('div.wod_img_act img').attr('src');
    links.word.image_title = $content.find('div.wod_img_tit').text();
    links.word.definition = $content.find('div.midbs div:nth-child(1) div.midbt p').text();
    links.word.example = $content.find('div.midbs div:nth-child(1) div.vibs li.vi p').text();
    
    return links;
  });

  // quote

  random_num = Math.floor(Math.random() * 10);
  console.log('random page : ' + random_num);
  

  const getHtml_2 = async () => {
    try {
      return await axios.get("https://www.goodreads.com/quotes?page="+random_num);
    } catch (error) {
      console.error(error);
    }
  };    
  getHtml_2()
  .then(html => {      
    var cheerio = require('cheerio')
    var $ = cheerio.load(html.data);
    var $content = $('div.quoteDetails');    
    random_num = Math.floor(Math.random() * $content.length);
    console.log('quote number : ' + $content.length + 'random number : ' + random_num);
    const $quote_detail = $content.parent().find(`div:nth-child(${random_num}) div.quoteDetails`);
    var quote_text_ep = $quote_detail.find('div.quoteText').text().trim().indexOf('\n');
    links.quote.image_link = $quote_detail.find('img').attr('src');
    links.quote.quote_text = $quote_detail.find('div.quoteText').text().trim().substr(0,quote_text_ep-1);
    links.quote.author = $quote_detail.find('span.authorOrTitle').text().trim();       

    return links;
  });

  // urban
  
  urban_random_num = Math.floor(Math.random() * 861) + 1;
  console.log('urban_random page : ' + urban_random_num);
  
  const getHtml_3 = async () => {
    try {
      return await axios.get("https://www.urbandictionary.com/?page="+urban_random_num);
    } catch (error) {
      console.error(error);
    }
  };    
  getHtml_3()
  .then(html => {
    var cheerio = require('cheerio')
    var $ = cheerio.load(html.data);
    var $content = $('div.definition');  
    urban_random_num = Math.floor(Math.random() * $content.length)+1;
    console.log('word number : ' + $content.length + 'random number : ' + urban_random_num);
    var $detail = $content.eq(urban_random_num-1);
    // var $detail = $content.find(`div.definition:nth-of-type(${urban_random_num})`);
    links.urban.word_title = $detail.find('a.word').text();
    links.urban.word_meaning = $detail.find('div.meaning').html().replace(/<br>/gi, '\n').replace(/<(\/a|a)([^>]*)>/gi,'');
    links.urban.word_example = $detail.find('div.example').html().replace(/<br>/gi, '\n').replace(/<(\/a|a)([^>]*)>/gi,'');

    return links;
  });

  // history
  console.log(today.add(1,'d').format('MMMM-DD'));
  const getHtml_4 = async () => {
    try {
      return await axios.get("https://www.britannica.com/on-this-day/"+today.add(1,'d').format('MMMM-DD'));
    } catch (error) {
      console.error(error);
    }
  };    
  getHtml_4()
  .then(html => {
    var cheerio = require('cheerio')
    var $ = cheerio.load(html.data);
    var $content = $('div.otd-featured-event');      
    var $detail = $content.eq(0);
  
  links.history.image_link = $detail.find('div.card-media img').attr('src');
  links.history.title = $detail.find('div.card-body div.title').text();
  links.history.description = $detail.find('div.card-body div.description').text();
  links.history.date = today.add(1,'d').format('MMMM-DD');
  });

  async function result() {
    var time_interval = 2.5;
    if ((links.word.title !== '') && (links.quote.quote_text !== '') && (links.urban.word_title !== '') && (links.history.title !== '')) {
      console.log('paper s0 : ');
      console.log(links);
      res.send(links);
    } else {
      console.log(links);                    
      await sleep(time_interval);      
      if ((links.word.title !== '') && (links.quote.quote_text !== '') && (links.urban.word_title !== '') && (links.history.title !== '')) {
        console.log('paper s1 : ');                    
        console.log(links);
        res.send(links);
      } else {
        await sleep(time_interval);                          
        if ((links.word.title !== '') && (links.quote.quote_text !== '') && (links.urban.word_title !== '') && (links.history.title !== '')) {
          console.log('paper s2 : ');                    
          console.log(links);
          res.send(links);
        } else {
          await sleep(time_interval);
          if ((links.word.title !== '') && (links.quote.quote_text !== '') && (links.urban.word_title !== '') && (links.history.title !== '')) {
            console.log('paper s3 : ');                    
            console.log(links);
            res.send(links);
          } else {
            await sleep(time_interval);
            if ((links.word.title !== '') && (links.quote.quote_text !== '') && (links.urban.word_title !== '') && (links.history.title !== '')) {
              console.log('paper s4 : ');                    
              console.log(links);
              res.send(links);
            } else {
              await sleep(time_interval);
              if ((links.word.title !== '') && (links.quote.quote_text !== '') && (links.urban.word_title !== '') && (links.history.title !== '')) {
                console.log('paper s5 : ');                    
                console.log(links);
                res.send(links);
              } else {
                console.log('paper error s5 : ');                    
                console.log(links);
                res.send(links);
              }
            }
          }
        }        
      }      
    }  
  }  
  result();
});

// ebook

app.post('/ebook_list', function (req, res) {  
  const axios = require("axios");
  const cheerio = require("cheerio");  
  var moment = require('moment');  
  var today = moment().subtract(1, 'days');
  var view_num = 1 + req.body.view_num*25;
  var links = [];
  // {
  //   'image_link' : '',
  //   'title' : '',
  //   'author' : '',
  //   'hit' : ''
  // };
  console.log('ebook view_num : ' + view_num);
  function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
  } 
  // random_num = 1 + (Math.floor(Math.random() * 4) * 25);
  // console.log('ebook-list random_num : ' + random_num);

  const getHtml = async () => {
      try {
        return await axios.get("https://www.gutenberg.org/ebooks/search/?sort_order=downloads&start_index=" + view_num);
      } catch (error) {
        console.error(error);
      }
    };    
  getHtml()
  .then(html => {      
    var cheerio = require('cheerio')
    var $ = cheerio.load(html.data);
    var $contents = $('li.booklink');   
    console.log('ebook list_num : ' +$contents.length);
    
    for (var i = 0; i< $contents.length; i++) {      
      var ebook_num = $contents.eq(i).find('a').attr('href').replace('/ebooks/','');
      links[i] = {
        ebook_num : ebook_num,
        image_link : 'https://www.gutenberg.org/' + $contents.eq(i).find('img').attr('src'),
        title : $contents.eq(i).find('span.title').text(),
        author : $contents.eq(i).find('span.subtitle').text(),
        hit : $contents.eq(i).find('span.extra').text().replace(' downloads', '')
      }      
    }
    // console.log(links);    
    return links;
  })
  .then(results => {
    if ((links[0].title !== null) && (links[0].title !== '')) {
      res.send(links);
    }
  });
});

app.post('/open_ebook', function (req, res) {  
  const axios = require("axios");
  const cheerio = require("cheerio");  
  var nlp = require('compromise');  
  
  // const winkNLP = require( 'wink-nlp' );
  // const model = require( 'wink-eng-lite-web-model' );
  // const nlp = winkNLP( model );
  // const its = nlp.its;
  // const as = nlp.as;
  
  var ebook_num = req.body.ebook_num; 
  var ebook_entitle;
  var ebook_chapter = [];
  var ebook_part = [];
  var test;

  console.log('ebook_num : ' + ebook_num);

  const getHtml = async () => {
    try {
      return await axios.get(`https://www.gutenberg.org/cache/epub/${ebook_num}/pg${ebook_num}-images.html`);
    } catch (error) {
      console.error(error);
    }
  };    

  getHtml()
  .then(html => {
    var $ = cheerio.load(html.data);
    var $fig;
    var $chapter;
    var title_img, title_name, title_author;

    // ebook information
    $fig = $('div.fig');
    if ($fig.length !== 0) {      
      title_img = `https://www.gutenberg.org/cache/epub/${ebook_num}/${$fig.find('img').attr('src')}`;      
    } else {
      $fig = $('img:nth-child(1)');
      title_img = `https://www.gutenberg.org/cache/epub/${ebook_num}/${$fig.attr('src')}`;
    }
    title_name = $('#pg-machine-header p:nth-child(1)').text().replace('Title: ', '');    
    title_author = $('#pg-machine-header p:nth-child(2)').text();
    if (title_author.includes('Author') === false) {
      title_author = $('#pg-machine-header p:nth-child(3)').text().replace('Author: ', '');
    } else {
      title_author = title_author.replace('Author: ', '');
    }

    ebook_entitle = { 
      cover : {
        img_link : title_img,
        title : title_name,
        author : title_author
      }
    };    

    // chapter information
    $chapter = $('div.chapter');
    if ($chapter.length !== 0) {      
      console.log('we are here?');    
      
      let i=0;
      for (var chapter of $chapter) {                        
        var $ebook_contents_sentences = $chapter.eq(i).find('p');            
        let j=0;
        ebook_part = [];
        ebook_part = $ebook_contents_sentences.text().replace(/\n/gi, ' ');
        // for (sentence of $ebook_contents_sentences) {                        
          // var ebook_contents_sentence = $ebook_contents_sentences.eq(j).text().replace(/\n/gi, ' ');
          // var doc = nlp(ebook_contents_sentence);     
          // ebook_part[j] = doc.clauses().out('array');
          // ebook_part[j] = ebook_contents_sentence;
          // j += 1;
        // };
        ebook_chapter[i] = {
          num : (i + 1),
          title : ($chapter.eq(i).find('h2').text()),
          sentence : ebook_part
        };            
        i+=1;      
      };
      ebook_entitle.chapter = ebook_chapter;        
      return ebook_entitle;

    } else {
      var $chapter_div = $('table > tbody > tr');
      console.log('we are here');
      console.log($chapter_div.length);
      
      var chapter_id = [];

      // var i = 1;
      // for (var chapter_div of $chapter_div) {
      //   var temp_id = $chapter_div.parent().find(`tr:nth-child(${i}) a.pginternal`).attr('href');          
      //   if ((temp_id !== undefined) && (temp_id.includes('.') === false)) {
      //     chapter_id.push(temp_id.replace('#',''));
      //   }        
      //   i += 1;
      // }

      ebook_chapter = {
        num : 'error',
        title : '',
        sentence : '',
        link : `https://www.gutenberg.org/cache/epub/${ebook_num}/pg${ebook_num}-images.html`
      };            
      
      ebook_entitle.chapter = ebook_chapter;        
      return ebook_entitle;

    }
  // body > table:nth-child(43) > tbody > tr:nth-child(1) > td:nth-child(3) > a
  })
  .then(results => {
    res.send(results);    
  })
})

app.get('/kakaoLogin', function (req, res, err) {
  console.log('login redirect start..');
  console.log('========================')
  console.log(`req.params : ${JSON.stringify(req.query)}`);
  console.log(`req.params : ${JSON.stringify(req.query.error)}`);
  if (req.query.error == null) {
    console.log(req.query.code);
    // ${JSON.stringify(req)}
    console.log(req);

    var access_token;

    var request = require('request');
    var options = {
      url: 'https://kauth.kakao.com/oauth/token',
      form: { 'grant_type': 'authorization_code', 
              'client_id': '4a243bdf6ed7b9e9014e0ce7753e8779', 
              // 'redirect_uri': 'https://my.word-at.fun/kakaoLogin',
              'redirect_uri': 'http://localhost:3000/kakaoLogin',
              'code' : req.query.code
            },
      headers: { 'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'}
    };
    
    console.log(options);

    request.post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        // res.end(body);
        console.log('-----------------------------');      
        // console.log(JSON.parse(body));    
        access_token = JSON.parse(body).access_token;
        console.log(access_token);    
        console.log('-----------------------------');
        
        // res.clearCookie('key');
        res.clearCookie('authorize-access-token');
        res.cookie('authorize-access-token', access_token);   

        res.redirect('/');
        // res.send(body);
        
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);      
      }
    });
  } else {
    console.log('error : ' + req.query.error);
    res.redirect('/');
  }
     
});

app.post('/kakaoLogin/signup', function (req, res, next) {
  var results_msg = [];
  var client_ID = req.body.id
  var client_ID_chg = client_ID.replace('@','$at$').replace('.','$dot$');
  var time = today.format('YYYYMMDD');

  console.log('signup process starts');
  console.log(client_ID);
  
  res.clearCookie('client_ID');  
  res.cookie('client_ID', client_ID);    
  res.clearCookie('client_ID_chg');  
  res.cookie('client_ID_chg', client_ID_chg);    

  var sql = `SELECT * FROM client_list WHERE client_ID = '${client_ID}'`;
  auth_conn.query(sql, function(err, results){
    if (err) console.err("err:" + err);
    console.log('resresult : ' + results);
    console.log('resleng : ' + results.length);
    if (results.length === 0) {
      console.log('새 회원입니다');
      console.log(client_ID_chg);
      var signup_sql = `
        INSERT INTO client_list (client_ID, signup_date, signin_date, signin_num, CONFIG) VALUE ('${client_ID}', '${time}', '${time}', 1, 'dict[1]/tts_def[50]/tts_slow[25]');        
        SELECT * FROM client_list;
      `;      
      var create_database_sql = `
        CREATE DATABASE ${client_ID};        
        SHOW DATABASES;
        CREATE TABLE ${client_ID}.$ff$단어장 LIKE auth.단어장;
        INSERT INTO ${client_ID}.$ff$단어장 SELECT * FROM auth.단어장;
        UPDATE ${client_ID}.$ff$단어장 SET client_ID = '${client_ID}';        
      `;
      // '${req.body.nickname.replace('@','$at$')}'
      auth_conn.query(signup_sql, function(err, results){
        results_msg.push(results);
        root_conn.query(create_database_sql, function(err, results){
          res.clearCookie('wa_config');
          res.cookie('wa_config', 'dict[1]/tts_def[50]/tts_slow[25]');    
          results_msg.push(results);          
          res.json(results_msg);  
        });
      });
    } else {
      console.log('기존 회원입니다');
      var signin_sql = `
        UPDATE client_list SET signin_date = '${time}', signin_num = signin_num + 1 WHERE client_ID = '${client_ID}';
        SELECT * FROM client_list WHERE client_ID = '${client_ID}';
      `;
      auth_conn.query(signin_sql, function(err, results){        
        results_msg.push(results);
        res.clearCookie('wa_config');  
        res.cookie('wa_config', results_msg[0][1][0].CONFIG);          
        console.log(JSON.stringify(results_msg));
        console.log(results_msg[0][1][0].CONFIG);
        res.json(results_msg);              
      });
    }
  })  
});

app.post('/kakaoLogin/unsub', function (req, res, next) {
  var client_ID = req.body.id;
  var sql = `
    DROP DATABASE ${client_ID};
    DELETE FROM auth.client_list WHERE client_ID = '${client_ID}';
  `;
  root_conn.query(sql, function(err, results){    
    res.json(results);      
  });
})


app.post('/config', function (req, res, next) {
  var client_ID = req.body.id;
  var config_cookie = req.body.config;
  var sql = `
    UPDATE auth.client_list SET CONFIG = '${config_cookie}' WHERE client_ID = '${client_ID}';
  `;

  root_conn.query(sql, function(err, results){    
    res.clearCookie('wa_config');  
    res.cookie('wa_config', config_cookie);    
    res.json(results);      
  });
})


// var request_info = require('request');

//       request_info.post(req_client_info, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//           console.log(`infomation : ${JSON.stringify(response)}`);
//         } else {
//           res.status(response.statusCode).end();
//           console.log('error = ' + response.statusCode);
//         }
//       })

// var req_client_info = {
//   url : 'https://kapi.kakao.com/v2/user/me',
//   form: { 'Authorization': `Bearer ${access_token}` },
//   headers: { 'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'}         
// }
// google tts 내부용
/*
app.post('/google_tts', function (req, res) {
  // Imports the Google Cloud client library
  const textToSpeech = require('@google-cloud/text-to-speech');
  

  // Import other required libraries
  const fs = require('fs');
  const util = require('util');
  // Creates a client
  const client = new textToSpeech.TextToSpeechClient();
  async function quickStart() {    
    // The text to synthesize
    const sentence = req.body.sentence;
    console.log(sentence);

    // Construct the request
    const request = {
      input: {text: sentence},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'MP3'},
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    console.log(response.audioContent);
    // res.end(response);
    // res.end();
    let data = response.audioContent;
    let buff = new Buffer(data);
    let ttss = buff.toString('base64');
    console.log(ttss);
    res.json(ttss);
    // Write the binary audio content to a local file

  

    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
  }
  quickStart();
});

*/

        // $bodyList.each(function(i, elem) {          
        //   ulList[i] = {
        //     meaning_eng : $(this).find('div.ddef_d').text().trim(),  
        //     // meaning_eng : $(this).find('div.ddef_d').text().trim(),
        //     meaning_kor : $(this).find('span.trans').text().trim(),
        //     example : [$(this).find('div.examp:nth-child(2) span').text().trim(), $(this).find('div.examp:nth-child(3) span').text().trim()]





        // const $bodyList = $('#page-content > div.pr.entry-body > div.di.english-korean > div > span > div:nth-child(1)').children('div.pos-body').children('div.sense-block');
      // console.log($bodyList.find('div.ddef_d').text());
      // const $bodyList = $("div.entry-body").children("entry-body__el");
      // const $bodyList = $("div.pos-body").children("ul").children("li");      
      // console.log($wordhead.find('h2.headword').text());
      

              // url: 'search.naver.com/search.naver'+$(this).find('div.list_title a').attr('href'),
              // image_url: $(this).find('div.list_thumb a img').attr('src'),
              // image_alt: $(this).find('div.list_thumb a img').attr('alt'),
      

      // console.log(whList);
      
      // $wordhead.each(function(i, elem) {          
        
        // console.log(this.find('h2.headword').length);
        // const $pronounce = $wordhead(`span.us:nth-child(${i+1})`).parent();
        // console.log($pronounce.html());
        
        // whList[i] = {
        //   word : $wordhead.find(`div.di-title h2.headword:nth-child(${i+1}) span`).text(),
        //   part : $wordhead.find(`span.pos:nth-child(${i+1})`).text(),
          // pronounce : $pronounce.find('span.ipa').text(),
          // pronounce_link : $pronounce.find('span.us source').attr('src')
      //   };
      //   console.log(whList);
      // });



    //       meaning_eng : $(this).find('div.ddef_d').text().trim(),  
    //       // meaning_eng : $(this).find('div.ddef_d').text().trim(),
    //       meaning_kor : $(this).find('span.trans').text().trim(),
    //       example : [$(this).find('div.examp:nth-child(2) span').text().trim(), $(this).find('div.examp:nth-child(3) span').text().trim()]

    //         // url: 'search.naver.com/search.naver'+$(this).find('div.list_title a').attr('href'),
    //         // image_url: $(this).find('div.list_thumb a img').attr('src'),
    //         // image_alt: $(this).find('div.list_thumb a img').attr('alt'),
    // };
    // // });     

    //   whList = {
    //     word : $wordhead.find('div.di-title h2.headword span').text(),
    //     part : $wordhead.find('span.pos').text(),
    //     pronounce : $pronounce.find('span.ipa').text(),
    //     pronounce_link : $pronounce.find('span.us source').attr('src')
    //   };

      // console.log($wordhead.find('div.di-title h2.headword span').html());
      // console.log(whList);

      
      

      // console.log(whList);

      // const data = whist

      // const data = ulList;
      // const data = ulList.filter(n => n.title);
 


//


/*
// google TTS api

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
async function quickStart() {
  // The text to synthesize
  const text = 'hello, world!';

  // Construct the request
  const request = {
    input: {text: text},
    // Select the language and SSML voice gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
    // select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent, 'binary');
  console.log('Audio content written to file: output.mp3');
}
quickStart();
*/




// app.listen(3000);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(3000, function() {
//   console.log("Server is running on port " + 3000);
// });





module.exports = app;