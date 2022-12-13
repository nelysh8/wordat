      
      const Search_DOC = document.querySelector(".searchbar");
      Search_Input = Search_DOC.querySelector("textarea");

      // const Set_TEXT = document.getElementById("Sres_ENG");
      // const Set_TEXT = document.getElementById("Sres_ENG");
      
      // const function
      


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
        
      Search_Input.addEventListener("keyup", e => {
        if(e.key === "Enter" && e.target.value.replace(/ /gi,'').replace(/\n/gi,'')) {                    
          var engs_org = e.target.value.replace(/\n$/,'');
          var engs_spl = e.target.value.replace('\n', ' ___ ').replace(/^\s+|\s+$/g,'').replace('  ',' ').split(' ');          
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
                engs_res += `<span onclick="Cambrg_search('${words}'); ">${words}</span> `;
              }              
            }

            doc.innerHTML += engs_res;
            re_popup();             
            // click_fadein(doc);        
            // iframe2_vis();
          }      
          
          TEST_add(engs_spl);
          trans_papago(engs_org);
          document.getElementById('link_yarn').setAttribute('href', encodeURI('https://getyarn.io/yarn-find?text=' + engs_org));
          document.getElementById('link_youglish').setAttribute('href', encodeURI('https://youglish.com/pronounce/' + engs_org + '/english?'));
          document.getElementById('link_google').setAttribute('href', encodeURI('https://www.google.com/search?q="' + engs_org +'"'));          
        }       
      });
      // map 사용해야 할 듯

    

<!-- Google tts -->


// 외부용
// api key : AIzaSyD_oAgCmJ_dbiGMxCefQ2m4LUOOQ-xBrpM
//https://texttospeech.googleapis.com/v1/text:synthesize
// 음성 config https://cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize#audioconfig
// 합성 음성 https://cloud.google.com/text-to-speech/docs/create-audio

  function tts(speed){
    
    var sentence = document.getElementById('main_input').value;     
    
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




<!-- Cambridge Search -->
      
      async function Cambrg_search(word){
        console.log('cambrg 1');
        // fetch("/websearch_cambrg", {method : 'post'}).then((response)=>{
        //   console.log(response.json());
        // });
        // document.getElementById('result_view').src= '/html/cambrg.html';
        

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
          console.log('cambrg 2');           
          result_view_html(result);
        }
        function data2(){
          console.log('Cambridge err');          
        }
      }      


  <!-- 상단 iframe 쓰기 -->

      function result_view_html(data){                     
        var doc = document.getElementById('body_contents');
        console.log(doc.innerHTML);
        // iframe1_vis();
        // click_fadein(document.getElementById('result_contents'));

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
        
      }

        //     meanings += `<div class="examples">
        //             <ul>`;
        //     for (let example of meaning.example) {            
        //       console.log(example);
        //       meanings += `<li>${example}</li`;
        //     };
        //     meanings += `</ul> </div> </div>`;
        //   } else {
        //     meanings += `</div>`;
        //   };          
        // };
        // console.log(meanings);
        // 
      

        // console.log(JSON.stringify(data));

        // document.getElementById('result_view').setAttribute('srcdoc', `<span class="ft1 ftbb"> word : ${data.word} 
        //   <br>
        //   pronounce : [${data.pronounce}]
        //   <br>
        //   <button onclick ="audio_pron.load(); audio_pron.play();"> link </button>
        //   <audio preload="none" id="audio_pron" controlslist="nodownload">
        //   <source type="audio/mpeg" src="https://dictionary.cambridge.org${data.pronounce_link}">            
        //   </audio> 
        //   <br>${meanings}`) ;

        //   <br>
        //   pronounce : [${data.pronounce}]
        //   <br>
        //   <button onclick ="audio_pron.load(); audio_pron.play();"> link </button>
        //   <audio preload="none" id="audio_pron" controlslist="nodownload">
        //   <source type="audio/mpeg" src="https://dictionary.cambridge.org${data.pronounce_link}">            
        //   </audio> 
        //   <br>` + meanings ;
        
    

<!-- papago translation -->
    
      function trans_papago(SENTC){
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
        iframe2_vis();
      }
    
    
    

<!-- popover -->
    

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

      