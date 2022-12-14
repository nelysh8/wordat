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
        document.getElementById("main_input").value="";
        click_fadeout(document.getElementById('result_contents'));
        click_fadeout(document.getElementById('Sres_view'));
        resize(document.getElementById("main_input"));                
        await sleep(1);        
        iframe2_dis();    
        var doc = document.getElementById('result_view').contentWindow.document;
        doc.getElementById('contents_cambrg').innerHTML = `<div class="blank_sheet">
        <div class="animate__animated animate__slideInDown text_center"><span class="ft3 ftbb"> What's difference? </span> </div>
      </div>`;
        click_fadein(document.getElementById('result_contents'));           
      }

      function resize(obj) {        
        obj.style.height = "1px";
        obj.style.height = ((obj.scrollHeight/10)+0.5)+"rem";
      }

      async function click_fadein(obj) {        
        console.log('fadein detected : '+ obj.id);
        obj.classList.toggle('animate__fadeIn');      
        await sleep(1); 
        obj.classList.toggle('animate__fadeIn');
      }        

      async function click_fadeout(obj) {        
        obj.classList.toggle('animate__fadeOut');      
        await sleep(1); 
        obj.classList.toggle('animate__fadeOut');
      }              

      function iframe2_vis() {                        
        console.log(document.getElementById('Sres_view').style.display);
        if (document.getElementById('Sres_view').style.display === 'none') {
          document.getElementById('Sres_view').setAttribute('style', 'display : block');
        }        
      }

      function iframe2_dis() {              
        console.log(document.getElementById('Sres_view').style.display);
        if (document.getElementById('Sres_view').style.display === 'block') {
          document.getElementById('Sres_view').setAttribute('style', 'display : none');
        }
      }


      function footbar_vis() {        
        document.getElementById('footbar').setAttribute('style', 'display : flex');
      }      

      window.onload = function() {
        var oFrame = document.getElementById("Sres_view");
        oFrame.contentWindow.document.onclick = function() {
          document.getElementById('footbar').setAttribute('style', 'display : flex');
        };
      };

      function footbar_dis() {        
        document.getElementById('footbar').setAttribute('style', 'display : none');
      }

      function add_click() {
        var engs = document.getElementById('main_input').value.replace(/\n$/,'');
        var Sres_view_html = document.getElementById('Sres_view').contentWindow.document;          
        document.getElementById("edit_eng").value = engs;
        if (Sres_view_html.getElementById('Sres_KOR').innerText === "") {          
        } else {
          document.getElementById("edit_kor").value=Sres_view_html.getElementById('Sres_KOR').innerText;
        }
      }
    