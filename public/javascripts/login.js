
// SDK를 초기화 합니다. 사용할 앱의 JavaScript 키를 설정해야 합니다.
Kakao.init('70b5e00ed4e683299d6fd180066954fb');
console.log(`cookies : ${document.cookie}`);

// SDK 초기화 여부를 판단합니다.
console.log(Kakao.isInitialized());
// var access_token = JSON.parse(document.getElementById('token').innerText).access_token;


var token = getCookie('authorize-access-token');    // 가입/로그인(인가 후 access token 판별)
console.log(token);

// var determinant = det_login(token, 'confirm');
// console.log(determinant);

function det_login(token, typeA) {  //로그인 판별자  
  return new Promise((resolve, reject)=>{
    var type = typeA;        
    

    Kakao.Auth.setAccessToken(token); 
    // if (token !== null) {
    //   // alert('토큰이 있습니다');
      if(token) {
        Kakao.Auth.setAccessToken(token); 
        console.log('det_login_1 start?');      
        Kakao.API.request({
          url: '/v2/user/me',
        }) 
        .then(function(res) {            
          console.log(res);                
          var req_value = {'id' : 'kakao_' + res.id};
          var user_image_link = res.properties.thumbnail_image;          
          var user_nickname = res.properties.nickname;
          var user_email = res.kakao_account.email;
          var user_image_layer = document.getElementById('user_image');

          var config;                    

          var login_layer = document.getElementById('login_layer');          
          login_layer.innerHTML = `
          <div class="config_layer_contents_user" id="config_layer_contents_user">
            <div class="config_layer_user_image_layer">
              <div class="config_layer_contents_user_image" id="config_layer_contents_user_image" style="display:none;">
    
              </div> 
            </div>
            <div class="config_layer_contents_user_info" id="config_layer_contents_user_info">
              
            </div>        
          </div>
          <div class="config_layer_contents_button" id="config_layer_contents_button">
    
          </div>        
          <div class="config_layer_details" id="config_layer_details">
            <div class="config_dictionary ft_noto">
              <div class="input-group mb-3">
                <div class="dropdown">
                  <span class="ft_noto ft8 ftb"> 기본 영어사전 :   </span>
                  <button id="default_dict" class="btn ft8 dropdown-toggle" style="background-color:firebrick!important; color:white!important;" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                  <ul class="dropdown-menu dropdown-menu-end ft_noto ft8">
                    <li><a class="dropdown-item" href="#" onclick="document.getElementById('default_dict').innerText='Cambridge'; document.getElementById('default_dict').value='11';">Cambridge 영영사전</a></li>
                    <li><a class="dropdown-item" href="#" onclick="document.getElementById('default_dict').innerText='Naver'; document.getElementById('default_dict').value='22';">Naver 영어사전</a></li>
                    <li><a class="dropdown-item" href="#" onclick="document.getElementById('default_dict').innerText='Etymonline'; document.getElementById('default_dict').value='33';">Etymonline 어원사전</a></li>
                  </ul>
                </div>  
              </div>              
            </div>
            <div class="config_tts_default ft9 ft_noto">
              <label for="tts_speed_def" class="form-label">영어 음성재생 기본속도(0-100) / (기본 : 50)</label>
              <input type="range" class="form-range" id="tts_speed_def" value="50">
            </div>
            <div class="config_tts_slow ft9 ft_noto">
              <label for="tts_speed_slow" class="form-label">영어 음성재생 느린속도(0-100) / (기본 : 25)</label>
              <input type="range" class="form-range" id="tts_speed_slow" value="25">
            </div>
            <div class="config_layer_bottom_button">
              <div style="display:flex; width:100%; height:100%;">
                <div style="width:50%;"></div>                  
                <div class="animate__animated" style="margin : auto;">        
                  <ul class="animate__animated" style="text-align:center; padding : auto; margin-bottom : 0%;" onclick="zoomin(this); config_chg(); close_loginbar();">
                    <li><i class="fa-solid fa-check text_red ft6 ftbb"></i>                   
                    <li><span class="ft10"> 변경 </span></li>
                  </ul>
                </div>
                <div class="animate__animated" style="margin : auto;">
                  <ul class="animate__animated" style="text-align:center; padding : auto; margin-bottom : 0%; border-left : 1px solid gray;" onclick="zoomin(this); close_loginbar(); vis(mainbox_center);">
                    <li><i class="fa-solid fa-xmark text_red ft6 ftbb"></i></li>                
                    <li><span class="ft10"> 취소 </span></li>
                  </ul>                             
                </div>                                                    
              </div> 
            </div>
          </div>`;      

          if ((get_config_cookie() !== null) && (get_config_cookie() !== undefined)) {
            config = get_config_cookie();
            if (Number(config[0]) === 11) {
              document.getElementById('default_dict').innerHTML = 'Cambridge';
            } if (Number(config[0]) === 22) {
              document.getElementById('default_dict').innerHTML = 'Naver';
            } if (Number(config[0]) === 33) {
              document.getElementById('default_dict').innerHTML = 'Etymonline';
            }  
            document.getElementById('tts_speed_def').value = Number(config[1]);
            document.getElementById('tts_speed_slow').value = Number(config[2]);  
          }

          var config_layer_contents_user_image = document.getElementById('config_layer_contents_user_image');
          var config_layer_contents_user_info = document.getElementById('config_layer_contents_user_info');
          var config_layer_contents_button = document.getElementById('config_layer_contents_button');    

          user_image_layer.innerHTML = ``;
          user_image_layer.style.backgroundImage = `url(${user_image_link})`;
          user_image_layer.style.backgroundSize = 'cover';

          config_layer_contents_user_image.style.backgroundImage = `url(${user_image_link})`;  
          config_layer_contents_user_image.style.backgroundSize = 'cover';    
          config_layer_contents_user_image.style.display = 'block';

          config_layer_contents_user_info.innerHTML = `
              <span class="ft_noto ft7" style="text-align:left;">${user_nickname}</span><br>
              <span class="ft_noto ft9 text_gray" style="text-align:justify;">${user_email}</span>             
            `;
          config_layer_contents_button.innerHTML = `
            <div style="display:flex; width:100%; height:100%;">
              <div style="width:50%;"></div>                  
              <div class="animate__animated" style="margin : auto;">        
                <ul class="animate__animated" style="text-align:center; padding : auto; margin-bottom : 0%;" onclick="zoomin(this); kakaoSignout();">
                  <li><i class="fa-solid fa-right-from-bracket text_red ft6 ftbb"></i>                  
                  <li><span class="ft10"> 로그아웃 </span></li>
                </ul>
              </div>
              <div class="animate__animated" style="margin : auto;">
                <ul class="animate__animated" style="text-align:center; padding : auto; margin-bottom : 0%; border-left : 1px solid gray;" data-bs-toggle="modal" data-bs-target="#unsub_confirm" onclick="zoomin(this); kakaobye();">
                  <li><i class="fa-solid fa-eraser text_red ft6 ftbb"></i></li>
                  <li><span class="ft10"> 탈퇴 </span></li>
                </ul>                             
              </div>                                                    
            </div>            
            `;

          zoomin(user_image_layer);              
          console.log('det_login_2 start?');      
          fetch("/kakaoLogin/signup", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(req_value)}).then((response)=>response.json()).then((results)=>{    
            console.log(results);
            resolve('로그인/후처리 완료');           
            
          })          
        })
        .catch(function(err) { // 앱 연결이 끊긴 상태                    
          Kakao.Auth.setAccessToken(null);        
          console.log('로그인 안된 상태(앱 연결이 끊긴 상태)');        
          console.log('det_login_3 confirm success');   
          var login_layer = document.getElementById('login_layer');
          login_layer.innerHTML = `
            <div class="login_layer_title" id="login_layer_title">
            </div>
            <div class="login_layer_contents" id="login_layer_contents">
              <div class="login_layer_contents_user" id="login_layer_contents_user">
                <div class="user_image_layer">
                  <div class="login_layer_contents_user_image" id="login_layer_contents_user_image" style="display:none;">

                  </div> 
                </div>
                <div class="login_layer_contents_user_info" id="login_layer_contents_user_info">

                </div>
              </div>
              <div class="login_layer_contents_button" id="login_layer_contents_button">

              </div>        
            </div>`;

          var login_layer_title = document.getElementById('login_layer_title');          
          var login_layer_contents_button = document.getElementById('login_layer_contents_button');
          var login_layer_contents_user_image = document.getElementById('login_layer_contents_user_image');    

          login_layer_contents_user_image.style.display = "none";
          login_layer_title.innerHTML = `
            <p><span class="ft_noto ft7" style="text-align:left;">카카오톡으로 앱을 연결해주세요.</span></p>
            <p><span class="ft_noto ft9 text_gray" style="text-align:justify;">카카오톡 회원식별번호 외에 이메일, 프로필사진은 보관하지 않고, 회원식별번호는 앱 연결을 해제하면 삭제됩니다.</span></p>            
            `;
          login_layer_contents_button.innerHTML = `            
            <div style="display:flex;">          
              <div style="width:10%;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" style="width : 100%;">
              </div>
              <div style="width:89%; text-align: center; margin-left:1%; padding-top:1.5%; background-color: #ffe812;">
                <span class="ft_noto ft8" style="display: inline-block;" onclick="kakaoLogin();">카카오톡 앱 연결을 진행합니다.</span>
              </div>            
            </div>
            `;          
          console.log('det_login_3 exe success');             
          open_loginbar();            
          reject('로그인 기능 실행필요');          
        });
      } else {                
        Kakao.Auth.setAccessToken(null);        
        console.log('로그인 안된 상태(access token : null)');  
        
        var login_layer = document.getElementById('login_layer');
          login_layer.innerHTML = `
            <div class="login_layer_title" id="login_layer_title">
            </div>
            <div class="login_layer_contents" id="login_layer_contents">
              <div class="login_layer_contents_user" id="login_layer_contents_user">
                <div class="user_image_layer">
                  <div class="login_layer_contents_user_image" id="login_layer_contents_user_image" style="display:none;">

                  </div> 
                </div>
                <div class="login_layer_contents_user_info" id="login_layer_contents_user_info">

                </div>
              </div>
              <div class="login_layer_contents_button" id="login_layer_contents_button">

              </div>        
            </div>`;
        
        var login_layer_title = document.getElementById('login_layer_title');
        var login_layer_contents_button = document.getElementById('login_layer_contents_button');    
        var login_layer_contents_user_image = document.getElementById('login_layer_contents_user_image');  

        login_layer_contents_user_image.style.display = "none";
        login_layer_title.innerHTML = `
          <p><span class="ft_noto ft7" style="text-align:left;">카카오톡으로 앱을 연결해주세요.</span></p>
          <p><span class="ft_noto ft9 text_gray" style="text-align:justify;">카카오톡 회원식별번호 외에 이메일, 프로필사진은 보관하지 않고, 회원식별번호는 앱 연결을 해제하면 삭제됩니다.</span></p>          
            `;
        login_layer_contents_button.innerHTML = `            
          <div style="display:flex;">          
            <div style="width:10%;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" style="width : 100%;">
            </div>
            <div style="width:89%; text-align: center; margin-left:1%; padding-top:1.5%; background-color: #ffe812;">
              <span class="ft_noto ft8" style="display: inline-block;" onclick="kakaoLogin();">카카오톡 앱 연결을 진행합니다.</span>
            </div>            
          </div>
          `;          
        console.log('det_login_4 confirm success');             
        open_loginbar();          
        reject('로그인 기능 실행필요');        
      }       
  })
}
  
