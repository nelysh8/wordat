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
console.log(document.cookie);

// SDK 초기화 여부를 판단합니다.
console.log(Kakao.isInitialized());
var access_token = JSON.parse(document.getElementById('token').innerText).access_token;


console.log(`token : ${access_token}`);

function kakaoLogin() {  
  
  Kakao.Auth.authorize({
    redirectUri: 'http://localhost:3000/kakaoLogin',
  });
}




  function displayToken() {
    console.log(getCookie(access_token));
    console.log('displayToken start');
    var token = getCookie(access_token);
    
    if(token) {
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
        });
    }
  }

  function getCookie(name) {
    var parts = document.cookie.split(name + '=');
    if (parts.length === 2) { return parts[1].split(';')[0]; }
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
  
  
  // window.Kakao.Auth.login({
  //   scope : 'profile_nickname, account_email',
  //   success : function(authObj) {
  //     console.log(authObj);
  //     window.Kakao.API.request({
  //       url : '/v2/user/me',
  //       success : res => {
  //         const kakao_account = res.kakao_account;
  //         console.log(kakao_account);
  //       }
  //     })
  //   }
  // })

function kakaoLogout() {  //로그아웃  
    
    Kakao.Auth.logout()
      .then(function() {
        alert('logout ok\naccess token -> ' + Kakao.Auth.getAccessToken());
        deleteCookie();
      })
      .catch(function() {
        alert('Not logged in');
      });
}

// 아래는 데모를 위한 UI 코드입니다.
function deleteCookie() {
  document.cookie = 'authorize-access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function kakaoSignout() { //탈퇴하기
  
  Kakao.API.request({
    url: '/v1/user/unlink',
  })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

