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

// SDK 초기화 여부를 판단합니다.
console.log(Kakao.isInitialized());

function kakaoLogin() {  
  // Kakao.Auth.authorize({
  window.Kakao.Auth.login({
    scope : 'profile_nickname, account_email',
    success : function(authObj) {
      console.log(authObj);
      window.Kakao.API.request({
        url : '/v2/user/me',
        success : res => {
          const kakao_account = res.kakao_account;
          console.log(kakao_account);
        }
      })
    }
  })
}

