// Translate Search Btn Click

function tranbtn_click(position){  
    console.log('tranbtn_click start at ' + position);
    var req_pos = position;
    var doc_eng, doc_kor;  
    // var Input_target = '';
    var view_target = '';
    var engs_org, engs_spl, engs_res;

    var dic_url;
    if ((get_config_cookie() !== null) && (get_config_cookie() !== undefined)) {
      config = get_config_cookie();
      if (Number(config[0]) === 1) {
        dic_url = 'https://dictionary.cambridge.org/dictionary/english/';
      } else if (Number(config[0]) === 2) {
        dic_url = 'https://en.dict.naver.com/#/search?query=';
      } else if (Number(config[0]) === 3) {
        dic_url = 'https://www.etymonline.com/search?q=';
      }
    } else {
      dic_url = 'https://dictionary.cambridge.org/dictionary/english/';
    }   
  
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
    } else if (req_pos === 'third_1box_center') {
      doc_eng = document.getElementById('t1_box_Sres_ENG');
      doc_kor = document.getElementById('t1_box_Sres_KOR');
      Input_target = document.getElementById('t1_box_main_search_input');
      view_target = document.getElementById('t1_box_Sres_view');
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
              engs_res += `<span onclick="touch_block_action(this); window.open('${dic_url + words_encode}');">${words}</span> `;
              
              // engs_res += `<span onclick="touch_block_action(this); Cambrg_search('${words_encode}');">${words}</span> `;
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
      } else if (req_pos === 'third_1box_center'){  // T1박스 -> 영어 : 그대로 처리 / 한글 : 번역              
        engs_org = Input_target.value.replace(/\n$/,'');
        engs_spl = Input_target.value.replace('\n', ' ___ ').replace(/^\s+|\s+$/g,'').replace('  ',' ').split(' ');              
        engs_res = '';
        function TEST_add(engs_spl){
          for (let words of engs_spl){            
            if (words === '___') {
              engs_res += `<br>`;
            } else {                                
              words_encode = encodeURIComponent(words).replace(/'/g, '%27');    
              engs_res += `<span onclick="touch_block_action(this); window.open('${dic_url + words_encode}');">${words}</span> `;
              
              // engs_res += `<span onclick="touch_block_action(this); Cambrg_search('${words_encode}');">${words}</span> `;
            }              
          }
          doc_eng.innerHTML += engs_res;
          re_popup();             
        }
        TEST_add(engs_spl);    
        trans_papago(req_pos,engs_org);         
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
    var link_yarn, link_youglish, link_google, link_skell, link_ludwig = '';
    var url_yarn, url_youglish, url_google, url_skell, url_ludwig = '';
    var engs_org, engs_spl, engs_res;
    let kor_check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    let TEXT = '';
  
    if (req_pos === 'mainbox_center') {    // 메인박스 -> 
      view_target = document.getElementById('Sres_view');
      link_yarn = document.getElementById('msi_link_yarn');
      link_youglish = document.getElementById('msi_link_youglish');
      link_google = document.getElementById('msi_link_google'); 
      link_skell = document.getElementById('msi_link_skell');
      link_ludwig = document.getElementById('msi_link_ludwig');
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
                engs_res += `<span onclick="touch_block_action(this); window.open('https://dictionary.cambridge.org/dictionary/english-korean/${words_encode}');">${words}</span> `;
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
        url_skell = 'https://skell.sketchengine.eu/#result?f=wordsketch&lang=en&query=' + encodeURIComponent(engs_org).replace(/'/g, '%27');
        url_ludwig = 'https://ludwig.guru/s/' + encodeURIComponent(engs_org).replace(/'/g, '%27');
  
        console.log(encodeURIComponent(engs_org), encodeURIComponent(engs_org).replace(/'/g, '%27'));
        console.log(engs_org);
        console.log(url_yarn);
  
        link_yarn.setAttribute('href', `${url_yarn}`);      
        link_youglish.setAttribute('href', `${url_youglish}`);
        link_google.setAttribute('href', `${url_google}`);
        link_skell.setAttribute('href', `${url_skell}`);
        link_ludwig.setAttribute('href', `${url_ludwig}`);
      });
    } else if (req_pos === 'second_3box_center') {    // S3 박스 ->
      view_target = document.getElementById('word_toolbar_result'); 
      link_yarn = document.getElementById('word_toolbar_link_yarn');
      link_youglish = document.getElementById('word_toolbar_link_youglish');
      link_google = document.getElementById('word_toolbar_link_google');  
      link_skell = document.getElementById('word_toolbar_link_skell');
      link_ludwig = document.getElementById('word_toolbar_link_ludwig'); 
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
        url_skell = 'https://skell.sketchengine.eu/#result?f=wordsketch&lang=en&query=' + encodeURIComponent(engs_org).replace(/'/g, '%27');
        url_ludwig = 'https://ludwig.guru/s/' + encodeURIComponent(engs_org).replace(/'/g, '%27');

        console.log(engs_org);
        console.log(url_yarn);
  
        link_yarn.setAttribute('href', `${url_yarn}`);      
        link_youglish.setAttribute('href', `${url_youglish}`);
        link_google.setAttribute('href', `${url_google}`);
        link_skell.setAttribute('href', `${url_skell}`);
        link_ludwig.setAttribute('href', `${url_ludwig}`);
      });    
    } else if (req_pos === 'third_1box_center') {    // t1 박스 ->
      view_target = document.getElementById('t1_box_Sres_view');
      link_yarn = document.getElementById('t1_box_msi_link_yarn');
      link_youglish = document.getElementById('t1_box_msi_link_youglish');
      link_google = document.getElementById('t1_box_msi_link_google');    
      link_skell = document.getElementById('t1_box_msi_link_skell');
      link_ludwig = document.getElementById('t1_box_msi_link_ludwig'); 
      if (kor_check.test(SENTC)) {
        TEXT = {'source' : 'ko', 'target' : 'en', 'word' : SENTC};
        patch_target = document.getElementById('t1_box_Sres_KOR');
        write_target = document.getElementById('t1_box_Sres_ENG');                   
        write_target_id = 'ENG';
      } else {      
        TEXT = {'source' : 'en', 'target' : 'ko', 'word' : SENTC};            
        patch_target = document.getElementById('t1_box_Sres_ENG')
        write_target = document.getElementById('t1_box_Sres_KOR');                   
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
                engs_res += `<span onclick="touch_block_action(this); window.open('https://dictionary.cambridge.org/dictionary/english-korean/${words_encode}');">${words}</span> `;
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
        url_skell = 'https://skell.sketchengine.eu/#result?f=wordsketch&lang=en&query=' + encodeURIComponent(engs_org).replace(/'/g, '%27');
        url_ludwig = 'https://ludwig.guru/s/' + encodeURIComponent(engs_org).replace(/'/g, '%27');
  
        console.log(encodeURIComponent(engs_org), encodeURIComponent(engs_org).replace(/'/g, '%27'));
        console.log(engs_org);
        console.log(url_yarn);
  
        link_yarn.setAttribute('href', `${url_yarn}`);      
        link_youglish.setAttribute('href', `${url_youglish}`);
        link_google.setAttribute('href', `${url_google}`);
        link_skell.setAttribute('href', `${url_skell}`);
        link_ludwig.setAttribute('href', `${url_ludwig}`);
      }); 
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