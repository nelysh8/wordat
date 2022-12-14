// input detection
const Search_DOC = document.querySelector(".searchbar");
Search_Input = Search_DOC.querySelector("textarea");
console.log(document.getElementById("contents_wordlist").classlist);
Search_Input.addEventListener("keyup", e => {    
    if (e.keyCode === 13 && e.shiftKey && e.target.value){        
      tranbtn_click();
    }
});

// carousel detection

var carousel_wordlist = document.getElementById("contents_wordlist");

var observer = new MutationObserver(mutations => {    
  if ((mutations[0].oldValue.includes('active') === false) && (mutations[0].target.className.includes('active') === true)) {
    console.log('wordlist open');
    wordlist_open();
  } else if ((mutations[0].oldValue.includes('active') === true) && (mutations[0].target.className.includes('active') === false)) {
    console.log('wordlist close');
  } else {
    console.log('nothing');
  };
});

var observer_config = {
  childList: false,	// 하위요소 감지
  attributes: true,	// 속성변경 감지
  characterData: false,	// 데이터변경 감지
  subtree: false,	// 하위요소이하 전부 감지
  attributeOldValue: true,	// 속성변경 전 속성 감지
  characterDataOldValue: false	// 데이터변경 전 데이터 감지
};

// 감지 시작
observer.observe(carousel_wordlist, observer_config);

// 감지 종료
// observer.disconnect();




  
      // global varible
      let Word_title = '';
      let Word_meaning = '';
      let Word_phonetics = '';
      var engs_res = '';

      function dictionaryapi(words){
        var url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + words;        
        fetch(url).then((response)=>response.json()).then((result)=>data(result));        
        function data(result){
          console.log(result);          
          // console.log(result[0].meanings[0].definitions[0].definition);          
          // console.log(result[0].phonetics[0].text);
          document.getElementById('Sres_WORD').innerHTML += `<span class="ft4">${result[0].meanings[0].definitions[0].definition} ${result[0].phonetics[0].text}</span> \n`;                            
          engs_res = `<a href="https://dictionary.cambridge.org/dictionary/english/${words}" target="result_view" title="${words}" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="${result[0].meanings[0].definitions[0].definition}">${words}</a> `;                                                              
          Set_TEXT.innerHTML += engs_res;
          re_popup();                              
          } 
        }                
      
      // map 사용해야 할 듯

// Translate Search Btn Click

function tranbtn_click(){
  if(Search_Input.value.replace(/ /gi,'').replace(/\n/gi,'')) {                        
    var engs_org = Search_Input.value.replace(/\n$/,'');
    var engs_spl = Search_Input.value.replace('\n', ' ___ ').replace(/^\s+|\s+$/g,'').replace('  ',' ').split(' ');          
    console.log(engs_spl);
    engs_res = '';          
    
    var doc = document.getElementById('Sres_ENG');
    doc.innerHTML = '';          
    
    function TEST_add(engs_spl){
      for (let words of engs_spl){            
        if (words === '___') {
          engs_res += `<br>`;
        } else {                                
          // engs_res += `<a href="#" onclick="parent.Cambrg_search('${words}'); ">${words}</a> `;
          engs_res += `<span onclick="Cambrg_search('${words}');">${words}</span> `;
        }              
      }

      doc.innerHTML += engs_res;
      re_popup();             
      // click_fadein(doc);        
      // iframe2_vis();
    }      
    
    TEST_add(engs_spl);
    trans_papago(engs_org);
    document.getElementById('link_yarn').setAttribute('href', encodeURI('https://getyarn.io/yarn-find?text=' + engs_org));
    document.getElementById('link_youglish').setAttribute('href', encodeURI('https://youglish.com/pronounce/' + engs_org + '/english?'));
    document.getElementById('link_google').setAttribute('href', encodeURI('https://www.google.com/search?q="' + engs_org +'"'));
    
    click_fadein(document.getElementById('Sres_view'));          
    iframe2_vis();
  }       
};



// <!-- papago translation -->
    
