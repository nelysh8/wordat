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
const third_1box_center = document.getElementById('third_1box_center');
const config_layer = document.getElementById('config_layer');

// Setting
const selected_wordbook = '';


window.onload = function(){
  document.getElementById('loading_layer').style.display = 'none';
  det_login(token, 'confirm');
  cartoon();
  paper();
  ebook_list(0);

};

// iphone 확대저지

if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
  var viewportmeta = document.querySelector('meta[name="viewport"]');
  if (viewportmeta) {
      viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
      document.body.addEventListener('gesturestart', function () {
          viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
      }, false);
  }
}

// swipe

$('.carousel').on('touchstart', function(event){
  const xClick = event.originalEvent.touches[0].pageX;
  $(this).one('touchmove', function(event){
      const xMove = event.originalEvent.touches[0].pageX;
      const sensitivityInPx = 5;

      if( Math.floor(xClick - xMove) > sensitivityInPx ){
          $(this).carousel('next');
      }
      else if( Math.floor(xClick - xMove) < -sensitivityInPx ){
          $(this).carousel('prev');
      }
  });
  $(this).on('touchend', function(){
      $(this).off('touchmove');
  });
});


// Carousel 감지
var contents_wordbook = document.getElementById("contents_wordbook");
var contents_cartoon = document.getElementById("contents_cartoon");
var contents_paper = document.getElementById("contents_paper");
var contents_ebook = document.getElementById("contents_ebook");
var contents_start = document.getElementById('contents_start');

var contents_wordbook_observer = new MutationObserver(mutations => {    
  if ((mutations[0].oldValue.includes('active') === false) && (mutations[0].target.className.includes('active') === true)) {
    console.log('mutation wordbook activation detected');  
    console.log(document.getElementById('ts_quiz_kor').innerText);
    document.getElementById('carousel-btn-line').innerHTML = ``;
    
  } 
});

var contents_cartoon_observer = new MutationObserver(mutations => {    
  if ((mutations[0].oldValue.includes('active') === false) && (mutations[0].target.className.includes('active') === true)) {
    console.log('mutation cartoon activation detected');  
    document.getElementById('carousel-btn-line').innerHTML = ``;
    // console.log(document.getElementById('ts_quiz_kor').innerText);
    // if (document.getElementById('ts_quiz_kor').innerText === "") {
    //   testquiz(1);
    // }    
  } 
});

var contents_paper_observer = new MutationObserver(mutations => {    
  if ((mutations[0].oldValue.includes('active') === false) && (mutations[0].target.className.includes('active') === true)) {
    console.log('mutation paper activation detected');  
    document.getElementById('carousel-btn-line').innerHTML = ``;
  } 
});

var contents_ebook_observer = new MutationObserver(mutations => {    
  if ((mutations[0].oldValue.includes('active') === false) && (mutations[0].target.className.includes('active') === true)) {
    console.log('mutation ebook activation detected');  
    document.getElementById('carousel-btn-line').innerHTML = `
              <div id="carousel_bottom_btn" class="animate__animated" onclick="touch_icon_action(this); ebook_list((Number(document.getElementById('ebook_view_num').innerHTML)) + 1);">
                <i class="fa-solid fa-circle-arrow-right ft5 text_red"></i>
              </div>                
              `;
  } 
});

