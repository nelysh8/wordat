function cartoon(){
    console.log('cartoon start');
    document.getElementById('today_cartoon').innerHTML = '';
    fetch("/cartoon", {method : 'post'}).then((response)=>response.json()).then((results)=>{
      console.log(results);
      if (results.cartoon_peanuts !== '') {
        document.getElementById('today_cartoon').innerHTML += `
          <div class="cartoon_item">
            <div class="cartoon_title"><span class="ft8 ftbb">Peanuts</span></div>
            <div class="cartoon_image"><img src='${results.cartoon_peanuts}' onclick="window.open('${results.cartoon_peanuts}');"></div>
          </div>  
        `;
      }
      if (results.cartoon_calvin !== '') {
        document.getElementById('today_cartoon').innerHTML += `
          <div class="cartoon_item">
            <div class="cartoon_title"><span class="ft8 ftbb">Calvin and Hobbes</span></div>
            <div class="cartoon_image"><img src='${results.cartoon_calvin}' onclick="window.open('${results.cartoon_calvin}');"></div>
          </div>  
        `;
      }
      if (results.cartoon_garfield !== '') {
        document.getElementById('today_cartoon').innerHTML += `
          <div class="cartoon_item">
            <div class="cartoon_title"><span class="ft8 ftbb">Garfield</span></div>
            <div class="cartoon_image"><img src='${results.cartoon_garfield}' onclick="window.open('${results.cartoon_garfield}');"></div>
          </div>  
        `;
      }
      // document.getElementById('today_cartoon').innerHTML = `
      // <img src='${results.cartoon_calvin}'><img src='${results.cartoon_garfield}'>`;
    });
  }
  
  async function paper(){
    console.log('paper start');
    document.getElementById('today_paper').innerHTML = '';
    fetch("/paper", {method : 'post'}).then((response)=>response.json()).then((results)=>{
      console.log(results);
      if (results.word.title !== '') {
        document.getElementById('today_paper').innerHTML += `
          <div class="paper_item">
            <div class="paper_type" style="background-color: #071c2e; color : white;"><span class="ft8 ftbb">Today's word</span></div>
            <div class="paper_title"><span class="ft6 text_red ftbb" onclick="window.open('https://www.britannica.com/dictionary/eb/word-of-the-day');">${results.word.title}</span></div>
            <div class="paper_subtitle"><span class="ft9 text_silver">${results.word.pronun}</span><span class="ft9 text_pink">${results.word.part}</span></div>
            <div class="paper_detail">
              <div class="paper_img">
                <img src="${results.word.image_link}">
                <span class="ft10">${results.word.image_title}</span>
              </div>
              <div class="paper_explain">
                <span class="ft9 ftb">${results.word.definition}</span>
                <ul>
                  <li><span class="ft10">${results.word.example}</span></li>
                </ul>
              </div>
            </div>
          </div>  
        `;
      }
      if (results.urban.word_title !== '') {
        var examples = results.urban.word_example.split('\n\n');
        var example_line = '';
        for (example of examples) {                
          console.log(example);
          if (example !== '') {
            example_line += `<li><span class="ft10">${example.replace(/\n/gi, '<br>')}</span></li>`;
          }        
        }
        document.getElementById('today_paper').innerHTML += `
          <div class="paper_item">
            <div class="paper_type" style="background-color: #134fe5; color : #efff00;"><span class="ft8 ftbb">Today's slang</span></div>
            <div class="paper_title"><span class="ft6 ftbb" style="color : #134fe5;" onclick="window.open('https://www.urbandictionary.com/define.php?term=${results.urban.word_title}');">${results.urban.word_title}</span></div>          
            <div class="paper_detail">            
              <div class="paper_explain">
                <span class="ft9 ftb">${results.urban.word_meaning.replace(/\n/gi, '<br>')}</span>
                <ul>
                  ${example_line}
                </ul>
              </div>
            </div>
          </div>  
        `;
      }
      if (results.history.title !== '') {      
        document.getElementById('today_paper').innerHTML += `
          <div class="paper_item">
            <div class="paper_type" style="background-color: #071c2e; color : white;"><span class="ft8 ftbb">On This Day</span></div>
            <div class="paper_img" style="text-align: center; margin : 0.1rem auto 1rem auto;">
              <img src="${results.history.image_link}" style="width : 100%;" onclick="window.open('https://www.britannica.com/on-this-day/${results.history.date}');">
            </div>
            <div class="paper_title"><span class="ft8 ftb" style="color : #134fe5;">${results.history.title}</span></div>          
            <div class="paper_detail">            
              <div class="paper_explain" style="margin-top : 0.5rem;">
                <span class="ft9">${results.history.description}</span>
              </div>
            </div>
          </div>  
        `;
      }
      if (results.quote.quote_text !== '') {
        document.getElementById('today_paper').innerHTML += `
          <div class="paper_item">
            <div class="paper_type" style="background-color: #e8dbc9; color : #513c2d;"><span class="ft8 ftbb">Today's quote</span></div>          
            <div class="paper_detail" onclick="window.open('https://www.goodreads.com/quotes');">            
              <div class="paper_explain" id="quote_explain" style="overflow: auto;">`;
        if ((results.quote.image_link !== undefined) && (results.quote.image_link !== '')){
          console.log(results.quote.image_link);
          document.getElementById('quote_explain').innerHTML += `
                <div class="paper_img">
                  <img src="${results.quote.image_link}" style="float : left; height: 7rem; margin-right : 1rem;">              
                </div>`;
        }
        document.getElementById('quote_explain').innerHTML += `              
                <p styel="text-align : justify;"
                  <span class="ft9 ftb">${results.quote.quote_text}</span>
                </p>
                <p style="text-align : right;">
                  <span class="ft9" > - ${results.quote.author}</span>              
                </p>              
              `;
        document.getElementById('today_paper').innerHTML += `
              </div>
            </div>
          </div>  
        `;
      }
    });
  };
  
  function ebook_list(num){
    console.log('ebook_list start');
    document.getElementById('today_ebook').innerHTML = '';  
    var view_num;
    if (num > 39) {
      view_num = {'view_num' : 39};
    } else {
      view_num = {'view_num' : num};
    }
    fetch("/ebook_list", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(view_num)}).then((response)=>response.json()).then((results)=>{    
      if ((results !== null) && (results[0].title !== '')) {          
        for (result of results) {        
          // console.log(result);
          document.getElementById('today_ebook').innerHTML += `        
            <div id="ebook_item" style="width : 90%; margin : auto; margin-top : 1rem; margin-bottom : 0rem; padding : 0.5rem; border-radius: 4px; overflow:auto;"> 
              <div class="ebook_img" style="float:left; margin-right : 1rem;">
                <img src="${result.image_link}" onclick="window.open('https://www.gutenberg.org/cache/epub/${result.ebook_num}/pg${result.ebook_num}-images.html');" style="min-width : 5rem; max-width:6rem; min-height: 8rem; max-height:9rem;">          
              </div>
              <div class="ebook_title">
                <span class="ft8 ftb" style="color:#a01f13;" onclick="open_ebook(${result.ebook_num});">${result.title}</span>
                <br>
                <span class="ft9 text_black">${result.author}</span>
                <br>
                <div class="badge text-wrap bg_firebrick ft10" style="margin : auto;">HIT : ${result.hit}</div>                            
              </div>          
            </div>
          `;
        }      
        document.getElementById('today_ebook').innerHTML += `        
            <span class="hidden_text" id="ebook_view_num">${num}</span>
            `;
      }    
    });
  }

  function open_ebook(ebook_num){        
    var ebook_contents = document.getElementById('third_1box_contents');
    var contents = ''
    var ebook_num = {'ebook_num' : ebook_num};
    var chunks = [];    

    ebook_contents.innerHTML = `<lottie-player src="https://assets4.lottiefiles.com/private_files/lf30_P60IO4.json" background="transparent"  speed="1"  style="width: 50%; margin : auto;"  loop  autoplay></lottie-player>`;
    third_1box_open();

  
    fetch("/open_ebook", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(ebook_num)}).then((response)=>response.json()).then((results)=>{
      console.log(results);
      if (results.chapter.num !== 'error') {        
        contents += `
          <div class="ebook_read_title ft_noto" style="display:flex; margin-bottom : 5rem;"> 
            <img src='${results.cover.img_link}' style='width:50%; margin-right : 1rem;'>
            <div style="margin-top : auto; margin-bottom : auto;"
              <p class="ft4 ftbb">${results.cover.title}</p>
              <p class="ft5 ftbb" style="text-align : right">-${results.cover.author}</p>        
            </div>
          </div>
          `;
        
        for (chapt of results.chapter) {    
          contents += `
          <div style="text-align : center; margin : 2rem auto 2rem auto">
            <span class="ft7 ftb ft_noto" style="line-height : 180%;">${chapt.title}</span><br>
          </div>`;    
                
          for (part of chapt.sentence) {             
            chunks = [];
            var doc = nlp(part);     
            chunks = doc.clauses().out('array');                        
            for (chunk of chunks) {
              contents += `<span class="ft8 ft_noto" onclick="touch_block_action(this); tts_any(this.innerText, 1)">${chunk} </span>`;
              // console.log(chunk);
            }
            contents += `<br>`;
          }            
        }
        ebook_contents.innerHTML = contents;
      } else {
        contents += `        
            <div class="div_linked_book">
                <iframe id="linked_ebook" src="${results.chapter.link}" seamless></iframe>        
            </div>
        `;          
        // https://www.wikipedia.org/wiki/Vincent_van_Gogh
        ebook_contents.innerHTML = contents;
      }
    })
  }
