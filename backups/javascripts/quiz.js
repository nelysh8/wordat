function testquiz(hint){
    document.getElementById('ts_quiz_wrap').innerHTML += `<lottie-player id="ts_quiz_loading" src="https://assets8.lottiefiles.com/packages/lf20_5nLqa4.json"  background="transparent"  speed="1"  style="width: 30%; margin : auto; margin-top : 2rem;"  loop  autoplay></lottie-player>`;
    var write_kor = document.getElementById('ts_quiz_kor');
    var write_eng = document.getElementById('ts_quiz_eng');
    // write_kor.style.display = 'none';
    // write_eng.style.display = 'none';


    var eng_parts;
    var correct_answer;   
    var hint = hint;
    console.log('hint_num : ' + hint);
    if (hint === 1) {
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
          document.getElementById('ts_quiz_loading').remove();
        //   write_kor.style.display = 'block';
        //   write_eng.style.display = 'block';

          console.log(results);      
          write_kor.innerHTML = `<span class="ft6 ftb">${results.KOR}</span><span class="ft6 ftb hidden_text" id="answer_sentence">${results.ENG}</span><span class="ft6 ftb hidden_text" id="answer_wordbook_title">${results.WORDBOOK_TITLE}</span><span class="ft6 ftb hidden_text" id="answer_word_id">${results.ID}</span>`;
        //   write_eng.innerHTML = `<form action="#">`;
          eng_trim = results.ENG.replace(/ /gi, ' ');
          eng_parts = eng_trim.split(' ');  
          console.log(eng_parts);
          var i = 1;
          var input_num = 0;
          var part_num = 0;
          write_eng.innerHTML = '';          
          for (part of eng_parts) {                      
            part_num += 1;  

            var display_word = '';        // word 전체를 __'___. 형태로 변경 -> 아래 -> a__'____. 형태로 변경
            var trim_word_start, trim_word_strpt; // word 전체에서 '. 등을 제외한 첫자를 확인
            var regex = /[.?',!"-$+;/=]/;      

            for (let j = 0; j<part.length; j++) {
                if (regex.test(part.substr(j,1))) {                            
                    display_word += part.substr(j,1);
                } else {                            
                    display_word += '_';              
                }
            }          

            trim_word_start = part.replace(/[.?',!"-$+;/=]/gi, '').substr(0,hint);          
            trim_word_strpt = part.replace(/[.?',!"-$+;/=]/gi, '').indexOf(trim_word_start) + trim_word_start.length;                     

            var include_det = part.substr(0, trim_word_strpt).length - part.substr(0, trim_word_strpt).replace(/[.?',!"-$+;/=]/gi, '').length;

            if (include_det > 0) {
                trim_word_strpt += include_det 
            }                        
            
            if (part.length > trim_word_strpt) {
                console.log('남은 철자를 보여줍니다');
              input_num += 1;
              
              display_word = part.substr(0, trim_word_strpt) + display_word.substr(trim_word_strpt,part.length-trim_word_strpt);

            //   if (trim_word_strpt === ) {
            //     display_word = part.substr(0,hint) + display_word.substr(hint,part.length-hint);
            //   } else {
            //     display_word = display_word.substr(0,trim_word_strpt) + part.substr(trim_word_strpt, hint) + display_word.substr(trim_word_strpt + hint, part.length - (trim_word_strpt+hint) );
            //   }         

              console.log('display_word : ' + display_word);
            //   write_eng.innerHTML += `바보`;   
            //   console.log(write_eng.innerHTML);

              write_eng.innerHTML += `              
                <span class="ft6 ftb hidden_text" id="answer_all_text_${part_num}">${part}</span>
                <span class="ft6 ftb hidden_text" id="answer_text_${input_num}">${part.substr(trim_word_strpt,display_word.length-trim_word_strpt)}</span>
                <span class="ft6 ftb hidden_text" id="answer_underbar_${input_num}">${display_word.substr(trim_word_strpt,display_word.length-trim_word_strpt)}</span>            
                <span class="ft6 ftb" id="answer_vis_text_${part_num}">${display_word.substr(0,trim_word_strpt)}</span>
                <input type="text" class="ft6 ftb shadow-sm quiz_inputs" id="quiz_input_${input_num}" style="width:0; height:0;" placeholder="${display_word.substr(trim_word_strpt,display_word.length-trim_word_strpt)}" required><span class="ft6 ftb"> </span>`;             
                console.log('남은 철자를 입력했습니다');
                
                        
  
            //   var left_length = part.length-1;          
            //   write_eng.innerHTML += `          
            //     <span class="ft6 ftb hidden_text" id="part_text_${i}" >${part.substr(1,)}</span>
            //     <span class="ft6 ftb hidden_text" id="part_underbar_${i}" >${'_'.repeat(left_length)}</span>
            //     <span class="ft6 ftb">${part.substr(0,1)}</span><input type="text" class="ft6 ftb shadow-sm quiz_inputs" id="quiz_input_${i}" style="height:0; width:0;" placeholder="${'_'.repeat(left_length)}" required><span class="ft6 ftb"> </span>`;             
            //   var part_text = document.getElementById(`part_text_${i}`);
            //   var part_underbar = document.getElementById(`part_underbar_${i}`);
            //   var quiz_input = document.getElementById(`quiz_input_${i}`);
            //   var script = document.createElement('script');
            //   script.async = true;   
            //   script.text = `
            //     var quiz_input_detector_${i} = document.getElementById('quiz_input_${i}');
            //     quiz_input_detector_${i}.addEventListener("keyup", e => {
            //       console.log(e);
            //     });
            //   `;
            //   document.body.appendChild(script);
            //   console.log(quiz_input.style);
            //   console.log((part_text.clientHeight) + "px");
            //   console.log((part_text.clientWidth) + "px");
            //   quiz_input.style.maxHeight = (part_text.clientHeight-2) + "px";           
            //   quiz_input.style.minHeight = (part_underbar.clientHeight-2) + "px";           
            //   quiz_input.style.maxWidth = (part_text.clientWidth) + "px";          
            //   quiz_input.style.minWidth = (part_underbar.clientWidth) + "px";      
                
            } else {
              input_num += 1;
              console.log('다 보여줬습니다');
              write_eng.innerHTML += `
                <span class="ft6 ftb hidden_text" id="answer_all_text_${part_num}">${part}</span>              
                <span class="ft6 ftb hidden_text" id="answer_text_${input_num}"></span>
                <span class="ft6 ftb hidden_text" id="answer_underbar_${input_num}"></span>            
                <span class="ft6 ftb" id="answer_vis_text_${part_num}">${part}</span><span class="ft6 ftb"> </span>
                <input type="text" class="ft6 ftb shadow-sm quiz_inputs" id="quiz_input_${input_num}" style="display:none;" placeholder="" required>`;             
            }                   
            i += 1;          
  
            var part_text = document.getElementById(`answer_text_${input_num}`); // 기입해야할 원문
            var part_underbar = document.getElementById(`answer_underbar_${input_num}`); // 기입해야할 원문의 __ 변환문
            var quiz_input = document.getElementById(`quiz_input_${input_num}`);              

            console.log(`id : ${input_num} / ${part_num}`);
            console.log(`기입해야할 원문 : ${part_text.innerHTML}`, `기입해야할 언더바 : ${part_underbar.innerHTML}`);
            
            
            if (part_text.innerHTML === '') {
              console.log("part_text '' : " +part_text.innerHTML);
              quiz_input.style.maxHeight = 0;           
              quiz_input.style.minHeight = 0;           
              quiz_input.style.maxWidth = 0;          
              quiz_input.style.minWidth = 0;                    
            } else {
              console.log(part_text.innerHTML);
              console.log(part_text.clientWidth);
              console.log(part_underbar.innerHTML);
              console.log(part_underbar.clientWidth);
              quiz_input.style.maxHeight = (part_text.clientHeight-2) + "px";           
              quiz_input.style.minHeight = (part_underbar.clientHeight-2) + "px";           
              quiz_input.style.maxWidth = (part_text.clientWidth) + "px";          
              quiz_input.style.minWidth = (part_underbar.clientWidth) + "px";                    
            }           
          }
          write_eng.innerHTML += `
            <span class="ft6 ftb hidden_text" id="part_num" >${part_num}</span>
            <span class="ft6 ftb hidden_text" id="input_num" >${input_num}</span>
            <span class="ft6 ftb hidden_text" id="hint_num">${hint}</span>
            <span class="ft6 ftb hidden_text" id="try_num">0</span>`
          write_eng.innerHTML += `</form>`;                 
        })
      });
    } else if (hint === 2) {
      console.log('hint start');
      var part_num = Number(document.getElementById('part_num').innerHTML);
      var input_num = Number(document.getElementById('input_num').innerHTML);
      console.log(part_num, input_num);
      for (let part_i=0; part_i<part_num; part_i++) {
        var part_all = document.getElementById(`answer_all_text_${part_i+1}`);
        // console.log(part_all.innerHTML);
        var part_answer = document.getElementById(`answer_text_${part_i+1}`);
        var part_answer_vis_text = document.getElementById(`answer_vis_text_${part_i+1}`);      
        if (part_all.innerHTML.length > 1){              
          if (part_all.innerHTML.length === 2) {
            part_answer_vis_text.innerHTML += '<span class="ft6 ftb"> </span>';
          } else {
            part_answer.innerHTML = part_answer.innerHTML.substr(1,part_answer.innerHTML.length-1);
            part_answer_vis_text.innerHTML = part_all.innerHTML.substr(0,2);
          }
        } 
        // console.log(part_all.innerHTML, part_answer.innerHTML, part_answer_vis_text.innerHTML);    
      }
      for (let input_i=0; input_i<input_num; input_i++) {
        var answer_underbar = document.getElementById(`answer_underbar_${input_i+1}`);
        var quiz_input = document.getElementById(`quiz_input_${input_i+1}`);
        quiz_input.value= '';
        console.log('answer_underbar : ' + answer_underbar);
        if ((answer_underbar !== null) && (answer_underbar.innerHTML.length > 1)) {
          answer_underbar.innerHTML = answer_underbar.innerHTML.substr(1, answer_underbar.innerHTML.length-1);
          quiz_input.setAttribute('placeholder', `${answer_underbar.innerHTML}`)
        } else {
          if (answer_underbar !==null ) {
            answer_underbar.innerHTML = '';
          }        
          quiz_input.setAttribute('style', 'display:none;');
        }      
      }
      document.getElementById('hint_num').innerHTML = hint;
      console.log(hint);
    } else {
      var full_sentence = document.getElementById('answer_sentence').innerHTML;
      console.log(full_sentence);
      tts_any(full_sentence, 1);
      document.getElementById('hint_num').innerHTML = hint;
    }
  }
    
        
        
        
  
  
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
      //       temp_rr = results.map(row=>{
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
      
  
  async function submit_quiz_answer(){
    var input_num = Number(document.getElementById('input_num').innerHTML);
    var correct_answer;
    var input_answer = [];
    var check_sheet = [];
    var check_value;
    var point;
    console.log('input_num : ' + input_num);
    for (let i = 0; i<input_num; i++) {
      input_answer.push(document.getElementById(`quiz_input_${i+1}`).value);
      correct_answer = document.getElementById(`answer_text_${i+1}`).innerHTML;    
      console.log(input_answer[i]);
      if (input_answer[i] === correct_answer) {      
        check_sheet.push(1);
        console.log('input ' + (i+1) + ' - right answer ' + correct_answer + ' : result - correct');
      } else {
        check_sheet.push(0);
        console.log('input ' + (i+1) + ' - right answer ' + correct_answer + ' : result - incorrect');
      }
    }
    console.log(input_answer);
    console.log(check_sheet);
    console.log('correct : ' + input_num);
    check_value = check_sheet.reduce((a,b) => (a+b));
    console.log("sum : " + check_value);
  
    await sleep(0.3)
    
    var layer = document.getElementById('mainbody_layer');
    var layer_contents = document.getElementById('mainbody_layer_contents');
  
    if (check_value === input_num) {
      console.log(check_value + ' = ' + input_num);    
      layer_contents.innerHTML = `
        <img src="/images/lets-dance-snoopy.gif"> 
        <div class="mainbody_layer_text">
          <p><span class="text_red ft3 ftbb"> Correct! </span> </p>
          <p><span class="text_black ft_noto fr5 ftbb"> 정답입니다. </span></p>
        </div>`;    
      popup_main_layer(layer);    
      var wordbook_title = document.getElementById('answer_wordbook_title').innerHTML;
      var word_id = document.getElementById('answer_word_id').innerHTML;
      var quiz_num = 1;
      var quiz_result = Number(document.getElementById('hint_num').innerHTML);
      var req_text = {
        'wordbook_title' : wordbook_title,
        'word_id' : word_id,
        'quiz_num' : quiz_num,
        'quiz_result' : quiz_result
      };
      console.log(req_text);
      fetch("/wordbook/quiz_result", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(req_text)}).then((response)=>response.json()).then((results)=>{
        console.log(results);
      });
      document.getElementById('try_num').innerHTML = 1;  
      testquiz(1);
    } else {
      console.log(check_value + ' =/ ' + input_num);    
      layer_contents.innerHTML = `
        <img src="/images/snoopy-sad.gif"> 
        <div class="mainbody_layer_text">
          <p><span class="text_red ft3 ftbb"> incorrect! </span> </p>
          <p><span class="text_black ft_noto fr5 ftbb"> ${input_num - check_value}곳만 다시 생각해보세요. </span></p>
        </div>`;
      
      popup_main_layer(layer);
      var wordbook_title = document.getElementById('answer_wordbook_title').innerHTML;
      var word_id = document.getElementById('answer_word_id').innerHTML;
      var quiz_num = 1;
      var quiz_result;
      if (Number(document.getElementById('try_num').innerHTML) === 0) {
        document.getElementById('hint_num').innerHTML = Number(document.getElementById('hint_num').innerHTML) + 1;
        quiz_result = Number(document.getElementById('hint_num').innerHTML);
      } else {
        quiz_result = 1;
      }    
      var req_text = {
        'wordbook_title' : wordbook_title,
        'word_id' : word_id,
        'quiz_num' : quiz_num,
        'quiz_result' : quiz_result
      };
      console.log(req_text);
      fetch("/wordbook/quiz_result", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(req_text)}).then((response)=>response.json()).then((results)=>{
        console.log(results);
      });
      document.getElementById('try_num').innerHTML = 1;
    }  
  }