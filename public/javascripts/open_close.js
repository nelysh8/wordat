 
  async function wordbook_open(){      
    // await click_fadeoutdown(mainbox_center);    
    if (second_1box_center.style.display !== 'none') {
      click_bouncein(second_1box_center);
      document.querySelector('i.fa-star').classList.add('text_whiteoutline');
      document.querySelector('i.fa-star:only-of-type').classList.add('text_grey');
      await sleep(0.5);
      hidden(mainbox_center);
      hidden(third_1box_center);
    } else {
      click_bounceinup(second_1box_center);  
      await sleep(0.5);
      hidden(mainbox_center);
      hidden(third_1box_center);
    }  
  }
  
  function wordbook_close(){    
    if (second_1box_center.style.display !== 'none') {
      click_bounceoutdown(second_1box_center);     
      visible(mainbox_center);
    }  
    if (second_2box_center.style.display !== 'none') {
      click_bounceoutdown(second_2box_center);
    }           
    if (second_3box_center.style.display !== 'none') {
      click_bounceoutdown(second_3box_center);
    }           
  }
  
  function wordlist_open(){    
    if (second_2box_center.style.display !== 'none') {
      click_bouncein(second_2box_center);
    } else {
      click_bounceinup(second_2box_center);  
    }    
  }
  
  function wordlist_close(){
    // click_fadein(second_1box_contents);
    wordbook_reading('');
    click_bounceoutdown(second_2box_center); 
    if (second_3box_center.style.display !== 'none') {
      click_bounceoutdown(second_3box_center);
    }    
  }
  
  function word_open(){
    console.log('word_open start');  
    if (second_3box_center.style.display !== 'none') {
      click_bouncein(second_3box_center);
    } else {
      click_bounceinup(second_3box_center);  
    }   
  }
  
  function word_close(){
    // click_fadein(second_2box_contents);
    wordlist_reading('', document.getElementById('s2_wordbook_title').innerText,'');
    click_bounceoutdown(second_3box_center); 
  }
  
  async function third_1box_open(){    
    if (third_1box_center.style.display !== 'none') {
      click_bouncein(third_1box_center);
      document.querySelector('i.fa-star').classList.add('text_whiteoutline');
      document.querySelector('i.fa-star:only-of-type').classList.add('text_grey');
      await sleep(0.5);
      hidden(mainbox_center);
      hidden(second_1box_center);
      hidden(second_2box_center);
      hidden(second_3box_center);
    } else {
      click_bounceinup(third_1box_center);      
      await sleep(0.5);
      hidden(mainbox_center);
      hidden(second_1box_center);
      hidden(second_2box_center);
      hidden(second_3box_center);
    }    
  }
  
  async function third_1box_close(){
    if (third_1box_center.style.display !== 'none') {
      click_bounceoutdown(third_1box_center); 
      document.querySelector('i.fa-star').classList.add('text_whiteoutline');
      document.querySelector('i.fa-star:only-of-type').classList.add('text_grey');
      await sleep(0.5);
      visible(mainbox_center);
    }    
  }
  
