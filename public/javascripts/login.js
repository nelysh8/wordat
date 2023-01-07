// function handleCredentialResponse(response) {
//   // decodeJwtResponse() is a custom function defined by you
//   // to decode the credential response.
//   const responsePayload = parseJwt(response.credential);

//   console.log("ID: " + responsePayload.sub);
//   console.log('Full Name: ' + responsePayload.name);
//   console.log('Given Name: ' + responsePayload.given_name);
//   console.log('Family Name: ' + responsePayload.family_name);
//   console.log("Image URL: " + responsePayload.picture);
//   console.log("Email: " + responsePayload.email);   
//   // gapi.load('client:auth2', ()=>{});
//   // GoogleAuth = gapi.auth2.getAuthInstance();
// };

// function parseJwt (token) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//       return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));

//   return JSON.parse(jsonPayload);
// };



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
          var user_image_layer = document.getElementById('user_image');

          user_image_layer.innerHTML = ``;
          user_image_layer.style.backgroundImage = `url(${user_image_link})`;
          user_image_layer.style.backgroundSize = 'cover';      
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
          var login_layer_title = document.getElementById('login_layer_title');
          var login_layer_contents = document.getElementById('login_layer_contents');
          var login_layer_contents_button = document.getElementById('login_layer_contents_button');    
          
          
          login_layer_title.innerHTML = `
            <p><span class="ft_noto ft7" style="text-align:left;">카카오톡으로 앱을 연결해주세요.</span></p>
            <p><span class="ft_noto ft9 text_gray" style="text-align:justify;">카카오톡 회원식별번호 외에 이메일, 프로필사진은 보관하지 않고, 회원식별번호는 앱 연결을 해제하면 삭제됩니다.</span></p>
            <a href="javascript:kakaoLogin();"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" style="width : 10%;"></a>
            <button type="button" onclick="displayToken();">displayToken</button>
        <div id="token-result">jkjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj</div>
        <button type="button" onclick="kakaoLogout();">Logout</button>
        <button type="button" onclick="kakaoSignout();">Signout</button>
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
          // if (type === 'execute') {          
          //   reject('로그인 기능 실행필요');
          //   kakaoLogin();                    
          //   console.log('det_login_3 exe success');             
          // } else {
          //   resolve('앱 연결안됨 확인');
          // }
        });
      } else {
        // alert('토큰이 없습니다');      
        console.log('로그인 안된 상태(access token : null)');    
        
        
        reject('로그인 기능 실행필요');  
        var login_layer_title = document.getElementById('login_layer_title');
        var login_layer_contents = document.getElementById('login_layer_contents');
        var login_layer_contents_button = document.getElementById('login_layer_contents_button');    
        var user_image_layer = document.getElementById('user_image');
        
         
  
        
        
        
        login_layer_title.innerHTML = '';
        login_layer_contents.innerHTML = `     
          <div class="login_layer_contents_user" id="login_layer_contents_user">
            <div class="login_layer_contents_user_image" id="login_layer_contents_user_image">
              <i class="fa-solid fa-user ft3"></i> 
            </div>
            <div class="login_layer_contents_user_info" id="login_layer_contents_user_info">
            </div>
          </div>
          <div class="login_layer_contents_button" id="login_layer_contents_button">
  
          </div>
          `;
          
        open_loginbar();   
        // var loginbar = document.getElementById('login_layer');  
        // if (loginbar.style.display !== 'block') {
          // click_slideup(loginbar);
        // }     
          console.log('det_login_4 confirm success');  
              // `<div style="display:flex;">          
              //   <div style="width:10%;">
              //     <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" style="width : 100%;">
              //   </div>
              //   <div style="width:89%; text-align: center; margin-left:1%; padding-top:1.5%; background-color: #ffe812;">
              //     <span class="ft_noto ft8" style="display: inline-block;" onclick="kakaoLogin();">카카오톡 앱 연결을 진행합니다.</span>
              //   </div>            
              // </div>
              // `;
        
        // console.log('det_login_4 exe success');              
        // if (type === 'execute') {      
        //   reject('로그인 기능 실행필요');
        //   kakaoLogin();            
        //   console.log('det_login_4 exe success');              
        // } else {
        //   resolve('로그인 안됨 확인');
        // }  
      }
    // }    
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
    alert(document.cookie);
  })
  .catch(function(error) {
    console.log(error);
    alert(document.cookie);
  });
}

function delete_all_cookie() {
  deleteCookie('authorize-access-token');  
  deleteCookie('client_ID');
  deleteCookie('client_ID_chg');
}
