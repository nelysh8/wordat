var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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
                console.log('error cartoon s5 : ');                    
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
        
app.post('/paper', function (req, res) {  
  const axios = require("axios");
  const cheerio = require("cheerio");  
  var moment = require('moment');  
  var today = moment().subtract(1, 'days');
  var random_num;
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

  

  async function result() {
    var time_interval = 1.5;
    if ((links.word.title !== '') && (links.quote.quote_text !== '')) {
      console.log('paper s0 : ');
      console.log(links);
      res.send(links);
    } else {
      console.log(links);                    
      await sleep(time_interval);      
      if ((links.word.title !== '') && (links.quote.quote_text !== '')) {
        console.log('paper s1 : ');                    
        console.log(links);
        res.send(links);
      } else {
        await sleep(time_interval);                          
        if ((links.word.title !== '') && (links.quote.quote_text !== '')) {
          console.log('paper s2 : ');                    
          console.log(links);
          res.send(links);
        } else {
          await sleep(time_interval);
          if ((links.word.title !== '') && (links.quote.quote_text !== '')) {
            console.log('paper s3 : ');                    
            console.log(links);
            res.send(links);
          } else {
            await sleep(time_interval);
            if ((links.word.title !== '') && (links.quote.quote_text !== '')) {
              console.log('paper s4 : ');                    
              console.log(links);
              res.send(links);
            } else {
              await sleep(time_interval);
              if ((links.word.title !== '') && (links.quote.quote_text !== '')) {
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


// quote :: https://www.goodreads.com/quotes?page=1
// 

  

    //     whList[i] = {
    //       word : $head.find('div.di-title h2.headword span').text(),
    //       part : $head.find('span.pos').text(),         
    //       pronounce : $head.find('span.us').parent().find('span.ipa').text(),
    //       pronounce_link : $head.find('span.us source').attr('src')
    //     };                

    //     // console.log('hi : ' + $head.find('div.sense-block').length);
        
    //     let j = 0;
    //     ulList = [];

    //     for (let meaningbox of $head.find('div.sense-block')) {
    //       const $meaningline = $head.find(`div.sense-block:nth-child(${j+1})`);          

    //       ulList[j] = {
    //             meaning_eng : $meaningline.find('div.ddef_d').text().trim(),                  
    //             meaning_kor : $meaningline.find('span.trans').text().trim(),
    //             example : [$meaningline.find('div.def-body div.examp:nth-child(2) span').text().trim(), $meaningline.find('div.def-body div.examp:nth-child(3) span').text().trim()]                
    //       };                    
    //       j += 1;        
    //     };  
        
    //     // console.log(ulList);
    //     whList[i].meanings = ulList; 
    //     // console.log('-------------WL-----------------' + whList);
    //     i += 1;
    //   };
    //   // console.log('next : ' + $wordhead.find('div.entry-body__el').html());     
    // const data = whList;    
    // return data;
    // })

//   .then(result => {      
//     // console.log(result);          
//     res.json(result);
//   });
// });




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