function trans_papago(SENTC){
  let TEXT = {word : SENTC};        
  let TEXT_JSON = JSON.stringify(TEXT);
  console.log(TEXT);
  console.log(JSON.stringify(TEXT));
  fetch("/translate", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(TEXT)}).then((response)=>response.json()).then((result)=>data(result));                

  function data(result){          
    let B = JSON.stringify(result);          
    var tmp = document.getElementById("Sres_KOR");
    function addtext(){
      tmp.innerText = result.message.result.translatedText;
    }
    addtext();
  }
}
    

//  Google tts 


// 외부용
// api key : AIzaSyD_oAgCmJ_dbiGMxCefQ2m4LUOOQ-xBrpM
//https://texttospeech.googleapis.com/v1/text:synthesize
// 음성 config https://cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize#audioconfig
// 합성 음성 https://cloud.google.com/text-to-speech/docs/create-audio

  function tts(speed){
    
    var sentence = document.getElementById('main_input').value;     
    
    console.log(sentence);  
    
    
    fetch('https://texttospeech.googleapis.com/v1beta1/text:synthesize', {        
        method: 'POST',
        headers: {
            'X-Goog-Api-Key': 'AIzaSyD_oAgCmJ_dbiGMxCefQ2m4LUOOQ-xBrpM',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'input' : {'text' : sentence},
          'voice' : {'languageCode' : 'en-US' , 'name' : 'en-US-Neural2-C', 'ssmlGender' : 'FEMALE'},
          // 'voice' : {'languageCode' : 'en-US' , 'ssmlGender' : 'FEMALE'},
          'audioConfig': {'audioEncoding': 'MP3' },        
        }),
      })
    .then((response)=>response.json())
    .then((result)=>data(result));  
    function data(result){      
      console.log(result);      
      // console.log(JSON.stringify(result.audioContent.data));
      var Sound = new Audio(`data:audio/mp3;base64,${result.audioContent}`);
      Sound.playbackRate = speed;
      Sound.play().then(()=>{        
      // new Audio(`data:audio/mp3;base64,${result.audioContent}`).play().then(()=>{        
        console.log('sound ok');
      })
      .catch(error => {
        console.log('sound err');
      });      
    }
  }




// 내부용

  // function tts(){
  //   // api key : AIzaSyD_oAgCmJ_dbiGMxCefQ2m4LUOOQ-xBrpM
  //   var sentence = {sentence : document.getElementById('main_input').value};    
  //   console.log(sentence);
    // fetch("/google_tts", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(sentence)}).then((response)=>response.json()).then((result)=>data(result));  
  //   function data(result){      
  //     // console.log(result);
      
  //     // console.log(JSON.stringify(result.audioContent.data));
  //     new Audio(`data:audio/mp3;base64,${result}`).play().then(()=>{        
  //       console.log('sound ok');
  //     })
  //     .catch(error => {
  //       console.log('sound err');
  //     });      
  //   }
  // }

