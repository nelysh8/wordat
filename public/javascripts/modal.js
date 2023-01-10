// main box modal


function add_wordbook_click(){
  var title_name = table_name_trim(document.getElementById('add_wordbook_title').value);
  var wordbook_hashtag = word_trim(document.getElementById('add_wordbook_hashtag').value);
  var wordbook_title = {title : title_name, hashtag : wordbook_hashtag};
  console.log(wordbook_title);

  var token = getCookie('authorize-access-token');    
  det_login(token, 'execute')
  .then((data)=>{
    fetch("/wordbook/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(wordbook_title)}).then((response)=>response.json()).then((results)=>{
      console.log(results);        
    })
    wordbook_reading('');  
  })
  .catch((data)=>{
    console.log('promise error');
    console.log(data);      
  })
}

function modal1_openbtn_click(position) {
    console.log('modal1_openbtn_click start');
    var client_ID = getCookie("client_ID");
    var table_name = `Tables_in_${getCookie("client_ID")}`;

    var req_pos = position;  
    var wim_title = document.getElementById('wim_title');
    var dropdown_list = '';
    var dropdown_menu = document.getElementById("wim_dropdown_wordbook");
    var dropdown_button = document.getElementById("wim_dropdown_btn");  
    var selected_wordbook = dropdown_button.innerText;  
    var pre_selected_wordbook = getCookie("pre_selected_wordbook");
    
    var word_id = '';

    var token = getCookie('authorize-access-token');    
    det_login(token, 'execute')
    .then((data)=>{    

      if (req_pos === 'mainbox_center') {
        console.log('mainbox modal1 starting');
        wim_title.innerText = 'Add words to the wordbook';                
        document.getElementById("wim_sumbit_btn").setAttribute('onclick', "wim_submit_btn_click('mainbox_center')");
        document.getElementById("toggle_row").style.display = 'block';    
    
        document.getElementById("wim_input_eng").value = document.getElementById('Sres_ENG').innerText;
        document.getElementById("wim_input_kor").value = document.getElementById('Sres_KOR').innerText;    
          
        fetch("/wordbook", {method : 'post'}).then((response)=>response.json()).then((results)=>{              
          console.log('dropdown creating');
          var table_list = [];
          
          for (let result of results){
            dropdown_list += `<li><a class="dropdown-item" href="#" onclick="dropdown_wordbooklist_click(this)">${table_name_recover(result.TABLE_NAME)}</a></li>`;
            table_list.push(table_name_recover(result.TABLE_NAME));
          };
          dropdown_menu.innerHTML = dropdown_list;   
          console.log(results.length, selected_wordbook);
          if ((selected_wordbook === '') && (results.length === 0)) {                  
            // alert("단어장이 없습니다.");            
            document.getElementById('info_alert_contents_title').innerText = '단어장이 없습니다.';
            document.getElementById('info_alert_contents_explain').innerText = '단어장부터 만들어보세요.';
            document.getElementById('info_alert_btn').onclick= function(){
              zoomin(this); 
              document.getElementById('second_1box_bottom_line').click();
            };            
            document.getElementById('call_info_alert_modal').click();          
          } else if ((selected_wordbook === '') && (results.length === 1)) {
            dropdown_button.innerText = table_name_recover(results[0].TABLE_NAME);
            setCookie('pre_selected_wordbook', dropdown_button.innerText);
            document.getElementById('call_wim_modal').click();
          } else if ((selected_wordbook === '') && (results.length > 0) && (pre_selected_wordbook !== '') && (table_list.includes(pre_selected_wordbook))){              
            dropdown_button.innerText = pre_selected_wordbook;      
            setCookie('pre_selected_wordbook', dropdown_button.innerText);
            document.getElementById('call_wim_modal').click();
          } 
          document.getElementById('call_wim_modal').click();
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
          var table_list = [];
          
          for (let result of results){
            dropdown_list += `<li><a class="dropdown-item" href="#" onclick="dropdown_wordbooklist_click(this)">${table_name_recover(result.TABLE_NAME)}</a></li>`;
            table_list.push(table_name_recover(result.TABLE_NAME));
          };
          dropdown_menu.innerHTML = dropdown_list;   
          console.log(results.length, selected_wordbook);
          if ((selected_wordbook === '') && (results.length === 0)) {                  
            // alert("단어장이 없습니다.");            
            document.getElementById('info_alert_contents_title').innerText = '단어장이 없습니다.';
            document.getElementById('info_alert_contents_explain').innerText = '단어장부터 만들어보세요.';
            document.getElementById('info_alert_btn').onclick= function(){
              zoomin(this); 
              document.getElementById('second_1box_bottom_line').click();
            };            
            document.getElementById('call_info_alert_modal').click();          
          } else if ((selected_wordbook === '') && (results.length === 1)) {
            dropdown_button.innerText = table_name_recover(results[0].TABLE_NAME);
            setCookie('pre_selected_wordbook', dropdown_button.innerText);
            document.getElementById('call_wim_modal').click();
          } else if ((selected_wordbook === '') && (results.length > 0) && (pre_selected_wordbook !== '') && (table_list.includes(pre_selected_wordbook))){              
            dropdown_button.innerText = pre_selected_wordbook;      
            setCookie('pre_selected_wordbook', dropdown_button.innerText);
            document.getElementById('call_wim_modal').click();
          } 
          // console.log('dropdown creating');
          // console.log(results);
          // i=0;
          // j=0;
          // for (let result of results){
          //   dropdown_list += `<li><a class="dropdown-item" href="#" onclick="dropdown_wordbooklist_click(this)">${table_name_recover(result.TABLE_NAME)}</a></li>`;
          //   if (selected_wordbook === table_name_recover(result.TABLE_NAME)) { i+=1;};
          //   if (pre_selected_wordbook === table_name_recover(result.TABLE_NAME)) {j+=1;};
          // };
          // dropdown_menu.innerHTML = dropdown_list;         
          
          // if ((selected_wordbook !== '') && (i > 0)) {
          //   console.log('this?');
          //   dropdown_button.innerText = selected_wordbook;          
          // } else if ((selected_wordbook === '') && (results.length === 1)) {
          //   dropdown_button.innerText = results[0].TABLE_NAME;
          // } else if ((pre_selected_wordbook !== '') && (results.length > 0) && (j>0)) {
          //   dropdown_button.innerText = pre_selected_wordbook;      
          // };
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
        document.getElementById('call_wim_modal').click();
      }
    
      else if (req_pos === 'third_1box_center') {
        console.log('mainbox modal1 starting');
        wim_title.innerText = 'Add words to the wordbook';                
        document.getElementById("wim_sumbit_btn").setAttribute('onclick', "wim_submit_btn_click('third_1box_center')");
        document.getElementById("toggle_row").style.display = 'block';    
    
        document.getElementById("wim_input_eng").value = document.getElementById('t1_box_Sres_ENG').innerText;
        document.getElementById("wim_input_kor").value = document.getElementById('t1_box_Sres_KOR').innerText;    
          
        fetch("/wordbook", {method : 'post'}).then((response)=>response.json()).then((results)=>{              
          console.log('dropdown creating');
          var table_list = [];
          
          for (let result of results){
            dropdown_list += `<li><a class="dropdown-item" href="#" onclick="dropdown_wordbooklist_click(this)">${table_name_recover(result.TABLE_NAME)}</a></li>`;
            table_list.push(table_name_recover(result.TABLE_NAME));
          };
          dropdown_menu.innerHTML = dropdown_list;   
          console.log(results.length, selected_wordbook);
          if ((selected_wordbook === '') && (results.length === 0)) {                  
            // alert("단어장이 없습니다.");            
            document.getElementById('info_alert_contents_title').innerText = '단어장이 없습니다.';
            document.getElementById('info_alert_contents_explain').innerText = '단어장부터 만들어보세요.';
            document.getElementById('info_alert_btn').onclick= function(){
              zoomin(this); 
              document.getElementById('second_1box_bottom_line').click();
            };            
            document.getElementById('call_info_alert_modal').click();          
          } else if ((selected_wordbook === '') && (results.length === 1)) {
            dropdown_button.innerText = table_name_recover(results[0].TABLE_NAME);            
            setCookie('pre_selected_wordbook', dropdown_button.innerText);
            document.getElementById('call_wim_modal').click();
          } else if ((selected_wordbook === '') && (results.length > 0) && (pre_selected_wordbook !== '') && (table_list.includes(pre_selected_wordbook))){              
            dropdown_button.innerText = pre_selected_wordbook;      
            setCookie('pre_selected_wordbook', dropdown_button.innerText);
            document.getElementById('call_wim_modal').click();
          } 
        });                
      } 

    })
    .catch((data)=>{
      console.log('promise error');
      console.log(data);      
    })
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
    var dropdown_button = document.getElementById("wim_dropdown_btn");

    var token = getCookie('authorize-access-token');
    det_login(token, 'execute')
    .then((data)=>{
      if (req_pos === 'mainbox_center'){
        console.log(req_pos + ': wim_submit_btn_click start');
        setCookie('pre_selected_wordbook', dropdown_button.innerText);
  
        var word = {
          'wordbook_title' : table_name_trim(document.getElementById('wim_dropdown_btn').innerText), 
          'eng' : word_trim(document.getElementById('wim_input_eng').value), 
          'kor' : word_trim(document.getElementById('wim_input_kor').value)
        };
        fetch("/wordbook/word/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
          console.log(results);        
        });
      } else if (req_pos === 'second_2box_center'){
        console.log(req_pos + 'wim_submit_btn_click start');
        var word = {
          'wordbook_title' : table_name_trim(document.getElementById('wim_dropdown_btn').innerText), 
          'eng' : word_trim(document.getElementById('wim_input_eng').value), 
          'kor' : word_trim(document.getElementById('wim_input_kor').value)
        };
        fetch("/wordbook/word/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
          console.log(results);        
        });
        wordlist_reading('',table_name_recover(word.wordbook_title),'');
      } else if (req_pos === 'second_3box_center'){
        console.log(req_pos + 'wim_submit_btn_click start');            
    
        var word = {
          'wordbook_title' : table_name_trim(document.getElementById('s2_wordbook_title').innerText),
          'word_id' : word_trim(document.getElementById('s3_word_id').innerText),
          'exam_eng' : word_trim(document.getElementById('wim_input_eng').value), 
          'exam_kor' : word_trim(document.getElementById('wim_input_kor').value)
        };
        console.log(word);
        fetch("/wordbook/exam/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
          console.log(results);        
        });
        word_reading((document.getElementById('s3_word_id').innerText));  
      } else if (req_pos === 'third_1box_center'){
        console.log(req_pos + ': wim_submit_btn_click start');
        setCookie('pre_selected_wordbook', dropdown_button.innerText);
  
        var word = {
          'wordbook_title' : table_name_trim(document.getElementById('wim_dropdown_btn').innerText), 
          'eng' : word_trim(document.getElementById('wim_input_eng').value), 
          'kor' : word_trim(document.getElementById('wim_input_kor').value)
        };
        fetch("/wordbook/word/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
          console.log(results);        
        });
      } 
    })
    .catch((data)=>{
      console.log('promise error');
      console.log(data);      
    })
  }
  
  // remove modal
  
  function remove_modal1_openbtn_click(position, wordbook_title, word_id, word_eng, exam_id, exam_eng) {
    console.log('remove_modal1_openbtn_click start');
    var req_pos = position;  
    var wb_title = wordbook_title;
    var wd_id = word_id;
    if (word_eng !== undefined) {word = word_recover(word_eng);}
    var ex_id = exam_id;
    if (exam_eng !== undefined) {exam = word_recover(exam_eng);}
    var confirm_text = document.getElementById('confirm_text');    
    
    if (req_pos === 'second_1box_center'){
      console.log('second_1box remove_modal1 starting');
      confirm_text.innerHTML = `
        <p><span class="ft5 ftbb text_red">remove wordbook</span></p>
        <p><span class="ft7 ftbb">[${table_name_recover(wb_title)}]</span></p>
      `;
      document.getElementById("remove_btn").setAttribute('onclick', `remove_btn_click('${req_pos}', '${wb_title}');`);  
      document.getElementById('call_remove_modal').click();   
    } 
    
    else if (req_pos === 'second_2box_center'){
      console.log('second_2box remove_modal1 starting');
      confirm_text.innerHTML = `
        <p><span class="ft5 ftbb text_red">remove word</span></p>
        <p><span class="ft7 ftbb">[${word}]</span></p>
      `;      
      document.getElementById("remove_btn").setAttribute('onclick', `remove_btn_click('${req_pos}', '${wb_title}', '${wd_id}');`);     
      document.getElementById('call_remove_modal').click();   
    } 
    
    else if (req_pos === 'second_3box_center'){
      console.log('second_3box remove_modal1 starting');
      confirm_text.innerHTML = `
        <p><span class="ft5 ftbb text_red">remove example</span></p>
        <p><span class="ft7 ftbb">[${exam}]</span></p>
      `;            
      document.getElementById("remove_btn").setAttribute('onclick', `remove_btn_click('${req_pos}', '${wb_title}', '${wd_id}', '${ex_id}');`);    
      document.getElementById('call_remove_modal').click();   
    }    
  }
  
  function remove_btn_click(position, wordbook_title, word_id, exam_id){
    console.log('remove_btn_click detected');
    var req_pos = position;  
    var wb_title = wordbook_title;
    var wd_id = word_id;  
    var ex_id = exam_id;  
    
    var token = getCookie('authorize-access-token');
    det_login(token, 'execute')
    .then((data)=>{
      if (req_pos === 'second_1box_center'){
        var post_text = {title : wb_title};
        fetch("/wordbook/remove", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(post_text)}).then((response)=>response.json()).then((results)=>{
          console.log(results);
        })
        wordbook_reading('');
      }
      
      else if (req_pos === 'second_2box_center'){
        var post_text = {wordbook_title : wb_title, word_id : wd_id};
        fetch("/wordbook/word/remove/", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(post_text)}).then((response)=>response.json()).then((results)=>{
          console.log(results);
        })
        wordlist_reading('',table_name_recover(wb_title));
      }
      
      else if (req_pos === 'second_3box_center'){
        var post_text = {wordbook_title : wb_title, word_id : wd_id, exam_id : ex_id, exam_json : document.getElementById('example_json').innerText};
        fetch("/wordbook/exam/remove/", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(post_text)}).then((response)=>response.json()).then((results)=>{
          console.log(results);
        })
        word_reading(wd_id);
      }    
    })
    .catch((data)=>{
      console.log('promise error');
      console.log(data);      
    })    
  }

  // edit modal
  
  function edit_modal1_openbtn_click(position, wordbook_title, hashtag, word_id, word_eng, word_kor, exam_id, exam_eng, exam_kor) {
    console.log('edit_modal1_openbtn_click start');
    var req_pos = position;  
    var wb_title, wd_eng, wd_kor, ex_eng, ex_kor;
    var wb_title = wordbook_title;
    var wb_hashtag = hashtag;
    var wd_id = word_id;
    
    if (word_eng !== undefined) {wd_eng = word_recover(word_eng);}
    if (word_kor !== undefined) {wd_kor = word_recover(word_kor);}
    var ex_id = exam_id;
    if (exam_eng !== undefined) {ex_eng = word_recover(exam_eng);}
    if (exam_kor !== undefined) {ex_kor = word_recover(exam_kor);}
    var ex_json = document.getElementById('example_json').innerText;
    var title_text = document.getElementById('edit_modal_title');    

    console.log(ex_json);
    
    if (req_pos === 'second_1box_center'){
      console.log('second_1box edit_modal1 starting');
      title_text.innerText = `Edit Wordbook Title`;      
      document.getElementById("edit_wb_title_div").style.display = '';
      document.getElementById("edit_wb_title_text").placeholder = table_name_recover(wb_title);
      document.getElementById("edit_wb_title_text").value = table_name_recover(wb_title);
      document.getElementById("edit_wb_hashtag_div").style.display = '';
      document.getElementById("edit_wb_hashtag_text").placeholder = word_recover(wb_hashtag);
      document.getElementById("edit_wb_hashtag_text").value = word_recover(wb_hashtag);

      document.getElementById("edit_wd_eng_div").style.display = 'none';
      document.getElementById("edit_wd_kor_div").style.display = 'none';
      document.getElementById("edit_ex_eng_div").style.display = 'none';
      document.getElementById("edit_ex_kor_div").style.display = 'none';            
      
      document.getElementById("edit_btn").setAttribute('onclick', `edit_btn_click('${req_pos}', '${wb_title}');`);     
      document.getElementById('edit_btn_hidden').innerText = `edit_btn_click('${req_pos}', '${wb_title}');`;      
      document.getElementById('call_edit_modal').click();  
    } 
    
    else if (req_pos === 'second_2box_center'){
      console.log('second_2box edit_modal1 starting');
      title_text.innerText = `Edit Word`;
      document.getElementById("edit_wb_title_div").style.display = 'none';
      document.getElementById("edit_wb_hashtag_div").style.display = 'none';
      document.getElementById("edit_wd_eng_div").style.display = '';
      document.getElementById("edit_wd_eng_text").placeholder = wd_eng;
      document.getElementById("edit_wd_eng_text").value = wd_eng;
      document.getElementById("edit_wd_kor_div").style.display = '';
      document.getElementById("edit_wd_kor_text").placeholder = wd_kor;
      document.getElementById("edit_wd_kor_text").value = wd_kor;
      document.getElementById("edit_ex_eng_div").style.display = 'none';
      document.getElementById("edit_ex_kor_div").style.display = 'none';

      document.getElementById("edit_btn").setAttribute('onclick', `edit_btn_click('${req_pos}', '${wb_title}', '${wd_id}');`);     
      document.getElementById('call_edit_modal').click();
    } 
    
    else if (req_pos === 'second_3box_center'){
      console.log('second_3box edit_modal1 starting');
      title_text.innerText = `Edit Example`;        
      document.getElementById("edit_wb_title_div").style.display = 'none';
      document.getElementById("edit_wb_hashtag_div").style.display = 'none';
      document.getElementById("edit_wd_eng_div").style.display = 'none';
      document.getElementById("edit_wd_kor_div").style.display = 'none';
      document.getElementById("edit_ex_eng_div").style.display = '';
      document.getElementById("edit_ex_eng_text").placeholder = ex_eng;
      document.getElementById("edit_ex_eng_text").value = ex_eng;
      document.getElementById("edit_ex_kor_div").style.display = '';
      document.getElementById("edit_ex_kor_text").placeholder = ex_kor;
      document.getElementById("edit_ex_kor_text").value = ex_kor;

      document.getElementById("edit_btn").setAttribute('onclick', `edit_btn_click('${req_pos}', '${wb_title}', '${wd_id}', '${ex_id}');`);    
      document.getElementById('call_edit_modal').click();
    }    
  }
  
  function edit_btn_click(position, wordbook_title, word_id, exam_id){
    console.log('edit_btn_click detected');
    var req_pos = position;  
    var wb_title = wordbook_title;    
    var wd_id = word_id;    
    var ex_id = exam_id;
    var ex_json = document.getElementById('example_json').innerText;

    var token = getCookie('authorize-access-token');
    det_login(token, 'execute')
    .then((data)=>{
      if (req_pos === 'second_1box_center'){
        var post_text = {oldtitle : wb_title, newtitle : table_name_trim(document.getElementById('edit_wb_title_text').value), hashtag : word_trim(document.getElementById("edit_wb_hashtag_text").value)};      
        fetch("/wordbook/edit", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(post_text)}).then((response)=>response.json()).then((results)=>{
          console.log(results);
        })
        wordbook_reading('');
      }
      
      else if (req_pos === 'second_2box_center'){
        var post_text = {wordbook_title : wb_title, word_id : wd_id, word_eng : word_trim(document.getElementById("edit_wd_eng_text").value), word_kor : word_trim(document.getElementById("edit_wd_kor_text").value)};      
        console.log(document.getElementById("edit_wd_eng_text").value, document.getElementById("edit_wd_kor_text").value);
        fetch("/wordbook/word/edit/", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(post_text)}).then((response)=>response.json()).then((results)=>{
          console.log(results);
        })
        wordlist_reading('',table_name_recover(wb_title));
      }
      
      else if (req_pos === 'second_3box_center'){
        var post_text = {wordbook_title : wb_title, word_id : wd_id, exam_id : ex_id, exam_eng : word_trim(document.getElementById("edit_ex_eng_text").value), exam_kor : word_trim(document.getElementById("edit_ex_kor_text").value), exam_json : ex_json};      
        console.log(document.getElementById("edit_ex_eng_text").value, document.getElementById("edit_ex_kor_text").value);
        console.log(ex_json);
        console.log(JSON.parse(ex_json));
        fetch("/wordbook/exam/edit/", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(post_text)}).then((response)=>response.json()).then((results)=>{
          console.log(results);
        })
        word_reading(wd_id);
      }    
    })
    .catch((data)=>{
      console.log('promise error');
      console.log(data);      
    })
  }
