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

var wordlistRouter = require('./routes/wordlist');
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

app.use('/wordlist', wordlistRouter);
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
  var query = req.body.word;  

  console.log(query);

  var request = require('request');
  var options = {
    url: api_url,
    form: {'source':'en', 'target':'ko', 'text':query},
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