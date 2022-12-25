// const { json } = require("express");

// const { text } = require("express");

// const { filter } = require("domutils");



// DOM basic
const mainbox_center = document.getElementById('mainbox_center');
// 1box : wordbook, 2box : wordlist, 3box : word //
const second_1box_center = document.getElementById('second_1box_center'); 
const second_1box_contents = document.getElementById('second_1box_contents');
const second_2box_center = document.getElementById('second_2box_center');
const second_2box_contents = document.getElementById('second_2box_contents');
const second_3box_center = document.getElementById('second_3box_center');

// Setting
const selected_wordbook = '';

// input detection
const Search_DOC = document.querySelector(".searchbar");
Search_Input = Search_DOC.querySelector("textarea");
const word_toolbar_doc = document.querySelector('.word_toolbar');
word_toolbar_input = word_toolbar_doc.querySelector('textarea');

Search_Input.addEventListener("keyup", e => {    
    if (e.keyCode === 13 && e.shiftKey && e.target.value){        
      tranbtn_click('mainbox_center');
    }
});

word_toolbar_input.addEventListener("keyup", e => {    
  if (e.keyCode === 13 && e.shiftKey && e.target.value){        
    tranbtn_click('second_3box_center');
  }
});

window.onload=testquiz();


// function youtube(){
//   var iframe = document.getElementById('youtube');
//   console.log(iframe.contentWindow.document.body.innerHTML);
// }

// iframe.contentWindow.addEventListener('onclick', handler);
 

// getElementById('ytp-caption-window-container')

// carousel detection

var carousel_contents = document.getElementById("carousel_contents");

