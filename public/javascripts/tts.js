//  Google tts 

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
    } else if (req_pos === 'third_1box_center') {
      input_value = document.getElementById('t1_box_main_search_input').value;
      det_value = input_value.replace(/ /gi,'').replace(/\n/gi,'');
      res_value = document.getElementById('t1_box_Sres_ENG').innerText;
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

    let rate;

    if ((get_config_cookie() !== null) && (get_config_cookie() !== undefined)) {
      config = get_config_cookie();
      if (speed === 1) {
        rate = Number(config[1])*0.02;
      } else {
        rate = Number(config[2])*0.02;
      }      
    } else {
      rate = speed;
    }     

    console.log('------------tts detected------------------');
    console.log('sentence : ' + sentence);

    var req_value = {sentence : sentence};
    
    fetch('/tts', {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(req_value)}).then((response)=>response.json()).then((result)=>{    
      console.log(result);
      alert(result.audioContent);
      var Sound = new Audio(`data:audio/mp3;base64,${result.audioContent}`);
      Sound.playbackRate = rate;
      Sound.play().then(()=>{        
      // new Audio(`data:audio/mp3;base64,${result.audioContent}`).play().then(()=>{        
        console.log('sound ok');
      })
      .catch(error => {
        console.log('sound err');
      });      
    })
  }

  function tts_any(text, speed){
    let sentence = text;
    let rate;

    if ((get_config_cookie() !== null) && (get_config_cookie() !== undefined)) {
      config = get_config_cookie();
      if (speed === 1) {
        rate = Number(config[1])*0.02;
      } else {
        rate = Number(config[2])*0.02;
      }      
    } else {
      rate = speed;
    }   
    
    console.log('------------tts detected------------------');
    console.log('sentence : ' + sentence);

    var req_value = {sentence : sentence};
    fetch('/tts', {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(req_value)}).then((response)=>response.json()).then((result)=>{    
      console.log(result);
      var Sound = new Audio(`data:audio/mp3;base64,${result.audioContent}`);
      Sound.playbackRate = rate;
      Sound.play().then(()=>{        
      // new Audio(`data:audio/mp3;base64,${result.audioContent}`).play().then(()=>{        
        console.log('sound ok');
      })
      .catch(error => {
        console.log('sound err');
      });      
    })    
  }
  
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