var contents_start_observer = new MutationObserver(mutations => {    
  if ((mutations[0].oldValue.includes('active') === false) && (mutations[0].target.className.includes('active') === true)) {
    console.log('mutation contents_start activation detected');  
    document.getElementById('carousel-btn-line').innerHTML = `
      <a href="http://www.freepik.com">Designed by rawpixel.com / Freepik</a>
      `;
    
  } 
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
contents_wordbook_observer.observe(contents_wordbook, observer_config);
contents_cartoon_observer.observe(contents_cartoon, observer_config);
contents_paper_observer.observe(contents_paper, observer_config);
contents_ebook_observer.observe(contents_ebook, observer_config);
contents_start_observer.observe(contents_start, observer_config);
// 감지 종료
// observer.disconnect();


// login layer 닫힘 감지

document.addEventListener('click', function(e) {    
  var container1 = document.getElementById('login_layer');
  var container2 = document.getElementById('user_image');
  var container3 = document.getElementById('footbar_2');
  var container4 = document.getElementById('wim_cancel_btn');
  

  if ((!container1.contains(e.target)) && (!container2.contains(e.target)) && (!container3.contains(e.target))) {    
    if (!container4.contains(e.target)) {
      console.log('loginbar closing...');
      close_loginbar();      
    }
  }
});

// input detection
const Search_DOC = document.querySelector(".searchbar");
Search_Input = Search_DOC.querySelector("textarea");
const word_toolbar_doc = document.querySelector('.word_toolbar');
word_toolbar_input = word_toolbar_doc.querySelector('textarea');
const t1_box_Search_DOC = document.querySelector(".t1_box_searchbar");
t1_box_Search_Input = t1_box_Search_DOC.querySelector("textarea");

wordbook_input_btn = document.getElementById('wordbook_input_btn');
add_wordbook_title = document.getElementById('add_wordbook_title');
wordbook_input_exp = document.getElementById('wordbook_input_exp');

edit_wb_title_text = document.getElementById('edit_wb_title_text');
edit_wb_input_exp = document.getElementById('edit_wb_input_exp');
edit_btn = document.getElementById('edit_btn');
edit_wb_hashtag_text = document.getElementById('edit_wb_hashtag_text')

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

t1_box_Search_Input.addEventListener("keyup", e => {    
  if (e.keyCode === 13 && e.shiftKey && e.target.value){        
    tranbtn_click('third_1box_center');
  }
});

add_wordbook_title.addEventListener('keyup', () => {
  console.log('add_wordbook_title keyup detected');
  var input_text = add_wordbook_title.value;
  if (input_text.replace(/ /gi, '') === '') {
    wordbook_input_exp.innerText = '단어장 이름을 입력해주세요.';        
    wordbook_input_btn.setAttribute('data-bs-dismiss', ''); 
    wordbook_input_btn.setAttribute('onclick', '');
  } 
  else if ((isNaN(input_text.replace(/ /gi, ''))) === false ) {
    wordbook_input_exp.innerText = '숫자 외에 문자도 입력해주세요.';    
    wordbook_input_btn.setAttribute('data-bs-dismiss', '');
    wordbook_input_btn.setAttribute('onclick', '');
  }
  else if (input_text.length !== input_text.replace(/[`~@$%^*()_|+\-=?;:",<>\{\}\[\]\\]/gim, '').length){
    wordbook_input_exp.innerText = `특수문자는 [" ", ".", "!", "#", "&", "/", "'"] 외에는 입력할 수 없어요.`;    
    wordbook_input_btn.setAttribute('data-bs-dismiss', '');
    wordbook_input_btn.setAttribute('onclick', '');
  }
  else if (table_name_trim(input_text).length > 50) {
    wordbook_input_exp.innerText = '단어장 이름이 조금 길어요.';    
    wordbook_input_btn.setAttribute('data-bs-dismiss', '');
    wordbook_input_btn.setAttribute('onclick', '');
  }
  else {
    wordbook_input_exp.innerText = '';
    wordbook_input_btn.setAttribute('data-bs-dismiss', 'modal');
    wordbook_input_btn.setAttribute('onclick', 'add_wordbook_click()');
  }
})

edit_wb_title_text.addEventListener('keyup', () => {
  console.log('edit_wb_title_text keyup detected');
  var input_text = edit_wb_title_text.value;
  if (input_text.replace(/ /gi, '') === '') {
    edit_wb_input_exp.innerText = '단어장 이름을 입력해주세요.';        
    edit_btn.setAttribute('data-bs-dismiss', ''); 
    edit_btn.setAttribute('onclick', '');
  } 
  else if ((isNaN(input_text.replace(/ /gi, ''))) === false ) {
    edit_wb_input_exp.innerText = '숫자 외에 문자도 입력해주세요.';    
    edit_btn.setAttribute('data-bs-dismiss', '');
    edit_btn.setAttribute('onclick', '');
  }
  else if (input_text.length !== input_text.replace(/[`~@$%^*()_|+\-=?;:",<>\{\}\[\]\\]/gim, '').length){
    edit_wb_input_exp.innerText = `특수문자는 [" ", ".", "!", "#", "&", "/", "'"] 외에는 입력할 수 없어요.`;    
    edit_btn.setAttribute('data-bs-dismiss', '');
    edit_btn.setAttribute('onclick', '');
  }
  else if (table_name_trim(input_text).length > 50) {
    edit_wb_input_exp.innerText = '단어장 이름이 조금 길어요.';    
    edit_btn.setAttribute('data-bs-dismiss', '');
    edit_btn.setAttribute('onclick', '');
  }
  else {
    edit_wb_input_exp.innerText = '';
    edit_btn.setAttribute('data-bs-dismiss', 'modal');
    edit_btn.setAttribute('onclick', `${document.getElementById('edit_btn_hidden').innerText}`);
  }
})

// long touch 함수

  let onlongtouch1, onlongtouch2, onlongtouch3  = false;
  let timer1, timer2, timer3 = false;
  let duration = 500;
  function touchStart1(){
    if (!timer1) {
      timer1 = setTimeout(onlongtouch1, duration);       
    }
  }
  function touchStart2(){
    if (!timer2) {
      timer2 = setTimeout(onlongtouch2, duration);       
    }
  }
  function touchStart3(){
    if (!timer3) {
      timer3 = setTimeout(onlongtouch3, duration);       
    }
  }
  function touchEnd1(){
    if (timer1) {
      clearTimeout(timer1)
      timer1 = false;          
    }        
  }
  function touchEnd2(){
    if (timer2) {
      clearTimeout(timer2)
      timer2 = false;          
    }             
  }
  function touchEnd3(){
    if (timer3) {
      clearTimeout(timer3)
      timer3 = false;          
    }             
  }
  onlongtouch1 = function(){      
    console.log('long touch detected');
    touch_icon_action(document.getElementById("msi_play_btn"));
    document.getElementById("msi_play_btn").onclick = tts_pos('mainbox_center', 0.5);
    document.getElementById("msi_play_btn").setAttribute("onclick", "touch_icon_action(this); tts_pos('mainbox_center', 1);");  
  }
  onlongtouch2 = function(){           
    console.log('long touch detected');     
    touch_icon_action(document.getElementById("word_toolbar_play_btn"))
    document.getElementById("word_toolbar_play_btn").onclick = tts_pos('second_3box_center', 0.5);
    document.getElementById("word_toolbar_play_btn").setAttribute("onclick", "touch_icon_action(this); tts_pos('second_3box_center', 1);");  
  }      
  onlongtouch3 = function(){           
    console.log('long touch detected');     
    touch_icon_action(document.getElementById("t1_box_msi_play_btn"))
    document.getElementById("t1_box_msi_play_btn").onclick = tts_pos('third_1box_center', 0.5);
    document.getElementById("t1_box_msi_play_btn").setAttribute("onclick", "touch_icon_action(this); tts_pos('third_1box_center', 1);");  
  }      
  document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("msi_play_btn").addEventListener("touchstart", touchStart1);
    document.getElementById("msi_play_btn").addEventListener("touchend", touchEnd1);
  })
  document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("word_toolbar_play_btn").addEventListener("touchstart", touchStart2);
    document.getElementById("word_toolbar_play_btn").addEventListener("touchend", touchEnd2);
  })
  document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("t1_box_msi_play_btn").addEventListener("touchstart", touchStart1);
    document.getElementById("t1_box_msi_play_btn").addEventListener("touchend", touchEnd1);
  })

// function youtube(){
//   var iframe = document.getElementById('youtube');
//   console.log(iframe.contentWindow.document.body.innerHTML);
// }

// iframe.contentWindow.addEventListener('onclick', handler);
 

// getElementById('ytp-caption-window-container')

// carousel detection






  
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







// second box 
  
  // wordbook - 1box

    // open / close



    // read








// <!-- popover -->
    // 

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


function config_chg(){
  var client_id = getCookie('client_ID');
  var default_dict = document.getElementById('default_dict').value;
  var tts_def = document.getElementById('tts_speed_def').value;
  var tts_slow = document.getElementById('tts_speed_slow').value;
  
  
  console.log(default_dict, tts_def, tts_slow);
  
  var config_cookie = {id : client_id, config : `dict[${default_dict}]/tts_def[${tts_def}]/tts_slow[${tts_slow}]/`};

  fetch("/config", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(config_cookie)}).then((response)=>response.json()).then((results)=>{
    console.log(results);    
    var con = get_config_cookie();
    console.log(con);      
  })  

}