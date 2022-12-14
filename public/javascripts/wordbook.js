// 테이블 이름 정리/복구
function table_name_trim(table_name) {
  var table_name = `$ff$${table_name}`
    .trim()
    .replace(/ /gi, '$_$')
    .replace(/\./gi, '$d$')
    .replace(/\!/gi, '$e$')
    .replace(/\#/gi, '$s$')
    .replace(/\&/gi, '$a$')
    .replace(/\//gi, '$w$')
    .replace(/\'/gi, '$u$');
  return table_name;
}

function table_name_recover(table_name) {
  var table_name = table_name
    .replace(/\$ff\$/gi,'')    
    .replace(/\$\_\$/gi, ' ')
    .replace(/\$d\$/gi, '.')
    .replace(/\$e\$/gi, '!')
    .replace(/\$s\$/gi, '#')
    .replace(/\$a\$/gi, '&')
    .replace(/\$w\$/gi, '/')
    .replace(/\$u\$/gi, "'");
  return table_name;
}

function word_trim(word) {
  var word = word
    .trim()
    .replace(/\'/gi, '$u$')
    .replace(/\"/gi, '$k$');
  return word;
}

function word_recover(word) {
  var word = word
    .replace()
    .replace(/\$u\$/gi, "'")
    .replace(/\$k\$/gi, '"');
  return word;
}

//

function wordbook_reading(time){          
  var token = getCookie('authorize-access-token');
  console.log('promise start');      
  det_login(token, 'execute')
  .then((data)=>{    
    console.log('promise/then start');      
    console.log(data);
    fetch("/wordbook", {method : 'post'}).then((response)=>response.json()).then((results)=>{
      // console.log(results);
      // console.log(results[0].TABLE_NAME);
      var table_name = `Tables_in_${getCookie("client_ID")}`;            
      let add_html = '';
      let i = 0;
      for (let data of results){        
        add_html += `<div class="wordbook_wrap shadow-sm">
                        <div class="wordbook_text" onclick="touch_block_action(document.getElementById('wordbook_title_span_${i}')); wordlist_reading(${i},'','initial');">                                          
                          <div id="wordbook_title_${i}" class="wordbook_title ft8 ftb animate__animated"><span id="wordbook_title_span_${i}" name="wordbook_title">${table_name_recover(data.TABLE_NAME)}</span></div>                        
                          <div id="wordbook_hashtag" class="wordbook_hashtag ft10 text_gray">${word_recover(data.TABLE_COMMENT)}<span></span></div>                                                              
                        </div>                      
                        <div class="wordbook_option">
                          <i class="fa-solid fa-pen ft7 ftb text_green" onclick="edit_modal1_openbtn_click('second_1box_center', '${data.TABLE_NAME}', '${data.TABLE_COMMENT}');"></i>                                                   
                        </div>
                        <div class="wordbook_option">
                          <i class="fa-solid fa-trash-can ft7 ftb text_red" onclick="remove_modal1_openbtn_click('second_1box_center', '${data.TABLE_NAME}');"> </i>
                        </div>                      
                      </div>                  
                    </div>`;                  
        i += 1;
      };
      var doc = document.getElementById("wordbook_list");
      doc.innerHTML = add_html;    
      return 'next';
    })
    .then(()=>{
      if (time === 'initial'){
        wordbook_open();
      }
    })      
  })
  .catch((data)=>{
    console.log('promise error');
    console.log(data);
  })
}
  
   
    // Wordlist - 2box
  
      // open, close 
  
  
  
      // read
  
  function wordlist_reading(number, title, time){    
    // second_1box_center.style.position = 'relative';
    // second_2box_center.style.position ='absolute';  
    var title_name = table_name_trim(title);
    console.log('wordlist_reading start');
    console.log('elements : ' + number, title_name);
    let wordbook_title = '';
    if (number === '') {
      wordbook_title = {title : title_name};
    } else {
      wordbook_title = {title : table_name_trim(document.getElementById(`wordbook_title_${number}`).innerText)};
    }  
    fetch("/wordbook/wordlist", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
      console.log(results);
      let add_head_html = '';
      let add_contents_html = '';    
      add_head_html = `
          <div class="title" id="s2_wordbook_title" onclick="s2_box_click();"><span class="ft5 ftb"> ${table_name_recover(wordbook_title.title)} </span></div>
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
                <div id="wordlist_eng_${result.ID}" class="wordlist_eng ft8 ftb"> <span> ${word_recover(result.ENG)} </span></div>
                <div id="wordlist_kor_${result.ID}" class="wordlist_kor ft8 ftb"> <span> ${word_recover(result.KOR)} </span></div>
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
            add_contents_html += `<li id="wordlist_${result.ID}_example_${j}">${word_recover(example.ENG)}<br>${word_recover(example.KOR)}</li>`;
            j +=1 ;
          }
          add_contents_html += `
                </ul>
                <div class="wordlist_toolbar" style="display : flex; width : 30%; margin-left : 70%;">          
                  <div style="display : block; padding : 1.3rem; margin: auto;"><i class="fa-solid fa-pen ft5 ftb text_green animate__animated" onclick="touch_icon_action(this); edit_modal1_openbtn_click('second_2box_center', '${wordbook_title.title}', '', '${result.ID}', '${word_trim(result.ENG)}', '${word_trim(result.KOR)}');"></i></div>                              
                  <div style="display : block; padding : 1.3rem; margin : auto;"><i class="fa-solid fa-trash-can ft5 ftb text_red animate__animated " onclick="touch_icon_action(this); remove_modal1_openbtn_click('second_2box_center', '${wordbook_title.title}', '${result.ID}', '${word_trim(result.ENG)}');"></i></div>                            
                </div>
              </div>        
            </div>`;        
        };      
      add_contents_html += `          
          </div>
        </div>
      </div>`;
      };
      document.getElementById('wordlist_list').innerHTML = add_contents_html;
      if (time === 'initial') {
        wordlist_open();
      }
    });
  }      
  
    // word - 3box
  
      // open, close
  
  
  
  
      // reading
  
  function word_reading(ID_number, time){  
    console.log('word_reading start');
    second_2box_center.scrollTop = 0;
    let wordbook_title = table_name_trim(document.getElementById('s2_wordbook_title').innerText);
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
          <li>            
            <span id="s3_word_id" style="display :none;">${results[0].ID}</span><span class="ft7 ftb" id="word_title_eng" onclick="touch_block_action(this); tts_any(this.innerText, 1);"> ${word_recover(results[0].ENG)} </span>
            <div class="animate__animated word_title_collase_icon" onclick="touch_icon_action(this);" data-bs-toggle="collapse" data-bs-target="#word_view_collapse" aria-expanded="false" aria-controls="word_view_collapse"><i class="fa-solid fa-list-check ft7 ftb text_red"></i></div>          
          </li>
          <li>
            <span class="ft7 ftb">${word_recover(results[0].KOR)}</span>          
          </li>
        </ul>`;
      // 예문부분 #example_list    
      let example_html = ``;
      let example_json = [];
      let j = 0;
      if (results[0].EXAMPLE !== null) {
        let examples = JSON.parse(results[0].EXAMPLE);            
        for (example of examples){       
          example_json.push(`{"ENG" : "${word_trim(example.ENG)}", "KOR" : "${word_trim(example.KOR)}"}`);
          example_html += `
            <li id="wordbtn_example_${j}">
              <div class="animate__animated exam_edit_icon">
                <i class="fa-solid fa-pen ft7 ftb text_green" onclick="zoomin(this); edit_modal1_openbtn_click('second_3box_center', '${word.wordbook_title}', '', '${word.word_id}', '', '', '${j}', '${word_trim(example.ENG)}', '${word_trim(example.KOR)}');"></i>
                <i class="fa-solid fa-trash-can ft7 ftb text_red" onclick="zoomin(this); remove_modal1_openbtn_click('second_3box_center', '${word.wordbook_title}', '${word.word_id}', '', '${j}', '${word_trim(example.ENG)}');"></i>
              </div>  
              <span id="wordbtn_example_${j}_eng" class="animate__animated" onclick="touch_block_action(this); tts_any(this.innerText, 1);">${word_recover(example.ENG)}</span>
              <br>
              <span>${word_recover(example.KOR)}</span>                           
            </li>`;    
          j += 1;    
        }        
        console.log(example_json);
      };
      document.getElementById('example_json').innerText = `[${example_json}]`;
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