function kakaoLogin() {    
  Kakao.Auth.authorize({
    redirectUri: 'https://my.word-at.fun/kakaoLogin',
    // redirectUri: 'http://localhost:3000/kakaoLogin',
  });
}



function displayToken() {
  // console.log(getCookie('authorize-access-token'));
  console.log('displayToken start');
  console.log(document.cookie);
  var token = getCookie('authorize-access-token');
  
  if(token) {
    console.log(token);    
    Kakao.Auth.setAccessToken(token);      
    console.log('here?');
    Kakao.Auth.getStatusInfo()      
      .then(function(res) {
        if (res.status === 'connected') {
          document.getElementById('token-result').innerText
            = 'login success, token: ' + Kakao.Auth.getAccessToken();
        } 
      })
      .catch(function(err) {
        Kakao.Auth.setAccessToken(null);
        document.getElementById('token-result').innerText
          = 'error: '+ Kakao.Auth.getAccessToken();
      });
  } else {
    document.getElementById('token-result').innerText
      = 'login out, token: ' + Kakao.Auth.getAccessToken();
  }
}

function kakaoState() {  
  Kakao.API.request({
    url: '/v2/user/me',
  })
  .then(function(res) {
    alert(JSON.stringify(res));
  })
  .catch(function(err) {
    alert(
      'failed to request user information: ' + JSON.stringify(err)
    );
  });
}

