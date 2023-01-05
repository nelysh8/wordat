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
var det_login_value = det_login(token);
console.log(det_login_value);
// console.log(`token : ${access_token}`);

function kakaoLogin() {  
  Kakao.Auth.authorize({
    redirectUri: 'http://localhost:3000/kakaoLogin',
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
    delete_all_cookie();
    alert(document.cookie);
  })
  .catch(function() {
    alert('Not logged in');
    delete_all_cookie();
    alert(document.cookie);
  });
}

function kakaoSignout() { //탈퇴하기;연결끊기;  
  Kakao.API.request({
    url: '/v1/user/unlink',
  })
  .then(function(response) {
    console.log(response);
    delete_all_cookie();
  })
  .catch(function(error) {
    console.log(error);
    delete_all_cookie();
  });
}

function det_login(token) {  //로그인 판별자
  alert(token);
  if (token !== null) {
    if(token) {
      Kakao.Auth.setAccessToken(token); 
      console.log('여기 통과?');
      Kakao.API.request({
        url: '/v2/user/me',
      })
      .then(function(res) {    
        return res.properties.nickname;
        // console.log(res.properties.nickname);
        // var req_value = {'nickname' : res.properties.nickname};
        // fetch("/kakaoLogin/signup", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(req_value)}).then((response)=>response.json()).then((results)=>{    
        //   console.log(results);
        // });
      })
      .catch(function(err) { // 앱 연결이 끊긴 상태
        Kakao.Auth.setAccessToken(null);
        return 'sign out';
        // alert('로그인 안된 상태(앱 연결이 끊긴 상태)');
        // kakaoLogin();
        // alert(
        //   'failed to request user information: ' + JSON.stringify(err)
        // );
      });
    } 
  } else {
    console.log('로그인 안된 상태(access token : null)');
    return 'log out';
    // kakaoLogin();
  }  
}

function delete_all_cookie() {
  deleteCookie('authorize-access-token');
  deleteCookie('nickname');
  deleteCookie('client_email');
  deleteCookie('client_email_chg');
}

// function det_login(token) {  //로그인 판별자
//   alert(token);
//   if (token !== null) {
//     if(token) {
//       Kakao.Auth.setAccessToken(token); 
//       console.log('여기 통과?');
//       Kakao.API.request({
//         url: '/v2/user/me',
//       })
//       .then(function(res) {    
//         console.log(res.properties.nickname);
//         var req_value = {'nickname' : res.properties.nickname};
//         fetch("/kakaoLogin/signup", {method : 'post', headers: {'Content-Type': 'application/json'}, body : JSON.stringify(req_value)}).then((response)=>response.json()).then((results)=>{    
//           console.log(results);
//         });
//       })
//       .catch(function(err) { // 앱 연결이 끊긴 상태
//         Kakao.Auth.setAccessToken(null);
//         alert('로그인 안된 상태(앱 연결이 끊긴 상태)');
//         kakaoLogin();
//         // alert(
//         //   'failed to request user information: ' + JSON.stringify(err)
//         // );
//       });
//     } 
//   } else {
//     console.log('로그인 안된 상태(access token : null)');
//     kakaoLogin();
//   }  
// }