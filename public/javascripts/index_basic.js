


// main
      let i = 0;
      function test(){        
        fetch("/", {method : 'post'}).then((response)=>{
          console.log(response.json());
        });
        fetch("/", {method : 'post'}).then((response)=>response.json()).then((result)=>data(result));
            // return a.blog;
          //   return a;
          // });                
        function data(result){                    
          console.log(result[0]);
          const tmp = document.getElementById("test_place");          
          function addtext(){
            tmp.innerText += `\n제목${i}`;
            var engs = result[i].ENG.split(' ');
            tmp.innerText += `\n${result[i].ENG}`;
            tmp.innerText += `\n${engs}`;
            tmp.innerText += `\n${engs.length}`;
            for (let words of engs) {
              tmp.innerText += `\n${words}`;
            }
            tmp.innerText += `\n${result[i++].KOR}`; 
          }          
          addtext();
        }
      }

  // textarea detecting
  // const Search_DOC = document.querySelector(".searchbar");
  // Search_Input = Search_DOC.querySelector("textarea");



    // if (evt.keyCode == 13 && !evt.shiftKey) {
    //     form.submit();
    // }

      

  //  html 내부 정리함수

      function sleep(sec) {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
      } 

      async function clear_input(){        
        document.getElementById("main_search_input").value="";
        // click_fadeout(document.getElementById('result_contents'));
        click_fadeout(document.getElementById('Sres_view'));
        resize(document.getElementById("main_search_input"));                
        await sleep(0.9);        
        iframe2_dis();    
      //   var doc = document.getElementById('result_view').contentWindow.document;
      //   doc.getElementById('contents_cambrg').innerHTML = `<div class="blank_sheet">
      //   <div class="animate__animated animate__slideInDown text_center"><span class="ft3 ftbb"> What's difference? </span> </div>
      // </div>`;
        // click_fadein(document.getElementById('result_contents'));           
      }

      async function clear_word_toolbar_input(){        
        document.getElementById("word_toolbar_input").value="";
        // click_fadeout(document.getElementById('result_contents'));
        click_fadeout(document.getElementById('word_toolbar_result'));
        resize(document.getElementById("word_toolbar_input"));                
        await sleep(0.9);                
      //   var doc = document.getElementById('result_view').contentWindow.document;
      //   doc.getElementById('contents_cambrg').innerHTML = `<div class="blank_sheet">
      //   <div class="animate__animated animate__slideInDown text_center"><span class="ft3 ftbb"> What's difference? </span> </div>
      // </div>`;
        // click_fadein(document.getElementById('result_contents'));           
      }

      function resize(obj) {        
        obj.style.height = "1px";
        obj.style.height = ((obj.scrollHeight/10)+0.5)+"rem";
      }

      async function click_fadein(obj) {        
        console.log('fadein detected : '+ obj.id);
        visible(obj);
        obj.classList.toggle('animate__fadeIn');              
        await sleep(0.9); 
        obj.classList.toggle('animate__fadeIn');
      }        

      async function click_fadeout(obj) {        
        obj.classList.toggle('animate__fadeOut');      
        await sleep(0.9); 
        hidden(obj);
        obj.classList.toggle('animate__fadeOut');
      }              

      async function click_slideup(obj) {                
        console.log('slideup detected : '+ obj.id);        
        visible(obj);   
        obj.classList.toggle('animate__slideInUp');              
        await sleep(0.9);                      
        obj.classList.toggle('animate__slideInUp');        
      }

      async function click_slidedown(obj) {        
        console.log('slideup detected : '+ obj.id);
        obj.classList.toggle('animate__slideInDown');      
        await sleep(0.9); 
        obj.classList.toggle('animate__slideInDown');
      }

      async function click_slideoutdown(obj) {        
        console.log('slideup detected : '+ obj.id);
        obj.classList.toggle('animate__slideOutDown');      
        await sleep(0.9); 
        obj.classList.toggle('animate__slideOutDown');
        hidden(obj);
      }

      async function click_fadeoutdown(obj) {        
        console.log('slideup detected : '+ obj.id);
        obj.classList.toggle('animate__fadeOutDown');      
        await sleep(0.9); 
        obj.classList.toggle('animate__fadeOutDown');
        hidden(obj);
      }
      


      function visible(obj){        
        console.log(obj);
        console.log(obj.style);
        console.log(obj.style.display);
        if ((obj.style.display === 'none') || (obj.style.display==='')){
          console.log('visible start')
          obj.style.display = 'block';
        }        
      }

      function hidden(obj) {           
        console.log(obj.style);
        console.log(obj.style.display);     
        if (obj.style.display !== 'none') {
          console.log('hidden start')              
          obj.style.display = 'none';
        }
      }

      function iframe2_vis() {                        
        console.log(document.getElementById('Sres_view').style.display);
        if ((document.getElementById('Sres_view').style.display === 'none') || (document.getElementById('Sres_view').style.display === '')){
          document.getElementById('Sres_view').style.display= 'block';
        }        
      }

      function iframe2_dis() {              
        console.log(document.getElementById('Sres_view').style.display);
        if ((document.getElementById('Sres_view').style.display === 'block') || (document.getElementById('Sres_view').style.display === '')){
          document.getElementById('Sres_view').style.display ='none';
        }
      }


      function footbar_vis() {        
        click_slideup(document.getElementById('footbar'));
        document.getElementById('footbar').style.display = 'flex';
        document.getElementById('mainbox_center').style.minHeight = '82%';
      }           

      function footbar_dis() {        
        click_slideoutdown(document.getElementById('footbar'));        
        document.getElementById('mainbox_center').style.minHeight = '85%';
      }

      // long touch 함수

      let onlongtouch = false;
      let timer = false;
      let duration = 800;

      function touchStart(){
        if (!timer) {
          timer = setTimeout(onlongtouch, duration);
        }
      }

      function touchEnd(){
        if (timer) {
          clearTimeout(timer)
          timer = false;
        }
      }

      onlongtouch = function(){
        document.querySelector("#msi_play_btn").onclick = tts(document.getElementById('main_search_input').value, 0.5);
      }

      document.addEventListener("DOMContentLoaded", function(){
        document.querySelector("#msi_play_btn").addEventListener("touchstart", touchStart);
        document.querySelector("#msi_play_btn").addEventListener("touchend", touchEnd);
      })

      // dblclick 활성화

      


      
      // window.onload = function() {
      //   var oFrame = document.getElementById("Sres_view");
      //   oFrame.contentWindow.document.onclick = function() {
      //     document.getElementById('footbar').style.display = 'flex'
      //   };
      // };
      
    