function kakaoLogout() {  //로그아웃  
  Kakao.Auth.logout()
  .then(function() {
    alert('logout ok\naccess token -> ' + Kakao.Auth.getAccessToken());    
    document.cookie = 'authorize-access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    alert(document.cookie);
  })
  .catch(function() {
    alert('Not logged in');    
    alert(document.cookie);
  });
}

function kakaoSignout() { //탈퇴하기;연결끊기;  
  var token = getCookie('authorize-access-token');
  Kakao.Auth.setAccessToken(token);      

  Kakao.API.request({
    url: '/v1/user/unlink',
  })
  .then(function(response) {
    console.log(response);
    window.location.href = '/';
    // alert(document.cookie);
  })
  .catch(function(error) {
    console.log(error);
    // alert(document.cookie);
  });
}

function delete_all_cookie() {
  deleteCookie('authorize-access-token');  
  deleteCookie('client_ID');
  deleteCookie('client_ID_chg');
  deleteCookie('pre_selected_wordbook');
  deleteCookie('wa_config');
}

function unsub() {
  var client_ID = getCookie('client_ID');
  var req_value = {'id' : client_ID};
  fetch("/kakaoLogin/unsub", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(req_value)}).then((response)=>response.json()).then((results)=>{    
    console.log(results);
    alert('모든 정보를 삭제했습니다.');
    document.cookie = 'authorize-access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    delete_all_cookie();
    window.location.href = '/';
  })          
}