// 테이블 이름 정리/복구
function table_name_trim(table_name) {
  var table_name = table_name
    .trim()
    .replace(/ /gi, '$_$')
    .replace(/\./gi, '$dot$')
    .replace(/\!/gi, '$exc$')
    .replace(/\#/gi, '$sp$')
    .replace(/\&/gi, '$aa$');
  return table_name;
}

function table_name_recover(table_name) {
  var table_name = table_name    
    .replace(/\$\_\$/gi, ' ')
    .replace(/\$dot\$/gi, '.')
    .replace(/\$exc\$/gi, '!')
    .replace(/\$sp\$/gi, '#')
    .replace(/\$aa\$/gi, '&');
  return table_name;
}

//

async function wordbook_reading(time){          
  var token = getCookie('authorize-access-token');
  console.log('promise start');      
  det_login(token, 'execute');
  await sleep(1);
  // var promise = new Promise((resolve,reject)=>{
  //   det_login(token, 'execute');
  //   console.log('promise start');      
  //   resolve();
  // });
  
  // promise.then(()=>{
    console.log('promise/then start');      
    fetch("/wordbook", {method : 'post'}).then((response)=>response.json()).then((results)=>{
      var table_name = `Tables_in_${getCookie("client_ID")}`;            
      let add_html = '';
      let i = 0;
      for (let data of results){        
        add_html += `<div class="wordbook_wrap shadow-sm">
                        <div class="wordbook_text" onclick="touch_block_action(document.getElementById('wordbook_title_span_${i}')); wordlist_reading(${i},'','initial');">                                          
                          <div id="wordbook_title_${i}" class="wordbook_title ft8 ftb animate__animated"><span id="wordbook_title_span_${i}" name="wordbook_title">${table_name_recover(data[table_name])}</span></div>                        
                          <div id="wordbook_hashtag" class="wordbook_hashtag ft10 text_gray"> <span>#오늘도즐거워 #람쥐귀여워 </span></div>                                                              
                        </div>                      
                        <div class="wordbook_option">
                          <i class="fa-solid fa-pen ft7 ftb text_green" data-bs-toggle="modal" data-bs-target="#edit_modal" onclick="edit_modal1_openbtn_click('second_1box_center', '${table_name_recover(data[table_name])}');"></i>                                                   
                        </div>
                        <div class="wordbook_option">
                          <i class="fa-solid fa-trash-can ft7 ftb text_red" data-bs-toggle="modal" data-bs-target="#remove_confirm" onclick="remove_modal1_openbtn_click('second_1box_center', '${table_name_recover(data[table_name])}');"> </i>
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
}
  
  function remove_wordbook_num(num){
    var wordbook_num = num;
    console.log(wordbook_num);
    document.getElementById('remove_btn').setAttribute("onclick", `remove_wordbook_click(${wordbook_num});`);
  }
  
      // functions
  
  async function add_wordbook_click(){
    var title_name = table_name_trim(document.getElementById('add_wordbook_title').value);
    var wordbook_title = {title : title_name};
    console.log(wordbook_title);
    await fetch("/wordbook/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
      console.log(results);        
    })
    wordbook_reading('');  
  }
  
  
  async function edit_wordbook_click(number){
    console.log('edit wordbook detected');
    var old_title = document.getElementById(`wordbook_title_${number}`).innerText;
    var new_title = document.getElementById(`edit_wordbook_title_${number}`).value;
    let wordbook_title = {oldtitle : old_title, newtitle : new_title };
    console.log(wordbook_title);
    await fetch("/wordbook/edit", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
      console.log(results);
    })
    wordbook_reading('');
  }
  
    // Wordlist - 2box
  
      // open, close 
  
  
  
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
          add_contents_html += `
                </ul>
                <div class="wordlist_toolbar" style="display : flex; width : 30%; margin-left : 70%;">          
                  <div style="display : block; padding : 1rem; margin-left : 0.5rem;"><i class="fa-solid fa-pen ft5 ftb text_green animate__animated " data-bs-toggle="modal" data-bs-target="#edit_modal" onclick="touch_icon_action(this); edit_modal1_openbtn_click('second_2box_center', '${wordbook_title.title}', '${result.ID}', '${result.ENG}', '${result.KOR}');"></i></div>                              
                  <div style="display : block; padding : 1rem; margin-left : 0.5rem;"><i class="fa-solid fa-trash-can ft5 ftb text_red animate__animated " data-bs-toggle="modal" data-bs-target="#remove_confirm" onclick="touch_icon_action(this); remove_modal1_openbtn_click('second_2box_center', '${wordbook_title.title}', '${result.ID}', '${result.ENG}');"></i></div>                            
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

  // async function edit_wordbook_click(number){
  //   console.log('edit wordbook detected');
  //   let wordbook_title = {oldtitle : document.getElementById(`wordbook_title_${number}`).innerText, newtitle : document.getElementById(`edit_wordbook_title_${number}`).value};
  //   console.log(wordbook_title);
  //   await fetch("/wordbook/edit", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
  //     console.log(results);
  //   })
  //   wordbook_reading('');
  // }
  
  function s1_box_click(){
    hidden(second_2box_center);
    hidden(second_3box_center);
  }
  
  function s2_box_click(){
    hidden(second_3box_center);
  }