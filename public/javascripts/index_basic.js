


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

      function clear_input(position){        
        var req_pos = position;  
        var target = '';
        var link_yarn, link_youglish, link_google = '';

          // 'mainbox_center' // 'second_3box_center'
        if (req_pos === 'mainbox_center') {
          target = document.getElementById("main_search_input");
          link_yarn = document.getElementById('msi_link_yarn');
          link_youglish = document.getElementById('msi_link_youglish');
          link_google = document.getElementById('msi_link_google');
        } else if (req_pos === 'second_3box_center') {
          target = document.getElementById("word_toolbar_input");
          link_yarn = document.getElementById('word_toolbar_link_yarn');
          link_youglish = document.getElementById('word_toolbar_link_youglish');
          link_google = document.getElementById('word_toolbar_link_google');
        }
        target.value="";
        link_yarn.setAttribute('href', encodeURI('https://getyarn.io/'));
        link_youglish.setAttribute('href', encodeURI('https://youglish.com/'));
        link_google.setAttribute('href', encodeURI('https://www.google.com/'));
        // click_fadeout(document.getElementById('result_contents'));        

        resize(target);                

        if (req_pos === 'mainbox_center') {
          click_fadeout(document.getElementById('Sres_view'));                      
        } else if (req_pos === 'second_3box_center') {
          click_fadeout(document.getElementById('word_toolbar_result'));
        }
      }

      function resize(obj) {        
        obj.style.height = "1px";
        obj.style.height = ((obj.scrollHeight/10)+0.5)+"rem";
      }

      async function click_pulse(obj) {        
        console.log('pulse detected : '+ obj.id);        
        obj.classList.toggle('animate__pulse');              
        await sleep(0.9); 
        obj.classList.toggle('animate__pulse');
      }        

      async function click_bounce(obj) {                
        console.log('animate__bounce detected : '+ obj.id);        
        visible(obj);   
        obj.classList.toggle('animate__bounce'); 
        await sleep(0.9);
        obj.classList.toggle('animate__bounce');                
      }

      async function click_bouncein(obj) {                
        console.log('animate__bounceIn detected : '+ obj.id);        
        visible(obj);   
        obj.classList.toggle('animate__bounceIn'); 
        await sleep(0.9);
        obj.classList.toggle('animate__bounceIn');                
      }

      async function click_bounceinup(obj) {                
        console.log('animate__bounceInUp detected : '+ obj.id);        
        visible(obj);   
        obj.classList.toggle('animate__bounceInUp'); 
        await sleep(0.9);
        obj.classList.toggle('animate__bounceInUp');                
      }

      async function click_bounceoutdown(obj) {                
        console.log('animate__bounceOutDown detected : '+ obj.id);                
        obj.classList.toggle('animate__bounceOutDown'); 
        await sleep(0.9);
        hidden(obj);
        obj.classList.toggle('animate__bounceOutDown');                
      }

      async function click_rotateout(obj) {                
        console.log('animate__rotateOut detected : '+ obj.id);                
        obj.classList.toggle('animate__rotateOut'); 
        await sleep(0.5);
        obj.classList.toggle('animate__rotateOut');                
      }

      async function click_slideoutup(obj) {                
        console.log('animate__slideOutUp detected : '+ obj.id);                
        obj.classList.toggle('animate__slideOutUp'); 
        await sleep(0.9);
        obj.classList.toggle('animate__slideOutUp');                
      }

      
      

      // obj.classList.toggle('animate__bounce');
      //   (async function(){
      //     await sleep(0.9);                      
      //     obj.classList.toggle('animate__bounce');          
      //   })();                      

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
        if ((obj.style.display === 'none')){
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
        document.getElementById('mainbody').style.marginBottom = '6rem';             

        
      }           

      function footbar_dis() {        
        click_slideoutdown(document.getElementById('footbar'));   
        document.getElementById('mainbody').style.marginBottom = '0';             
      }

      // long touch 함수

      let onlongtouch1, onlongtouch2  = false;
      let timer1, timer2 = false;
      let duration = 500;
      function touchStart(){
        if (!timer1) {
          timer1 = setTimeout(onlongtouch1, duration);       
        }
        if (!timer2) {
          timer2 = setTimeout(onlongtouch2, duration);       
        }
      }
      function touchEnd(){
        if (timer1) {
          clearTimeout(timer1)
          timer1 = false;
        }
        if (timer2) {
          clearTimeout(timer2)
          timer2 = false;
        }
      }
      onlongtouch1 = function(){
        document.querySelector("#msi_play_btn").onclick = tts(document.getElementById('main_search_input').value, 0.5);        
      }
      onlongtouch2 = function(){
        document.querySelector("#word_toolbar_play_btn").onclick = tts(document.getElementById('word_toolbar_input').value, 0.5);        
      }
      

      document.addEventListener("DOMContentLoaded", function(){
        document.querySelector("#msi_play_btn").addEventListener("touchstart", touchStart);
        document.querySelector("#msi_play_btn").addEventListener("touchend", touchEnd);
      })
      document.addEventListener("DOMContentLoaded", function(){
        document.querySelector("#word_toolbar_play_btn").addEventListener("touchstart", touchStart);
        document.querySelector("#word_toolbar_play_btn").addEventListener("touchend", touchEnd);
      })

      

      // dblclick 활성화

      


      
      // window.onload = function() {
      //   var oFrame = document.getElementById("Sres_view");
      //   oFrame.contentWindow.document.onclick = function() {
      //     document.getElementById('footbar').style.display = 'flex'
      //   };
      // };
      
    