var observer = new MutationObserver(mutations => {    
  if ((mutations[0].oldValue.includes('active') === false) && (mutations[0].target.className.includes('active') === true)) {
    alert('mutation obs detected');
    // wordlist_open();
  } else if ((mutations[0].oldValue.includes('active') === true) && (mutations[0].target.className.includes('active') === false)) {
    alert('mutation obs detected');
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
observer.observe(carousel_contents, observer_config);

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

function tranbtn_click(position){  
  console.log('tranbtn_click start at ' + position);
  var req_pos = position;
  var doc_eng, doc_kor;  
  // var Input_target = '';
  var view_target = '';
  var engs_org, engs_spl, engs_res;

  let kor_check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  if (req_pos === 'mainbox_center') {
    doc_eng = document.getElementById('Sres_ENG');
    doc_kor = document.getElementById('Sres_KOR');
    Input_target = document.getElementById('main_search_input');
    view_target = document.getElementById('Sres_view');
  } else if (req_pos === 'second_3box_center') {
    doc_eng = document.getElementById('wtrv_ENG');
    doc_kor = document.getElementById('wtrv_KOR');
    Input_target = document.getElementById('word_toolbar_input');
    view_target = document.getElementById('word_toolbar_result');
  }

  doc_eng.innerHTML = '';
  doc_kor.innerHTML = '';

  console.log(Input_target.value);
  
  if (kor_check.test(Input_target.value)) {      // 한글입력의 경우 -> 한글 : 그대로 / 영어 : 번역후 처리
    trans_papago(req_pos, Input_target.value);
    doc_kor.innerHTML = `<span> ${Input_target.value} </span>`;  
  } else if(Input_target.value.replace(/ /gi,'').replace(/\n/gi,'')) {    //영어입력의 경우 
    if (req_pos === 'mainbox_center'){  // 메인박스 -> 영어 : 그대로 처리 / 한글 : 번역              
      engs_org = Input_target.value.replace(/\n$/,'');
      engs_spl = Input_target.value.replace('\n', ' ___ ').replace(/^\s+|\s+$/g,'').replace('  ',' ').split(' ');              
      engs_res = '';
      function TEST_add(engs_spl){
        for (let words of engs_spl){            
          if (words === '___') {
            engs_res += `<br>`;
          } else {                                
            words_encode = encodeURIComponent(words).replace(/'/g, '%27');    
            engs_res += `<span onclick="touch_block_action(this); Cambrg_search('${words_encode}');">${words}</span> `;
          }              
        }
        doc_eng.innerHTML += engs_res;
        re_popup();             
      }
      TEST_add(engs_spl);    
      trans_papago(req_pos,engs_org);         
    } else if (req_pos === 'second_3box_center') { //  S3박스 -> 영어 : 그대로 / 한글 : 번역
      engs_org = Input_target.value;
      trans_papago(req_pos,engs_org);   
      doc_eng.innerHTML = `<span> ${Input_target.value} </span>`;   
    }
  }
  click_fadein(view_target);
}


// <!-- papago translation -->
    
function trans_papago(position, SENTC){  
  console.log('trans_papago start at ' + position);
  var req_pos = position;
  var patch_target;
  var write_target, write_target_id;
  var link_yarn, link_youglish, link_google = '';
  var url_yarn, url_youglish, url_google = '';
  var engs_org, engs_spl, engs_res;
  let kor_check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  let TEXT = '';

  if (req_pos === 'mainbox_center') {    // 메인박스 -> 
    view_target = document.getElementById('Sres_view');
    link_yarn = document.getElementById('msi_link_yarn');
    link_youglish = document.getElementById('msi_link_youglish');
    link_google = document.getElementById('msi_link_google');    
    if (kor_check.test(SENTC)) {
      TEXT = {'source' : 'ko', 'target' : 'en', 'word' : SENTC};
      patch_target = document.getElementById('Sres_KOR');
      write_target = document.getElementById('Sres_ENG');                   
      write_target_id = 'ENG';
    } else {      
      TEXT = {'source' : 'en', 'target' : 'ko', 'word' : SENTC};            
      patch_target = document.getElementById('Sres_ENG')
      write_target = document.getElementById('Sres_KOR');                   
      write_target_id = 'KOR';
    };
    fetch("/translate", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(TEXT)}).then((response)=>response.json()).then((result)=>{           
      if (write_target_id === 'ENG') { // 한글입력의 경우 -> 한글: 기처리 / 영어 : 번역 후 처리
        engs_org = result.message.result.translatedText; 
        console.log('============' + result.message.result.translatedText);
        engs_spl = engs_org.replace('\n', ' ___ ').replace(/^\s+|\s+$/g,'').replace('  ',' ').split(' ');
        engs_res = '';    
    
        function TEST_add(engs_spl){
          for (let words of engs_spl){               
            if (words === '___') {
              engs_res += `<br>`;
            } else {           
              words_encode = encodeURIComponent(words).replace(/'/g, '%27');      
              engs_res += `<span onclick="touch_block_action(this); Cambrg_search('${words_encode}');">${words}</span> `;
            }                             
          }
          write_target.innerHTML += engs_res;          
          re_popup();               
        }            
        TEST_add(engs_spl);        
        
        // engs_org = engs_org.replace(/'/g, '%27');
      } else if (write_target_id === 'KOR') {     // 영어입력의 경우 -> 영어 : 기처리 / 한글 : 번역           
        write_target.innerText = result.message.result.translatedText; 
        engs_org = patch_target.innerText;
        // engs_org = engs_org.replace(/'/g, '%27');
      }
      url_yarn = 'https://getyarn.io/yarn-find?text=' + encodeURIComponent(engs_org).replace(/'/g, '%27');      
      url_youglish = 'https://youglish.com/pronounce/' + encodeURIComponent(engs_org).replace(/'/g, '%27') + '/english?';
      url_google = 'https://www.google.com/search?q="' + encodeURIComponent(engs_org).replace(/'/g, '%27') +'"';

      console.log(encodeURIComponent(engs_org), encodeURIComponent(engs_org).replace(/'/g, '%27'));
      console.log(engs_org);
      console.log(url_yarn);

      link_yarn.setAttribute('href', `${url_yarn}`);      
      link_youglish.setAttribute('href', `${url_youglish}`);
      link_google.setAttribute('href', `${url_google}`);
    });
  }
  else if (req_pos === 'second_3box_center') {    // S3 박스 ->
    view_target = document.getElementById('word_toolbar_result'); 
    link_yarn = document.getElementById('word_toolbar_link_yarn');
    link_youglish = document.getElementById('word_toolbar_link_youglish');
    link_google = document.getElementById('word_toolbar_link_google');   
    if (kor_check.test(SENTC)) {
      TEXT = {'source' : 'ko', 'target' : 'en', 'word' : SENTC};
      patch_target = document.getElementById('wtrv_KOR');
      write_target = document.getElementById('wtrv_ENG');
      write_target_id = 'ENG';
    } else {
      TEXT = {'source' : 'en', 'target' : 'ko', 'word' : SENTC};            
      patch_target = document.getElementById('wtrv_ENG')
      write_target = document.getElementById('wtrv_KOR');                   
      write_target_id = 'KOR';      
    };
    console.log(TEXT);
    fetch("/translate", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(TEXT)}).then((response)=>response.json()).then((result)=>{    
      if (write_target_id === 'ENG') { // 한글입력의 경우 -> 한글 : 기처리 / 영어 : 번역
        write_target.innerText = result.message.result.translatedText; 
        engs_org = write_target.innerText;
        // engs_org = engs_org.replace(/'/g, '%27');
      } else if (write_target_id === 'KOR') { // 영어입력의 경우 -> 영어 : 기처리 / 한글 : 번역
        write_target.innerText = result.message.result.translatedText; 
        engs_org = patch_target.innerText;
        engs_org = engs_org.replace(/\n$/,'');
        // engs_org = engs_org.replace(/'/g, '%27');
      }  
      url_yarn = 'https://getyarn.io/yarn-find?text=' + encodeURIComponent(engs_org).replace(/'/g, '%27');      
      url_youglish = 'https://youglish.com/pronounce/' + encodeURIComponent(engs_org).replace(/'/g, '%27') + '/english?';
      url_google = 'https://www.google.com/search?q="' + encodeURIComponent(engs_org).replace(/'/g, '%27') +'"';

      console.log(engs_org);
      console.log(url_yarn);

      link_yarn.setAttribute('href', `${url_yarn}`);      
      link_youglish.setAttribute('href', `${url_youglish}`);
      link_google.setAttribute('href', `${url_google}`);
    });    
  }  
}
    

//  Google tts 


// 외부용
// api key : AIzaSyD_oAgCmJ_dbiGMxCefQ2m4LUOOQ-xBrpM
//https://texttospeech.googleapis.com/v1/text:synthesize
// 음성 config https://cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize#audioconfig
// 합성 음성 https://cloud.google.com/text-to-speech/docs/create-audio

  function tts_pos(position, speed){    
    let req_pos = position;
    let input_value, res_value;
    let sentence;
    let kor_check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;  
    
    if (req_pos === 'mainbox_center') {      
      input_value = document.getElementById('main_search_input').value;
      det_value = input_value.replace(/ /gi,'').replace(/\n/gi,'');
      res_value = document.getElementById('Sres_ENG').innerText;      
    } else if (req_pos === 'second_3box_center') {
      input_value = document.getElementById('word_toolbar_input').value;
      det_value = input_value.replace(/ /gi,'').replace(/\n/gi,'');
      res_value = document.getElementById('wtrv_ENG').innerText;
    }
    // input_value 확인(빈칸 or 한국 => res_value / ! input_value )
    if ((det_value === '') || (kor_check.test(input_value))) {
      if (res_value !== '') {
        sentence = res_value;
      } else {
        return;
      }
    } else {
      sentence = input_value;
    }      

    let rate = speed;               

    console.log('------------tts detected------------------');
    console.log('sentence : ' + sentence);
    
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

  function tts_any(text, rate){
    let sentence = text;
    let speed = rate;          
    
    console.log('------------tts detected------------------');
    console.log('sentence : ' + sentence);
    
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
            
              if ( meaning.example !== null ) {
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

// main box modal

function modal1_openbtn_click(position) {
  console.log('modal1_openbtn_click start');
  var req_pos = position;  
  var wim_title = document.getElementById('wim_title');
  var dropdown_list = '';
  var dropdown_menu = document.getElementById("wim_dropdown_wordbook");
  var dropdown_button = document.getElementById("wim_dropdown_btn");  
  var selected_wordbook = dropdown_button.innerText;  
  var pre_selected_wordbook = document.getElementById("pre_selected_wordbook").innerText;
  
  var word_id = '';

  if (req_pos === 'mainbox_center') {
    console.log('mainbox modal1 starting');
    wim_title.innerText = 'Add words to the wordbook';                
    document.getElementById("wim_sumbit_btn").setAttribute('onclick', "wim_submit_btn_click('mainbox_center')");
    document.getElementById("toggle_row").style.display = 'block';    

    document.getElementById("wim_input_eng").value = document.getElementById('Sres_ENG').innerText;
    document.getElementById("wim_input_kor").value = document.getElementById('Sres_KOR').innerText;    
      
    fetch("/wordbook", {method : 'post'}).then((response)=>response.json()).then((results)=>{              
      console.log('dropdown creating');
      
      for (let result of results){
        dropdown_list += `<li><a class="dropdown-item" href="#" onclick="dropdown_wordbooklist_click(this)">${result.Tables_in_oq4p2dxa5zpnk9gu}</a></li>`;
      };
      dropdown_menu.innerHTML = dropdown_list;   
      console.log(results.length, selected_wordbook);
      if ((selected_wordbook === '') && (results.length === 0)) {        
        dropdown_button.innerText = 'create' ;
        // selected_wordbook !!!!!! 워드북 만드는 화면으로
      } else if ((selected_wordbook === '') && (results.length === 1)) {
        dropdown_button.innerText = results[0].Tables_in_oq4p2dxa5zpnk9gu;
      } else if ((selected_wordbook === '') && (results.length > 0) && (pre_selected_wordbook !== '') && (results.includes(pre_selected_wordbook))){              
        dropdown_button.innerText = pre_selected_wordbook;      
      } 
    });      
  } 
  else if (req_pos === 'second_2box_center'){
    console.log('second_2box modal1 starting');
    wim_title.innerText = 'Add words to the wordbook';    
    selected_wordbook = document.getElementById('s2_wordbook_title').innerText;
    console.log(selected_wordbook);
    document.getElementById("wim_sumbit_btn").setAttribute('onclick', "wim_submit_btn_click('second_2box_center');"); 
    document.getElementById("toggle_row").style.display = 'block';

    fetch("/wordbook", {method : 'post'}).then((response)=>response.json()).then((results)=>{              
      console.log('dropdown creating');
      console.log(results);
      i=0;
      j=0;
      for (let result of results){
        dropdown_list += `<li><a class="dropdown-item" href="#" onclick="dropdown_wordbooklist_click(this)">${result.Tables_in_oq4p2dxa5zpnk9gu}</a></li>`;
        if (selected_wordbook === result.Tables_in_oq4p2dxa5zpnk9gu) { i+=1;};
        if (pre_selected_wordbook === result.Tables_in_oq4p2dxa5zpnk9gu) {j+=1;};
      };
      dropdown_menu.innerHTML = dropdown_list;         
      
      if ((selected_wordbook !== '') && (i > 0)) {
        console.log('this?');
        dropdown_button.innerText = selected_wordbook;          
      } else if ((selected_wordbook === '') && (results.length === 1)) {
        dropdown_button.innerText = results[0].Tables_in_oq4p2dxa5zpnk9gu;
      } else if ((pre_selected_wordbook !== '') && (results.length > 0) && (j>0)) {
        dropdown_button.innerText = pre_selected_wordbook;      
      };
    });
  } 
  
  else if (req_pos === 'second_3box_center'){
    console.log('second_3box modal1 starting');
    wim_title.innerText = 'Add examples to the word';
    selected_wordbook = document.getElementById('s2_wordbook_title').innerText;
    word_id = document.getElementById('s3_word_id').innerText;
    document.getElementById("wim_sumbit_btn").setAttribute('onclick', "wim_submit_btn_click('second_3box_center');")

    document.getElementById("wim_input_eng").value = document.getElementById('wtrv_ENG').innerText;
    document.getElementById("wim_input_kor").value = document.getElementById('wtrv_KOR').innerText;    
    
    document.getElementById("toggle_row").style.display = 'none';
  }
}

function dropdown_wordbooklist_click(obj){
  console.log('dropdown_wordbooklist_click start');
  var dropdown_button = document.getElementById("wim_dropdown_btn");
  var pre_selected_wordbook = document.getElementById("pre_selected_wordbook").innerText;
  // var form_add_word = document.getElementById("form_add_word");
  dropdown_button.innerText = obj.innerText;
  pre_selected_wordbook = obj.innerText;
  // selected_wordbook = obj.innerText;
  // form_add_word.setAttribute('action', `/word_manage/add/${dropdown_button.innerText}`);    
}

function wim_submit_btn_click(position){  
  console.log('wim_submit_btn_click start : position : ' + position);
  var req_pos = position;  
  if (req_pos === 'mainbox_center'){
    console.log(req_pos + ': wim_submit_btn_click start');
    var word = {
      'wordbook_title' : document.getElementById('wim_dropdown_btn').innerText, 
      'eng' : document.getElementById('wim_input_eng').value, 
      'kor' : document.getElementById('wim_input_kor').value
    };
    fetch("/wordbook/word/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
      console.log(results);        
    });
  } else if (req_pos === 'second_2box_center'){
    console.log(req_pos + 'wim_submit_btn_click start');
    var word = {
      'wordbook_title' : document.getElementById('wim_dropdown_btn').innerText, 
      'eng' : document.getElementById('wim_input_eng').value, 
      'kor' : document.getElementById('wim_input_kor').value
    };
    fetch("/wordbook/word/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
      console.log(results);        
    });
    wordlist_reading('',word.wordbook_title,'');
  } else if (req_pos === 'second_3box_center'){
    console.log(req_pos + 'wim_submit_btn_click start');
    let exam_eng = document.getElementById('wim_input_eng').value.replace(/'/gi, "''"); //mysql에서 문자 안의 '는 ''로 찍어줘야 함
    console.log(exam_eng);

    var word = {
      'wordbook_title' : document.getElementById('s2_wordbook_title').innerText,
      'word_id' : document.getElementById('s3_word_id').innerText,
      'exam_eng' : exam_eng, 
      'exam_kor' : document.getElementById('wim_input_kor').value
    };
    console.log(word);
    fetch("/wordbook/exam/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
      console.log(results);        
    });
    word_reading(document.getElementById('s3_word_id').innerText,'');  
  }
}



// second box 
  
  // wordbook - 1box

    // open / close

function wordbook_open(){      
  // await click_fadeoutdown(mainbox_center);    
  if (second_1box_center.style.display !== 'none') {
    click_bouncein(second_1box_center);
  } else {
    click_bounceinup(second_1box_center);  
  }  
}

function wordbook_close(){    
  click_bounceoutdown(second_1box_center); 
  if (second_2box_center.style.display !== 'none') {
    click_bounceoutdown(second_2box_center);
  }           
  if (second_3box_center.style.display !== 'none') {
    click_bounceoutdown(second_3box_center);
  }           
}

    // read

function wordbook_reading(time){        
  fetch("/wordbook", {method : 'post'}).then((response)=>response.json()).then((results)=>add_result(results));
  function add_result(datas){
    let add_html = '';
    let i = 0;
    for (let data of datas){
      console.log(data.Tables_in_oq4p2dxa5zpnk9gu);
      add_html += `<div class="wordbook_wrap shadow-sm">
                      <div class="wordbook_text" onclick="touch_block_action(document.getElementById('wordbook_title_span_${i}')); wordlist_reading(${i},'','initial');">                                          
                        <div id="wordbook_title_${i}" class="wordbook_title ft8 ftb animate__animated"><span id="wordbook_title_span_${i}" name="wordbook_title">${data.Tables_in_oq4p2dxa5zpnk9gu}</span></div>                        
                        <div id="wordbook_hashtag" class="wordbook_hashtag ft10 text_gray"> <span>#오늘도즐거워 #람쥐귀여워 </span></div>                                                              
                      </div>                      
                      <div class="wordbook_option">
                        <i class="fa-solid fa-pen ft7 ftb text_green" data-bs-toggle="modal" data-bs-target="#wordbook_${i}_edit_modal"></i>                         
                        <div id="wordbook_${i}_edit_modal" class="modal fade" role="dialog">
                          <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                              <div class="modal-header">                
                                <span class="ft5 ftbb">Edit wordbook</span>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                <div class="modal-body">                                          
                                  <div class="input-group mb-3">
                                    <span class="input-group-text ft8 ftb bg_cornsilk text_red" id="basic-addon1" > TITLE </span>
                                    <input type="text" name="edit_wordbook_title" id="edit_wordbook_title_${i}" class="form-control ft8" placeholder="Input a Wordbook Title" value="${data.Tables_in_oq4p2dxa5zpnk9gu}">                                
                                  </div>                                      
                                  <div class="modal-footer">                        
                                    <button type="submit" class="btn bg_firebrick bg-gradient text_cornsilk ft8 ftbb" data-bs-dismiss="modal" onclick="edit_wordbook_click(${i});"> CONFIRM </button>
                                    <button type="button" class="btn btn-secondary bg-gradient ft8 ftbb" data-bs-dismiss="modal"> CLOSE </button>                        
                                  </div>                    
                                </div>                
                              </div>
                            </div> 
                          </div>
                        </div>                                                                                                         
                      </div>
                      <div class="wordbook_option">
                        <i class="fa-solid fa-trash-can ft7 ftb text_red" data-bs-toggle="modal" data-bs-target="#wb_remove_confirm"> </i>
                        <div class="modal fade" id="wb_remove_confirm" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">                              
                              <div class="modal-body">
                                정말 삭제하시겠습니까?
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-primary" onclick="remove_wordbook_click(${i});">CONFIRM</button>
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>                                
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>                      
                    </div>                  
                  </div>`;                  
      i += 1;
    };
    
    var doc = document.getElementById("wordbook_list");
    doc.innerHTML = add_html;    
  }
  if (time === 'initial'){
    wordbook_open();
  }
}

    // functions

async function add_wordbook_click(){
  var wordbook_title = {title : document.getElementById('add_wordbook_title').value};
  console.log(wordbook_title);
  await fetch("/wordbook/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
    console.log(results);        
  })
  wordbook_reading('');  
}

async function remove_wordbook_click(number){
  console.log('remove wordbook detected');
  let wordbook_title = {title : document.getElementById(`wordbook_title_${number}`).innerText};
  await fetch("/wordbook/remove", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
    console.log(results);
  })
  wordbook_reading('');
}

async function edit_wordbook_click(number){
  console.log('edit wordbook detected');
  let wordbook_title = {oldtitle : document.getElementById(`wordbook_title_${number}`).innerText, newtitle : document.getElementById(`edit_wordbook_title_${number}`).value};
  console.log(wordbook_title);
  await fetch("/wordbook/edit", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
    console.log(results);
  })
  wordbook_reading('');
}

  // Wordlist - 2box

    // open, close 

function wordlist_open(){    
  if (second_2box_center.style.display !== 'none') {
    click_bouncein(second_2box_center);
  } else {
    click_bounceinup(second_2box_center);  
  }    
}

function wordlist_close(){
  // click_fadein(second_1box_contents);
  wordbook_reading('');
  click_bounceoutdown(second_2box_center); 
  if (second_3box_center.style.display !== 'none') {
    click_bounceoutdown(second_3box_center);
  }    
}

    // read

function wordlist_reading(number, title, time){    
  // second_1box_center.style.position = 'relative';
  // second_2box_center.style.position ='absolute';  
  console.log('wordlist_reading start');
  console.log('elements : ' + number, title);
  let wordbook_title = '';
  if (number === '') {
    wordbook_title = {title : title};
  } else {
    wordbook_title = {title : document.getElementById(`wordbook_title_${number}`).innerText};
  }  
  fetch("/wordbook/wordlist", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
    console.log(results);
    let add_head_html = '';
    let add_contents_html = '';    
    add_head_html = `
        <div class="title" id="s2_wordbook_title" onclick="s2_box_click();"><span class="ft5 ftb"> ${wordbook_title.title} </span></div>
        `;
      document.getElementById('wordlist_headline').innerHTML = add_head_html;                  

    for (let result of results) {
      examples = JSON.parse(result.EXAMPLE);
      console.log('1111');
      console.log(examples);      
      add_contents_html += `
      <div class="wordlist_wrap shadow-sm">
        <div class="wordlist_main">
          <div class="wordlist_text animate__animated wordlist_id_${result.ID}" onclick="touch_block_action(document.getElementById('wordlist_eng_${result.ID}')); word_reading(${result.ID},'initial');">                    
            <div id="wordlist_eng_${result.ID}" class="wordlist_eng ft8 ftb"> <span> ${result.ENG} </span></div>
            <div id="wordlist_kor_${result.ID}" class="wordlist_kor ft8 ftb"> <span> ${result.KOR} </span></div>
          </div>        
          <div class="wordlist_option animate__animated" data-bs-toggle="collapse" data-bs-target="#wordlist_example_${result.ID}" aria-expanded="false" aria-controls="wordlist_example_${result.ID}" onclick="touch_icon_action(this);">
            <i class="fa-solid fa-list-check ft7 ftb text_red collapse_btn"></i>
          </div>
        </div>`;
      if (examples !== null) {
        j = 0;
        add_contents_html += `
          <div class="wordlist_second">
            <div class="collapse wordlist_example ft10" id="wordlist_example_${result.ID}">                  
              <ul>`;
        for (example of examples) {          
          add_contents_html += `<li id="wordlist_${result.ID}_example_${j}">${example.ENG}<br>${example.KOR}</li>`;
          j +=1 ;
        }
        add_contents_html += `</ul>
              </div>        
            </div>
          </div>`;
      };      
    add_contents_html += `</div>
        </div>`;
    };
    document.getElementById('wordlist_list').innerHTML = add_contents_html;
    if (time === 'initial') {
      wordlist_open();
    }
  });
}    

    // functions

// function add_word(){
//   var word = {title : document.getElementById('s2_wordbook_title').innerText, eng : document.getElementById('add_word_eng').value, kor : document.getElementById('add_word_kor').value};
//   console.log(word);
//   fetch("/wordbook/word/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
//     console.log(results); 
//     wordlist_reading('',word.title);       
//   });  
// }

  // word - 3box

    // open, close

function word_open(){
  console.log('word_open start');  
  if (second_3box_center.style.display !== 'none') {
    click_bouncein(second_3box_center);
  } else {
    click_bounceinup(second_3box_center);  
  }   
}

function word_close(){
  // click_fadein(second_2box_contents);
  wordlist_reading('', document.getElementById('s2_wordbook_title').innerText,'');
  click_bounceoutdown(second_3box_center); 
}


    // reading

function word_reading(ID_number, time){  
  console.log('word_reading start');
  second_2box_center.scrollTop = 0;
  let wordbook_title = document.getElementById('s2_wordbook_title').innerText;
  let word_id = ID_number;
  console.log('elements : ' + wordbook_title, word_id);
  
  let word = {'wordbook_title' : wordbook_title, 'word_id' : word_id};
  
  fetch("/wordbook/word", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
    console.log('result :: ////');
    console.log(results);
    console.log(results[0].EXAMPLE);
    
    // 문장타이틀부분 #word_view1
    let word_title_html = `
      <ul>
        <li><span id="s3_word_id" style="display :none;">${results[0].ID}</span><span class="ft7 ftb" id="word_title_eng" onclick="touch_block_action(this); tts_any(this.innerText, 1);"> ${results[0].ENG} </span></li>
        <li>
          <span class="ft7 ftb">${results[0].KOR}</span>
          <div class="animate__animated word_title_collase_icon" onclick="touch_icon_action(this);" data-bs-toggle="collapse" data-bs-target="#word_view_collapse" aria-expanded="false" aria-controls="word_view_collapse"><i class="fa-solid fa-list-check ft7 ftb text_red"></i></div>          
        </li>
      </ul>`;
    // 예문부분 #example_list    
    let example_html = ``;
    let j = 0;
    if (results[0].EXAMPLE !== null) {
      let examples = JSON.parse(results[0].EXAMPLE);            
      for (example of examples){       
        example_html += `
          <li id="wordbtn_example_${j}" onclick="touch_block_action(document.getElementById('wordbtn_example_${j}_eng')); tts_any(document.getElementById('wordbtn_example_${j}_eng').innerText, 1);">
            <span id="wordbtn_example_${j}_eng" class="animate__animated"> ${example.ENG} </span>
            <br>
            <span>${example.KOR}</span>
          </li>`;    
        j += 1;    
      }
    };
    
    document.getElementById('word_view1').innerHTML = word_title_html;
    document.getElementById('example_list').innerHTML = example_html; 
    if (results[0].EXAMPLE !== null){
      document.getElementById('word_view1').click();
    }        
  });
  if (time === 'initial') {
    word_open();
  }
};

function s1_box_click(){
  hidden(second_2box_center);
  hidden(second_3box_center);
}

function s2_box_click(){
  hidden(second_3box_center);
}






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

  
// tools

function popup_tool(position){
  var req_pos = position;
  var target_div;

  if (req_pos==='second_1box_center'){
    target_div = document.getElementById('s1_popup_tool');
    (async function(){
      await click_rotateout(target_div);
      target_div.innerHTML = `
      <div class="popup_icon_top animate__animated">
        <i class="fa-solid fa-file-circle-plus ft3 ftbb text_green animate__animated" data-bs-toggle="modal" data-bs-target="#wordbook_add_modal" onclick="click_bounce(this);"></i>                              
      </div>         
      <div class="popup_icon_bottom animate__animated">
        <i class="fa-solid fa-arrow-rotate-left ft3 ftbb text_red animate__animated" onclick="click_bounce(this); wordbook_close();"></i>
      </div>  
    `;
    click_bouncein(target_div);
    })();
  } else if (req_pos==='second_2box_center'){
    target_div = document.getElementById('s2_popup_tool');
    (async function(){
      await click_rotateout(target_div);
      target_div.innerHTML = `
        <div class="popup_icon_top animate__animated">
          <i class="fa-solid fa-file-circle-plus ft3 ftbb text_green animate__animated" data-bs-toggle="modal" data-bs-target="#word_input_modal" onclick="click_bounce(this); modal1_openbtn_click('second_2box_center'); click_bounce(this);"></i>                              
        </div>         
        <div class="popup_icon_bottom animate__animated">
          <i class="fa-solid fa-arrow-rotate-left ft3 ftbb text_red animate__animated" onclick="click_bounce(this); wordlist_close();"></i>
        </div> 
      `;
    click_bouncein(target_div);
    })();
  } else if (req_pos==='second_3box_center'){
    target_div = document.getElementById('s3_popup_tool');
    (async function(){
      await click_rotateout(target_div);
      target_div.innerHTML = `
      <div class="popup_icon_top animate__animated">
        <i class="fa-solid fa-file-circle-plus ft3 ftbb text_green animate__animated" data-bs-toggle="modal" data-bs-target="#word_input_modal" onclick="modal1_openbtn_click('second_3box_center'); click_bounce(this);"></i>                              
      </div>         
      <div class="popup_icon_bottom animate__animated">
        <i class="fa-solid fa-arrow-rotate-left ft3 ftbb text_red animate__animated" onclick="click_bounce(this); word_close();"></i>
      </div>
      `;
    click_bouncein(target_div);
    })();
  }
}



function testquiz(){
  var write_kor = document.getElementById('ts_quiz_kor');
  var write_eng = document.getElementById('ts_quiz_eng');
  var eng_parts;
  var correct_answer;      
  
  // 테이블명 모두 받아와서 레코드 병합조회하는 쿼리문 만들기
  fetch("/wordbook/", {method : 'post'}).then((response)=>response.json()).then((results)=>{
    console.log(results);
    var sql_query = ''    
    
    sql_query += `SELECT * FROM ${results[0].Tables_in_oq4p2dxa5zpnk9gu}`;
    for (let i=1 ; i < results.length ; i ++) {
      sql_query += ` UNION ALL SELECT * FROM ${results[i].Tables_in_oq4p2dxa5zpnk9gu}`;
    }
    console.log(sql_query);
    // 만든 쿼리문으로 레코드 병합조회하기
    sql_query_json = {'sql_query' : sql_query};
    fetch("/wordbook/quiz", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(sql_query_json)}).then((response)=>response.json()).then((results)=>{
      console.log(results);      
      write_kor.innerHTML = `<span class="ft5 ftb">${results.KOR}</span>`;
      write_eng.innerHTML = '<form action="#">';
      eng_trim = results.ENG.replace(/ /gi, ' ');
      eng_parts = eng_trim.split(' ');  
      console.log(eng_parts);
      var i = 1;
      write_eng.innerHTML = '';          
      for (part of eng_parts) {
        var trial_num;        
        var trim_word_start, trim_word_strpt;
        var display_word = '';        
        var regex = /[.?',!"-$+;/=]/;
        if (part.length > 1) {
          trim_word_start = part.replace(/[.?',!"-$+;/=]/gi, '').substr(0,1);          
          trim_word_strpt = part.indexOf(trim_word_start);                     
          for (let j = 0; j<part.length; j++) {
            if (regex.test(part.substr(j,1))) {                            
              display_word += part.substr(j,1);
            } else {                            
              display_word += '_';              
            }
          }          
          if (trim_word_strpt === 0) {
            display_word = part.substr(0,1) + display_word.substr(1,part.length-1);
          } else {
            display_word = display_word.substr(0,trim_word_strpt) + part.substr(trim_word_strpt, 1) + display_word.substr(trim_word_strpt + 1, part.length - (trim_word_strpt+1) );
          }         
          console.log(display_word);
          write_eng.innerHTML += `
            <span class="ft5 ftb hidden_text" id="part_text_${i}" >${part}</span><span class="ft5 ftb">${display_word} </span><span class="ft5 ftb"> </span>`;             
          



          // var left_length = part.length-1;          
          // write_eng.innerHTML += `          
          //   <span class="ft5 ftb hidden_text" id="part_text_${i}" >${part.substr(1,)}</span>
          //   <span class="ft5 ftb hidden_text" id="part_underbar_${i}" >${'_'.repeat(left_length)}</span>
          //   <span class="ft5 ftb">${part.substr(0,1)}</span><input type="text" class="ft5 ftb shadow-sm quiz_inputs" id="quiz_input_${i}" style="height:0; width:0;" placeholder="${'_'.repeat(left_length)}" required><span class="ft5 ftb"> </span>`;             
          // var part_text = document.getElementById(`part_text_${i}`);
          // var part_underbar = document.getElementById(`part_underbar_${i}`);
          // var quiz_input = document.getElementById(`quiz_input_${i}`);
          // var script = document.createElement('script');
          // script.async = true;   
          // script.text = `
          //   var quiz_input_detector_${i} = document.getElementById('quiz_input_${i}');
          //   quiz_input_detector_${i}.addEventListener("keyup", e => {
          //     console.log(e);
          //   });
          // `;
          // document.body.appendChild(script);
          // console.log(quiz_input.style);
          // console.log((part_text.clientHeight) + "px");
          // console.log((part_text.clientWidth) + "px");
          // quiz_input.style.maxHeight = (part_text.clientHeight-2) + "px";           
          // quiz_input.style.minHeight = (part_underbar.clientHeight-2) + "px";           
          // quiz_input.style.maxWidth = (part_text.clientWidth) + "px";          
          // quiz_input.style.minWidth = (part_underbar.clientWidth) + "px";          
        } else {
          write_eng.innerHTML += `
            <span class="ft5 ftb hidden_text" id="part_text_${i}" >${part}</span><span class="ft5 ftb">${part.substr(0,1)}</span><span class="ft5 ftb"> </span>`;             
        }
        i += 1;
      } 
      write_eng.innerHTML += `</form>`;                 
      
      
      


      // 조회된 레코드 중 퀴즈문제 선별하기(최소 10개)
      // 1. 평균기간차이보다 오래된 것들
      // temp_arr = results.map(row=>row.LOADDATE);
      // console.log(temp_arr);
      
        // date_hit = new Date(`${date_hit.getFullYear()}-${date_hit.getMonth()}-${date_hit.getDate()}`);
        
      // });
      // temp_arr = results.map(row=>{
      //   let date_hit = new Date(row.LOADDATE);
      //   date_hit = new Date(`${date_hit.getFullYear()}-${date_hit.getMonth()}-${date_hit.getDate()}`);
      //   return date_hit.getTime();
      // });      
      // var now =new Date();
      // console.log(temp_arr);
      // console.log(now);
      // console.log(now - 1668988800000);
      // console.log(new Date(now-1668988800000));
    //   older_record = Math.min(...temp_arr);      
    //   console.log(older_record);
    //   filtered_result2 = filtered_result1.filter(function(result){
    //     let date_hit = new Date(result.LOADDATE);
    //     date_hit = new Date(`${date_hit.getFullYear()}-${date_hit.getMonth()}-${date_hit.getDate()}`);
    //     date_hit = date_hit.getTime();
    //     if (date_hit === older_record) {
    //       return true;
    //     }
    //   });
    //   console.log(filtered_result2);

    //   // 1. 가장 조회수가 적은 것들 선별
    //   var temp_arr = results.map(row=>row.LOAD_NUM);      
    //   minimum_hit = Math.min(...temp_arr);
    //   console.log(minimum_hit);
    //   filtered_result1 = results.filter(function(result){
    //     if (result.LOAD_NUM === minimum_hit) {
    //       return true;
    //     }
    //   });
    //   console.log(filtered_result1);
    //   if (filtered_result1.length = 1) {
    //     target_sentence = filtered_result1[0];
    //   } else { // 2. 가장 조회한지 오래된 것들 선별
        
    //     if (filtered_result2.length = 1) {
    //       target_sentence = filtered_result2[0];
    //     } else { // 3. 가장 기록한지 오래된 것들 선별
    //       temp_arr = results.map(row=>{
    //         let date_hit = new Date(row.SAVEDATE);
    //         date_hit = new Date(`${date_hit.getFullYear()}-${date_hit.getMonth()}-${date_hit.getDate()}`);
    //         return date_hit.getTime();
    //       });            
    //       older_record = Math.min(...temp_arr);            
    //       filtered_result3 = filtered_result2.filter(function(result){
    //         let date_hit = new Date(result.SAVEDATE);
    //         date_hit = new Date(`${date_hit.getFullYear()}-${date_hit.getMonth()}-${date_hit.getDate()}`);
    //         date_hit = date_hit.getTime();
    //         if (date_hit === older_record) {
    //           return true;
    //         }
    //       });
    //       console.log(filtered_result3);
    //       if (filtered_result3.length = 1) {
    //         target_sentence = filtered_result3[0];
    //       } else { // 4. 결과값이 여러개인 경우 랜덤하게 선택 
    //         if (filtered_result3.length > 1) {
    //           var random_num = Math.floor(Math.random() * filtered_result3.length); 
    //           target_sentence = filtered_result3[random_num];
    //         } else {
    //           target_sentence = filtered_result3[0];
    //         }
    //       }
    //     }
    //   }
    //   console.log('------------------quiz------------');
    //   console.log(target_sentence);
    //   document.getElementById('quiz_sentence').innerText = target_sentence.ENG;
    })
  });
}

