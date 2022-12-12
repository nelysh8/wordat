Search_Input.addEventListener("keyup", e => {
    if(e.key === "Enter" && e.target.value.replace(/ /gi,'').replace(/\n/gi,'')) {                    
      var engs_org = e.target.value.replace(/\n$/,'');
      var engs_spl = e.target.value.replace('\n', ' ___ ').replace(/^\s+|\s+$/g,'').replace('  ',' ').split(' ');          
      console.log(engs_spl);
      engs_res = '';          
      var Sres_view_html = document.getElementById('Sres_view').contentWindow.document;          
      Sres_view_html.getElementById('Sres_ENG').innerHTML = '';

      // var url = Array.from({length : engs_spl.length}, (_) => ('https://api.dictionaryapi.dev/api/v2/entries/en/'));
      // for (let word of engs_spl){
      //   url.push('https://api.dictionaryapi.dev/api/v2/entries/en/' + word.replace(/\s/g, '').replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi,''));
      // }
      // console.log(url);

      /* async-await 함수 순차적 실행 */
      async function TEST_add(engs_spl){
        for (let words of engs_spl){            
          if (words === '___') {
            engs_res += `<br>`;
          } else {
            var url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + words.replace(/\s/g, '').replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi,'');                      
            console.log(url);
            await fetch(url).then((response)=>{
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
              engs_res += `<a href="#" onclick="parent.Cambrg_search('${words}');" title="${words}" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="
                [${result[0].phonetics[0].text}] ${result[0].meanings[0].definitions[0].definition}">${words}</a> `;
            }
            function data2(){
              console.log('err');                
              engs_res += `<a href="#" onclick="parent.Cambrg_search('${words}');" title="${words}" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-placement="top" data-bs-content="none of search results">${words}</a> `;
            }
          }              
        }                     
        Sres_view_html.getElementById('Sres_ENG').innerHTML += engs_res;
        re_popup();             
        iframe2_vis();
      }      
      
      TEST_add(engs_spl);
      trans_papago(engs_org);
      document.getElementById('link_yarn').setAttribute('href', encodeURI('https://getyarn.io/yarn-find?text=' + engs_org));
      document.getElementById('link_youglish').setAttribute('href', encodeURI('https://youglish.com/pronounce/' + engs_org + '/english?'));
      document.getElementById('link_google').setAttribute('href', encodeURI('https://www.google.com/search?q="' + engs_org +'"'));          
    }       
  });