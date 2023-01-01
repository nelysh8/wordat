



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

      async function click_bounceout(obj) {                
        console.log('animate__bounceOut detected : '+ obj.id);              
        obj.classList.toggle('animate__bounceOut'); 
        await sleep(0.9);
        hidden(obj);
        obj.classList.toggle('animate__bounceOut');                
      }
      animate__bounceOut

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
        await sleep(0.3);
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
        await sleep(0.3); 
        obj.classList.toggle('animate__slideOutDown');
        hidden(obj);
      }

      async function click_fadeoutdown(obj, after) {        
        console.log('slideup detected : '+ obj.id);
        obj.classList.toggle('animate__fadeOutDown');      
        await sleep(0.9); 
        obj.classList.toggle('animate__fadeOutDown');
        if (after === 'out'){
          hidden(obj);
        }        
      }

      async function click_shakeY(obj) {        
        console.log('animate__shakeY detected : '+ obj.id);
        obj.classList.toggle('animate__shakeY');      
        await sleep(0.9); 
        obj.classList.toggle('animate__shakeY');
      }

      async function touch_icon_action(obj) {        
        console.log('touch_action detected : '+ obj.id);
        obj.setAttribute('style', 'background-color : #00000020;  border-radius : 50%;');
        obj.classList.toggle('animate__zoomIn');      
        await sleep(0.3); 
        obj.setAttribute('style', 'background-color : none;  border-radius : none;');
        obj.classList.toggle('animate__zoomIn');
      }     

      async function touch_block_action(obj) {        
        console.log('touch_action detected : '+ obj.id);
        obj.setAttribute('style', 'background-color : #00000020;  border-radius : 5%; padding : 0.2rem 0.1rem 0.2rem 0.1rem;');
        obj.classList.toggle('animate__zoomIn');      
        await sleep(0.3); 
        obj.setAttribute('style', 'background-color : none;  border-radius : none; padding : auto;');
        obj.classList.toggle('animate__zoomIn');
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

      function onvis(obj) {
        console.log(obj.style);        
        if (obj.style.visibility !== 'visible') {
          console.log('onvis start')              
          obj.style.visibility = 'visible';
        }
      }
      function unvis(obj) {           
        console.log(obj.style);        
        if (obj.style.visibility !== 'hidden') {
          console.log('unvis start')              
          obj.style.visibility = 'hidden';
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

      async function click_footbar(obj, btn_number) {        
        console.log('pulse detected : '+ obj.id);   
        if (btn_number === 1) {
          document.querySelector('i.fa-house').classList.remove('text_whiteoutline');
          document.querySelector('i.fa-house:only-of-type').classList.remove('text_grey');
          document.querySelector('i.fa-book').classList.add('text_whiteoutline');
          document.querySelector('i.fa-book:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-star').classList.add('text_whiteoutline');
          document.querySelector('i.fa-star:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-book-open').classList.add('text_whiteoutline');
          document.querySelector('i.fa-book-open:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-arrow-rotate-left').classList.add('text_whiteoutline');
          document.querySelector('i.fa-arrow-rotate-left:only-of-type').classList.add('text_grey');
        } else if (btn_number === 2) {
          document.querySelector('i.fa-book').classList.remove('text_whiteoutline');
          document.querySelector('i.fa-book:only-of-type').classList.remove('text_grey');
          document.querySelector('i.fa-house').classList.add('text_whiteoutline');
          document.querySelector('i.fa-house:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-star').classList.add('text_whiteoutline');
          document.querySelector('i.fa-star:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-book-open').classList.add('text_whiteoutline');
          document.querySelector('i.fa-book-open:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-arrow-rotate-left').classList.add('text_whiteoutline');
          document.querySelector('i.fa-arrow-rotate-left:only-of-type').classList.add('text_grey');
        } else if (btn_number === 4) {
          document.querySelector('i.fa-book-open').classList.remove('text_whiteoutline');
          document.querySelector('i.fa-book-open:only-of-type').classList.remove('text_grey');
          document.querySelector('i.fa-house').classList.add('text_whiteoutline');
          document.querySelector('i.fa-house:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-book').classList.add('text_whiteoutline');
          document.querySelector('i.fa-book:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-star').classList.add('text_whiteoutline');
          document.querySelector('i.fa-star:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-arrow-rotate-left').classList.add('text_whiteoutline');
          document.querySelector('i.fa-arrow-rotate-left:only-of-type').classList.add('text_grey');
        } else if (btn_number === 5) {
          document.querySelector('i.fa-arrow-rotate-left').classList.remove('text_whiteoutline');
          document.querySelector('i.fa-arrow-rotate-left:only-of-type').classList.remove('text_grey');
          document.querySelector('i.fa-house').classList.add('text_whiteoutline');
          document.querySelector('i.fa-house:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-book').classList.add('text_whiteoutline');
          document.querySelector('i.fa-book:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-star').classList.add('text_whiteoutline');
          document.querySelector('i.fa-star:only-of-type').classList.add('text_grey');
          document.querySelector('i.fa-book-open').classList.add('text_whiteoutline');
          document.querySelector('i.fa-book-open:only-of-type').classList.add('text_grey');
        } 
        
        // else if (btn_number === 3) {
        //   document.querySelector('i.fa-star').classList.remove('text_whiteoutline');
        //   document.querySelector('i.fa-star:only-of-type').classList.remove('text_grey');
        //   document.querySelector('i.fa-house').classList.add('text_whiteoutline');
        //   document.querySelector('i.fa-house:only-of-type').classList.add('text_grey');
        //   document.querySelector('i.fa-book').classList.add('text_whiteoutline');
        //   document.querySelector('i.fa-book:only-of-type').classList.add('text_grey');
        //   document.querySelector('i.fa-book-open').classList.add('text_whiteoutline');
        //   document.querySelector('i.fa-book-open:only-of-type').classList.add('text_grey');
        //   document.querySelector('i.fa-arrow-rotate-left').classList.add('text_whiteoutline');
        //   document.querySelector('i.fa-arrow-rotate-left:only-of-type').classList.add('text_grey');
        // }

        if (btn_number === 3) {          
          if (document.getElementById('searchbar').style.display === 'none') {
            document.querySelector('i.fa-star').classList.remove('text_whiteoutline');
            document.querySelector('i.fa-star:only-of-type').classList.remove('text_grey');
            obj.classList.toggle('animate__zoomIn');              
            document.getElementById('Upper_search_container').style.marginBottom = '1rem';            

            click_slideup(document.getElementById('searchbar'));            
            // document.getElementsByClassName('carousel-item').scrollTop = document.getElementsByClassName('carousel-item').scrollHeight;
            
            
            // await sleep(0.1);
            for (let i=0; i<20; i++) {
              document.getElementById('Upper_search_container').style.height = `${98-i}%`; 
              await sleep(0.01);
            }                                    
            
            
            obj.classList.toggle('animate__zoomIn');  
          } else {
            document.querySelector('i.fa-star').classList.add('text_whiteoutline');
            document.querySelector('i.fa-star:only-of-type').classList.add('text_grey');
            document.getElementById('Upper_search_container').style.marginBottom = '0rem';     

            click_slideoutdown(document.getElementById('searchbar'));
            // await sleep(0.1);
            for (let i=0; i<20; i++) {
              document.getElementById('Upper_search_container').style.height = `${79+i}%`; 
              await sleep(0.01);
            }                        
          }
        } else {
          obj.classList.toggle('animate__zoomIn');              
          await sleep(0.9); 
          obj.classList.toggle('animate__zoomIn');
        }        
      }              

      function popup_main_layer(obj) {        
        unvis(document.getElementById('Upper_carousel'));
        click_bouncein(obj);        
      }

      async function close_main_layer(obj){
        await click_bounceout(obj); 
        onvis(document.getElementById('Upper_carousel'));
      }
      
      

      // dblclick 활성화

      


      
      // window.onload = function() {
      //   var oFrame = document.getElementById("Sres_view");
      //   oFrame.contentWindow.document.onclick = function() {
      //     document.getElementById('footbar').style.display = 'flex'
      //   };
      // };
      
    