//  Cambridge Search 
      
      async function Cambrg_search(word){        
        var word = {word : word};
        await fetch("/websearch_cambrg", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>{
          console.log(response);
          if (response.status === 404) {
            throw new Error('Not Found');
          } else {
            return response.json();
          }
        })
        .then((result)=>data(result))
        .catch((error)=>data2());
        
        function data(result){                    
          result_view_cambrg(result);
        }
        function data2(){
          console.log('Cambridge err');          
        }
      }      


  // 상단 프레임 내용변경

      function result_view_cambrg(data){                     
        var doc = document.getElementById('contents_cambrg');                
        var topbody = `
        <div class="navline">
            <a href="https://dictionary.cambridge.org/dictionary/english-korean/" target="_blank"><img src="/images/cambrg_logo.png"></a>
            <input type="text" class="nav_input" placeholder="Search a word" required inputmode="search"></input>
        </div>
        <div id="contents" class="contents">`;

        var wordhead = '';
        var meanings = '';
        
        let i = 0;
        
        for (let head of data) {
          wordhead += `<div id="wordhead" class="wordhead"> 
            <div class="word">
                <span id="word"> ${head.word} </span>
            </div>  
            <div class="etc">
                <span id="pronounce" class="pronounce"> [${head.pronounce}] </span> <br>
                <span id="part" class="part">${head.part}</span>
            </div>
            <div class="pronounce_sound"> 
                <span class="sound"><a href="#" id="sound" onclick="audio_pron${i}.load(); audio_pron${i}.play();"><i class="fa-solid fa-volume-high ft5"></i></a></span>        
                <audio preload="none" id="audio_pron${i}" controlslist="nodownload">
                    <source id="audio_link" type="audio/mpeg" src="https://dictionary.cambridge.org${head.pronounce_link}">            
                </audio>
            </div>
          </div>`;
            
            for (let meaning of head.meanings) {          
              wordhead += `<div id="meaning_list" class="meaning_list">
                <div class="line"> </div>
                  <div class="meaning">
                    <span class="meaning_eng">${meaning.meaning_eng}</span><br>
                    <span class="meaning_kor">${meaning.meaning_kor}</span>`;
                    
              meaning.example = meaning.example.filter(Boolean);
              console.log(meaning, meaning.example.length);
            
              if ( meaning.example.length > 0 ) {
                wordhead += `<div class="examples">
                        <ul>`;
                for (let example of meaning.example) {            
                  console.log(example);
                  wordhead += `<li>${example}</li>`;
                };
                wordhead += `</ul> </div> </div>`;
              } else {
                wordhead += `</div>`;
              }
              wordhead += `</div>`;
            }
          i += 1;               
        }       
        
        doc.innerHTML = topbody + wordhead + `</div>`;
        let script = document.createElement('script');
        script.src='/javascripts/cambrg.js';
        document.body.appendChild(script);
        document.getElementById("carousel_btn2").click();
        
      }    

// 단어장 부분

// wordbook list 받아오기

function wordbook_list_post(){        
  fetch("/wordlist", {method : 'post'}).then((response)=>response.json()).then((results)=>add_result(results))
}

function add_result(datas){
  let add_html = `<div class="wordbook_headline">
      <i class="fa-solid fa-snowflake ft7 ftb text_white"></i><span class="ft6 ftb text_white"> Wordlist </span><i class="fa-solid fa-snowflake ft7 ftb text_white"></i>                                
      </div>
      <div class="contents">
  <div id="wordbook_list" class="wordbook_list ">`;
  for (let data of datas){
    console.log(data.Tables_in_oq4p2dxa5zpnk9gu);
    add_html += `<div class="wordbook_wrap shadow-sm">
                    <div class="wordbook_text">                    
                      <div id="wordbook_name" class="wordbook_name ft8 ftb text_purple"> <span>${data.Tables_in_oq4p2dxa5zpnk9gu}</span></div>
                      <div id="wordbook_hashtag" class="wordbook_hashtag ft10 text_gray"> <span>#오늘도즐거워 #람쥐귀여워 </span></div>                                        
                    </div>
                    <div class="wordbook_option"><i class="fa-solid fa-pen ft7 ftb text_green" onclick="wordbook_list_post();"></i></div>
                    <div class="wordbook_option"><i class="fa-solid fa-trash-can ft7 ftb text_red"></i></div>                      
                  </div>                  
                </div>`;
  }
  add_html += '</div';
  var doc = document.getElementById("contents_wordbook");
  doc.innerHTML = add_html;
}
    
    

    

  

  
  // then((response)=>response.json()).then((result)=>data(result));
  
    
    // const tmp = document.getElementById("test_place");          
    // function addtext(){
    //   tmp.innerText += `\n제목${i}`;
    //   var engs = result[i].ENG.split(' ');
    //   tmp.innerText += `\n${result[i].ENG}`;
    //   tmp.innerText += `\n${engs}`;
    //   tmp.innerText += `\n${engs.length}`;
    //   for (let words of engs) {
    //     tmp.innerText += `\n${words}`;
    //   }
    //   tmp.innerText += `\n${result[i++].KOR}`; 
  
    // addtext();




function wordlist_open(){
  wordbook_list_post();
}

  

  

  // 



// <!-- popover -->
    

      var popover = new bootstrap.Popover(element, {
        popperConfig: function (defaultBsPopperConfig) {
          var newPopperConfig = {html	: true}
          // use defaultBsPopperConfig if needed...
          // return newPopperConfig
        }
      })

      var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
      var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
      })

      function re_popup(){
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
        })
      }

      