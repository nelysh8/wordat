
// var ebook_contents = document.getElementById('third_1box_contents');
// var contents = ''
// var ebook_num = {'ebook_num' : ebook_num};    

var doc = nlp('This ebook is for the use of anyone anywhere in the United States and most other parts of the world at no cost and with almost no restrictions whatsoever. You may copy it, give it away or re-use it under the terms of the Project Gutenberg License included with this ebook or online at www.gutenberg.org. If you are not located in the United States, you’ll have to check the laws of the country where you are located before using this eBook.');     
console.log(doc.clauses().out('array'));

// ebook_contents.innerHTML = `<lottie-player src="https://assets4.lottiefiles.com/private_files/lf30_P60IO4.json" background="transparent"  speed="1"  style="width: 50%; margin : auto;"  loop  autoplay></lottie-player>`;
// third_1box_open();


// fetch("/open_ebook", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(ebook_num)}).then((response)=>response.json()).then((results)=>{
//   console.log(results);
//   if (results.chapter.num !== 'error') {
//     var doc = nlp('This ebook is for the use of anyone anywhere in the United States and most other parts of the world at no cost and with almost no restrictions whatsoever. You may copy it, give it away or re-use it under the terms of the Project Gutenberg License included with this ebook or online at www.gutenberg.org. If you are not located in the United States, you’ll have to check the laws of the country where you are located before using this eBook.');     
//     console.log(doc.clauses().out('array'));
//     contents += `
//       <div class="ebook_read_title ft_noto" style="display:flex; margin-bottom : 5rem;"> 
//         <img src='${results.cover.img_link}' style='width:50%; margin-right : 1rem;'>
//         <div style="margin-top : auto; margin-bottom : auto;"
//           <p class="ft4 ftbb">${results.cover.title}</p>
//           <p class="ft5 ftbb" style="text-align : right">-${results.cover.author}</p>        
//         </div>
//       </div>
//       `;
    
//     for (chapt of results.chapter) {    
//       contents += `
//       <div style="text-align : center; margin : 2rem auto 2rem auto">
//         <span class="ft7 ftb ft_noto" style="line-height : 180%;">${chapt.title}</span><br>
//       </div>`;    
            
//       for (part of chapt.sentence) {            
//         for (chunk of part) {
//           contents += `<span class="ft8 ft_noto" onclick="touch_block_action(this); tts_any(this.innerText, 1)">${chunk} </span>`;
//           // console.log(chunk);
//         }
//         contents += `<br>`;
//       }            
//     }
//     ebook_contents.innerHTML = contents;
//   } else {
//     contents += `        
//         <div class="div_linked_book">
//             <iframe id="linked_ebook" src="${results.chapter.link}" seamless></iframe>        
//         </div>
//     `;          
//     // https://www.wikipedia.org/wiki/Vincent_van_Gogh
//     ebook_contents.innerHTML = contents;
//   }
// })
