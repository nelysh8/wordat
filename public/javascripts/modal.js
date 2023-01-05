// main box modal

function modal1_openbtn_click(position) {
    console.log('modal1_openbtn_click start');
    var table_name = `Tables_in_${getCookie("client_email_chg").replace(/%24/gi, '$')}`;

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
          dropdown_list += `<li><a class="dropdown-item" href="#" onclick="dropdown_wordbooklist_click(this)">${result[table_name]}</a></li>`;
        };
        dropdown_menu.innerHTML = dropdown_list;   
        console.log(results.length, selected_wordbook);
        if ((selected_wordbook === '') && (results.length === 0)) {        
          dropdown_button.innerText = 'create' ;
          // selected_wordbook !!!!!! 워드북 만드는 화면으로
        } else if ((selected_wordbook === '') && (results.length === 1)) {
          dropdown_button.innerText = results[0][table_name];
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
          dropdown_list += `<li><a class="dropdown-item" href="#" onclick="dropdown_wordbooklist_click(this)">${result[table_name]}</a></li>`;
          if (selected_wordbook === result[table_name]) { i+=1;};
          if (pre_selected_wordbook === result[table_name]) {j+=1;};
        };
        dropdown_menu.innerHTML = dropdown_list;         
        
        if ((selected_wordbook !== '') && (i > 0)) {
          console.log('this?');
          dropdown_button.innerText = selected_wordbook;          
        } else if ((selected_wordbook === '') && (results.length === 1)) {
          dropdown_button.innerText = results[0][table_name];
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
  
    else if (req_pos === 'third_1box_center') {
      console.log('mainbox modal1 starting');
      wim_title.innerText = 'Add words to the wordbook';                
      document.getElementById("wim_sumbit_btn").setAttribute('onclick', "wim_submit_btn_click('third_1box_center')");
      document.getElementById("toggle_row").style.display = 'block';    
  
      document.getElementById("wim_input_eng").value = document.getElementById('t1_box_Sres_ENG').innerText;
      document.getElementById("wim_input_kor").value = document.getElementById('t1_box_Sres_KOR').innerText;    
        
      fetch("/wordbook", {method : 'post'}).then((response)=>response.json()).then((results)=>{              
        console.log('dropdown creating');
        
        for (let result of results){
          dropdown_list += `<li><a class="dropdown-item" href="#" onclick="dropdown_wordbooklist_click(this)">${result[table_name]}</a></li>`;
        };
        dropdown_menu.innerHTML = dropdown_list;   
        console.log(results.length, selected_wordbook);
        if ((selected_wordbook === '') && (results.length === 0)) {        
          dropdown_button.innerText = 'create' ;
          // selected_wordbook !!!!!! 워드북 만드는 화면으로
        } else if ((selected_wordbook === '') && (results.length === 1)) {
          dropdown_button.innerText = results[0][table_name];
        } else if ((selected_wordbook === '') && (results.length > 0) && (pre_selected_wordbook !== '') && (results.includes(pre_selected_wordbook))){              
          dropdown_button.innerText = pre_selected_wordbook;      
        } 
      });      
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
    } else if (req_pos === 'third_1box_center'){
      console.log(req_pos + ': wim_submit_btn_click start');
      var word = {
        'wordbook_title' : document.getElementById('wim_dropdown_btn').innerText, 
        'eng' : document.getElementById('wim_input_eng').value, 
        'kor' : document.getElementById('wim_input_kor').value
      };
      fetch("/wordbook/word/add", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(word)}).then((response)=>response.json()).then((results)=>{
        console.log(results);        
      });
    } 
  }
  
  // remove modal
  
  function remove_modal1_openbtn_click(position, wordbook_title, word_id, word_eng, exam_id, exam_eng) {
    console.log('remove_modal1_openbtn_click start');
    var req_pos = position;  
    var wb_title = wordbook_title;
    var wd_id = word_id;
    var word = word_eng;
    var ex_id = exam_id;
    var exam = exam_eng;
    var confirm_text = document.getElementById('confirm_text');    
    
    if (req_pos === 'second_1box_center'){
      console.log('second_1box remove_modal1 starting');
      confirm_text.innerText = `remove wordbook[${wb_title}]`;
      document.getElementById("remove_btn").setAttribute('onclick', `remove_btn_click('${req_pos}', '${wb_title}');`);     
    } 
    
    else if (req_pos === 'second_2box_center'){
      console.log('second_2box remove_modal1 starting');
      confirm_text.innerText = `remove word[${word}]`;
      document.getElementById("remove_btn").setAttribute('onclick', `remove_btn_click('${req_pos}', '${wb_title}', '${wd_id}');`);     
    } 
    
    else if (req_pos === 'second_3box_center'){
      console.log('second_3box remove_modal1 starting');
      confirm_text.innerText = `remove example[${exam}]`;        
      document.getElementById("remove_btn").setAttribute('onclick', `remove_btn_click('${req_pos}', '${wb_title}', '${wd_id}', '${ex_id}');`);    
    }
  }
  
  async function remove_btn_click(position, wordbook_title, word_id, exam_id){
    console.log('remove_btn_click detected');
    var req_pos = position;  
    var wb_title = wordbook_title;
    var wd_id = word_id;  
    var ex_id = exam_id;  
  
    if (req_pos === 'second_1box_center'){
      var post_text = {title : wb_title};
      await fetch("/wordbook/remove", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(post_text)}).then((response)=>response.json()).then((results)=>{
        console.log(results);
      })
      wordbook_reading('');
    }
    
    else if (req_pos === 'second_2box_center'){
      var post_text = {wordbook_title : wb_title, word_id : wd_id};
      await fetch("/wordbook/word/remove/", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(post_text)}).then((response)=>response.json()).then((results)=>{
        console.log(results);
      })
      wordlist_reading('',wb_title);
    }
    
    else if (req_pos === 'second_3box_center'){
    }
    
  }

  // edit modal
  
  function edit_modal1_openbtn_click(position, wordbook_title, word_id, word_eng, word_kor, exam_id, exam_eng, exam_kor) {
    console.log('edit_modal1_openbtn_click start');
    var req_pos = position;  
    var wb_title = wordbook_title;
    var wd_id = word_id;
    var wd_eng = word_eng;
    var wd_kor = word_kor;
    var ex_id = exam_id;
    var ex_eng = exam_eng;
    var ex_kor = exam_kor;
    var title_text = document.getElementById('edit_modal_title');    
    
    if (req_pos === 'second_1box_center'){
      console.log('second_1box edit_modal1 starting');
      title_text.innerText = `Edit Wordbook Title`;      
      document.getElementById("edit_wb_title_div").style.display = '';
      document.getElementById("edit_wb_title_text").placeholder = wb_title;
      document.getElementById("edit_wd_eng_div").style.display = 'none';
      document.getElementById("edit_wd_kor_div").style.display = 'none';
      document.getElementById("edit_ex_eng_div").style.display = 'none';
      document.getElementById("edit_ex_kor_div").style.display = 'none';      
      
      document.getElementById("edit_btn").setAttribute('onclick', `edit_btn_click('${req_pos}', '${wb_title}');`);     
    } 
    
    else if (req_pos === 'second_2box_center'){
      console.log('second_2box edit_modal1 starting');
      title_text.innerText = `Edit Word`;
      document.getElementById("edit_wb_title_div").style.display = 'none';
      document.getElementById("edit_wd_eng_div").style.display = '';
      document.getElementById("edit_wd_eng_text").placeholder = wd_eng;
      document.getElementById("edit_wd_kor_div").style.display = '';
      document.getElementById("edit_wd_kor_text").placeholder = wd_kor;
      document.getElementById("edit_ex_eng_div").style.display = 'none';
      document.getElementById("edit_ex_kor_div").style.display = 'none';

      document.getElementById("edit_btn").setAttribute('onclick', `edit_btn_click('${req_pos}', '${wb_title}', '${wd_id}');`);     
    } 
    
    else if (req_pos === 'second_3box_center'){
      console.log('second_3box edit_modal1 starting');
      title_text.innerText = `Edit Example`;        
      document.getElementById("edit_wb_title_div").style.display = 'none';
      document.getElementById("edit_wd_eng_div").style.display = 'none';
      document.getElementById("edit_wd_kor_div").style.display = 'none';
      document.getElementById("edit_ex_eng_div").style.display = '';
      document.getElementById("edit_ex_eng_text").placeholder = ex_eng;
      document.getElementById("edit_ex_kor_div").style.display = '';
      document.getElementById("edit_ex_kor_text").placeholder = ex_kor;

      document.getElementById("edit_btn").setAttribute('onclick', `edit_btn_click('${req_pos}', '${wb_title}', '${wd_id}', '${ex_id}');`);    
    }
  }
  
  async function edit_btn_click(position, wordbook_title, word_id, exam_id){
    console.log('edit_btn_click detected');
    var req_pos = position;  
    var wb_title = wordbook_title;
    var wd_id = word_id;    
    var ex_id = exam_id;
    
    if (req_pos === 'second_1box_center'){
      var post_text = {oldtitle : wb_title, newtitle : document.getElementById('edit_wb_title_text').value};      
      await fetch("/wordbook/edit", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(post_text)}).then((response)=>response.json()).then((results)=>{
        console.log(results);
      })
      wordbook_reading('');
    }
    
    else if (req_pos === 'second_2box_center'){
      var post_text = {wordbook_title : wb_title, word_id : wd_id, word_eng : document.getElementById("edit_wd_eng_text").value, word_kor : document.getElementById("edit_wd_kor_text").value};      
      console.log(document.getElementById("edit_wd_eng_text").value, document.getElementById("edit_wd_kor_text").value);
      await fetch("/wordbook/word/edit/", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(post_text)}).then((response)=>response.json()).then((results)=>{
        console.log(results);
      })
      wordlist_reading('',wb_title);
    }
    
    else if (req_pos === 'second_3box_center'){
    }
    
  }

  
