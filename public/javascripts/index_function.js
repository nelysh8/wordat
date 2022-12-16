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
      main_tranbtn_click();
    }
});

word_toolbar_input.addEventListener("keyup", e => {    
  if (e.keyCode === 13 && e.shiftKey && e.target.value){        
    word_toolbar_tranbtn_click();
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

function main_tranbtn_click(){    
  
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
    main_trans_papago(engs_org);
    document.getElementById('link_yarn').setAttribute('href', encodeURI('https://getyarn.io/yarn-find?text=' + engs_org));
    document.getElementById('link_youglish').setAttribute('href', encodeURI('https://youglish.com/pronounce/' + engs_org + '/english?'));
    document.getElementById('link_google').setAttribute('href', encodeURI('https://www.google.com/search?q="' + engs_org +'"'));
    
    click_fadein(document.getElementById('Sres_view'));          
    iframe2_vis();
  }
};



// <!-- papago translation -->
    
function main_trans_papago(SENTC){
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

  function tts(target, speed){
    let object = target;
    let rate = speed;
    
    if (object === 'a') {
      var sentence = document.getElementById('main_input').value;
    } else {
      var sentence = document.getElementById('word_toolbar_input').value;
    }
    
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

// main box modal

function addword_click() {
  var dropdown_list = '';
  var dropdown_menu = document.getElementById("addword_dropdown_wordbook");
  var dropdown_buttton = document.getElementById("dropdown_button");
  var form_add_word = document.getElementById("form_add_word");
  
  var engs = document.getElementById('main_input').value.replace(/\n$/,'');        
  document.getElementById("edit_eng").value = engs;
  if (document.getElementById('Sres_KOR').innerText === "") {          
  } else {
    console.log(document.getElementById('Sres_KOR').innerText);
    document.getElementById("edit_kor").value=document.getElementById('Sres_KOR').innerText;
  }      
  fetch("/wordbook", {method : 'post'}).then((response)=>response.json()).then((results)=>{        
    console.log(results);
    for (let result of results){
      dropdown_list += `<li><a class="dropdown-item" href="#" onclick="click_dropdown_menu(this)">${result.Tables_in_oq4p2dxa5zpnk9gu}</a></li>`;
    };
    dropdown_menu.innerHTML = dropdown_list;
    console.log(selected_wordbook);
    console.log(results.includes(selected_wordbook));
    if ((selected_wordbook !== '') && (results.includes(selected_wordbook))) {
      dropdown_buttton.innerText = selected_wordbook;
      form_add_word.setAttribute('action', `/word_manage/add/${dropdown_buttton.innerText}`);    
    } else if (results.length > 0) {
      dropdown_buttton.innerText = results[0].Tables_in_oq4p2dxa5zpnk9gu;
      form_add_word.setAttribute('action', `/word_manage/add/${dropdown_buttton.innerText}`);    
    };
  });      
}

function click_dropdown_menu(obj){
  console.log(obj.innerText);
  var dropdown_buttton = document.getElementById("dropdown_button");
  var form_add_word = document.getElementById("form_add_word");
  dropdown_buttton.innerText = obj.innerText;
  selected_wordbook = obj.innerText;
  form_add_word.setAttribute('action', `/word_manage/add/${dropdown_buttton.innerText}`);    
}

// second box 
  
  // wordbook - 1box

    // open / close

async function wordbook_open(){    
  wordbook_reading();
  await click_slideoutdown(mainbox_center);  
  click_slideup(second_1box_center);  
}

async function wordbook_close(){  
  await click_slideoutdown(second_1box_center);        
  click_slideup(mainbox_center);
}

    // read

function wordbook_reading(){        
  fetch("/wordbook", {method : 'post'}).then((response)=>response.json()).then((results)=>add_result(results));
  function add_result(datas){
    let add_html = '';
    let i = 0;
    for (let data of datas){
      console.log(data.Tables_in_oq4p2dxa5zpnk9gu);
      add_html += `<div class="wordbook_wrap shadow-sm">
                      <div class="wordbook_text" onclick="wordlist_reading(${i},)">                                          
                        <div id="wordbook_title_${i}" class="wordbook_title ft8 ftb"><span name="wordbook_title">${data.Tables_in_oq4p2dxa5zpnk9gu}</span></div>
                        <div id="wordbook_hashtag" class="wordbook_hashtag ft10 text_gray"> <span>#오늘도즐거워 #람쥐귀여워 </span></div>                                                              
                      </div>
                      <div class="wordbook_option">
                        <i class="fa-solid fa-pen ft7 ftb text_green" data-bs-toggle="modal" data-bs-target="#wordbook_edit_modal"></i>
                        <div id="wordbook_edit_modal" class="modal fade" role="dialog">
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
                      <div class="wordbook_option"><i class="fa-solid fa-trash-can ft7 ftb text_red" onclick="remove_wordbook_click(${i});"></i></div>                      
                    </div>                  
                  </div>`;                  
      i += 1;
    }  
    var doc = document.getElementById("wordbook_list");
    doc.innerHTML = add_html;
  }
}

    // functions

async function add_wordbook_click(){
  var wordbook_title = {title : document.getElementById('add_wordbook_title').value};
  console.log(wordbook_title);
  await fetch("/wordbook/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
    console.log(results);        
  })
  wordbook_reading();  
}

async function remove_wordbook_click(number){
  let wordbook_title = {title : document.getElementById(`wordbook_title_${number}`).innerText};
  await fetch("/wordbook/remove", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
    console.log(results);
  })
  wordbook_reading();
}

async function edit_wordbook_click(number){
  let wordbook_title = {oldtitle : document.getElementById(`wordbook_title_${number}`).innerText, newtitle : document.getElementById(`edit_wordbook_title_${number}`).value};
  await fetch("/wordbook/edit", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
    console.log(results);
  })
  wordbook_reading();
}

  // Wordlist - 2box

    // open, close 

function wordlist_open(){  
  click_slideup(second_2box_center);    
  click_fadeout(second_1box_contents);
}

function wordlist_close(){
  click_fadein(second_1box_contents);
  click_slideoutdown(second_2box_center);   
}

    // read

function wordlist_reading(number, title){    
  // second_1box_center.style.position = 'relative';
  // second_2box_center.style.position ='absolute';  
  console.log('wordlist_reading start');
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
        <div class="title" name="add_word_title" id="add_word_title"><span class="ft5 ftb"> ${wordbook_title.title} </span></div>
        <div class="plus_icon">
          <i class="fa-solid fa-file-circle-plus ft6 ftbb text_green" data-bs-toggle="modal" data-bs-target="#word_add_modal" onclick=""></i>
          <div id="word_add_modal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <span class="ft5 ftbb">Add words to the wordbook</span>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>                                   
                <div class="modal-body">                                          
                  <div class="input-group mb-3">
                    <span class="input-group-text ft8 ftb bg_cornsilk text_red" id="basic-addon1" > ENG </span>
                    <input type="text" name="add_word_eng" class="form-control ft8" placeholder="Input a English Sentence" id="add_word_eng" aria-label="Username" aria-describedby="basic-addon1" > 
                  </div>
                  <div class="input-group mb-3">
                    <span class="input-group-text ft8 ftb bg_cornsilk text_red" id="basic-addon1"> KOR </span>
                    <input type="text" name="add_word_kor" class="form-control ft8" placeholder="Input it's meaning" id="add_word_kor" aria-label="Username" aria-describedby="basic-addon1">
                  </div>                                      
                  <div class="modal-footer">                        
                    <button type="submit" class="btn bg_firebrick bg-gradient text_cornsilk ft8 ftbb" data-bs-dismiss="modal" onclick="add_word();"> ADD </button>
                    <button type="button" class="btn btn-secondary bg-gradient ft8 ftbb" data-bs-dismiss="modal"> CLOSE </button>                        
                  </div>                    
                </div>
              </div>
            </div>
          </div> 
        </div>
        <div class="back_icon"><i class="fa-solid fa-arrow-rotate-left ft6 ftbb text_red" onclick="wordlist_close();"></i></div>`;
      document.getElementById('wordlist_headline').innerHTML = add_head_html;     

    for (let result of results) {
      add_contents_html += `<div class="wordlist_wrap shadow-sm">
      <div class="wordlist_main">
        <div class="wordlist_text" onclick="word_reading(${result.ID});">                    
          <div id="wordlist_eng_${result.ID}" class="wordlist_eng ft8 ftb"> <span> ${result.ENG} </span></div>
          <div id="wordlist_kor_${result.ID}" class="wordlist_kor ft8 ftb"> <span> ${result.KOR} </span></div>
        </div>        
        <div class="wordlist_option">
          <i class="fa-solid fa-list-check ft7 ftb text_red" data-bs-toggle="collapse" data-bs-target="#wordlist_example_${result.ID}" aria-expanded="false" aria-controls="wordlist_example_${result.ID}"></i>
        </div>
      </div>

      
      <div class="wordlist_second">
        <div class="collapse wordlist_example ft10" id="wordlist_example_${result.ID}">                  
          <ul>
            <li>People are absolutely obsessed with their rights. <br> 사람들은 자신의 권리에 절대적으로 집착합니다. </li>
            <li>They are obsessed with their own plans. <br> 그들은 자신의 계획에 집착합니다.</li>
          </ul>
        </div>        
      </div>
    </div>`;      
    }    
    add_contents_html += `</div>
      </div>`;
    document.getElementById('wordlist_list').innerHTML = add_contents_html;
    wordlist_open();
  });
}    

    // functions

function add_word(){
  var word = {title : document.getElementById('add_word_title').innerText, eng : document.getElementById('add_word_eng').value, kor : document.getElementById('add_word_kor').value};
  console.log(word);
  fetch("/wordbook/word/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
    console.log(results); 
    wordlist_reading('',word.title);       
  });  
}

  // word - 3box

    // open, close

function word_open(){
  console.log('word_open start');
  click_slideup(second_3box_center);    
  click_fadeout(second_2box_contents);
}

function word_close(){
  click_fadein(second_2box_contents);
  click_slideoutdown(second_3box_center); 
}


    // reading

function word_reading(ID_number){  
  console.log('word_reading start');
  let wordbook_title = document.getElementById('add_word_title').innerText;
  let word_id = ID_number;
  console.log(wordbook_title, word_id);
  // if (number === '') {
  //   wordbook_title = {title : title};
  // } else {
  //   wordbook_title = {title : document.getElementById(`wordbook_title_${number}`).innerText};
  // }  
  let word = {'wordbook_title' : wordbook_title, 'word_id' : word_id};
  console.log(word);
  fetch("/wordbook/word", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
    console.log(results);
    // 문장타이틀부분 #word_view1
    let word_title_html = `
      <ul>
        <li><span id="word_id" style="display :none;">${results[0].ID}</span><span class="ft7 ftb"> ${results[0].ENG} </span></li>
        <li><span class="ft7 ftb"> ${results[0].KOR} </span> <i class="fa-solid fa-list-check ft7 ftb text_red"></i></li>
      </ul>`;
    // 예문부분 #example_list    
    let example_html = ``;
    for (result of results){
      if (result.EXAMPLE !== null) {
        example_html += `<li> ${result.EXAMPLE.ENG} <br> ${result.EXAMPLE.KOR} </li>`;
      }
    }
    document.getElementById('word_view1').innerHTML = word_title_html;
    document.getElementById('example_list').innerHTML = example_html;          
  });
  word_open();
};

  
    // functions

      // exam add

function example_add(){
  let now = new Date();
  let time = `${now.getFullYear()}${now.getMonth()}${now.getDate()}`;  
  let example = {'wordbook_title' : document.getElementById('add_word_title').innerText, 'word_id' : document.getElementById('word_id').innerText, 'ENG' : document.getElementById('exam_eng').value, 'KOR' : document.getElementById('exam_kor').value, 'SAVEDATE' : time, 'LOADDATE' : time , 'LOAD_NUM' : 0};    
  console.log(example);
  fetch("/wordbook/exam/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(example)}).then((response)=>response.json()).then((results)=>{
    console.log(results);
  });
}


function word_toolbar_tranbtn_click(){    

  if(word_toolbar_input.value.replace(/ /gi,'').replace(/\n/gi,'')) {                        
    var engs_org = word_toolbar_input.value.replace(/\n$/,'');
    var engs_spl = word_toolbar_input.value.replace('\n', ' ___ ').replace(/^\s+|\s+$/g,'').replace('  ',' ').split(' ');          
    console.log(engs_spl);
    engs_res = '';          
    
    var doc = document.getElementById('wtrv_ENG');
    doc.innerHTML = '';          
    
    function TEST_add(engs_spl){
      for (let words of engs_spl){            
        if (words === '___') {
          engs_res += `<br>`;
        } else {                                
          // engs_res += `<a href="#" onclick="parent.Cambrg_search('${words}'); ">${words}</a> `;
          engs_res += `${words} `;
        }              
      }

      doc.innerHTML += engs_res;
      re_popup();             
      // click_fadein(doc);        
      // iframe2_vis();
    }      
    
    TEST_add(engs_spl);
    word_toolbar_trans_papago(engs_org);
    document.getElementById('word_toolbar_link_yarn').setAttribute('href', encodeURI('https://getyarn.io/yarn-find?text=' + engs_org));
    document.getElementById('word_toolbar_link_youglish').setAttribute('href', encodeURI('https://youglish.com/pronounce/' + engs_org + '/english?'));
    document.getElementById('word_toolbar_link_google').setAttribute('href', encodeURI('https://www.google.com/search?q="' + engs_org +'"'));
    
    click_fadein(document.getElementById('word_toolbar_result'));          
    iframe2_vis();
  }
};

// <!-- papago translation -->
    
function word_toolbar_trans_papago(SENTC){
  let TEXT = {word : SENTC};        
  let TEXT_JSON = JSON.stringify(TEXT);
  console.log(TEXT);
  console.log(JSON.stringify(TEXT));
  fetch("/translate", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(TEXT)}).then((response)=>response.json()).then((result)=>data(result));                

  function data(result){          
    let B = JSON.stringify(result);          
    var tmp = document.getElementById('wtrv_KOR');
    function addtext(){
      tmp.innerText = result.message.result.translatedText;
    }
    addtext();
  }
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

// word add modal control



    



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

  
      