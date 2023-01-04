// window.onload = function () {
//   google.accounts.id.initialize({
//     client_id: "53798976072-32cc457i8sr4megufkabg0tco8770btq.apps.googleusercontent.com",
//     callback: handleCredentialResponse
//   });
//   google.accounts.id.renderButton(
//     document.getElementById("buttonDiv"),
//     { theme: "outline", size: "large" }  // customization attributes
//   );
//   google.accounts.id.prompt(); // also display the One Tap dialog
// }

// function handleCredentialResponse(response) {
//   console.log("Encoded JWT ID token: " + response.credential);
// }

// window.onload = function () {
//   google.accounts.id.initialize({
//     client_id: "53798976072-32cc457i8sr4megufkabg0tco8770btq.apps.googleusercontent.com",
//     callback: handleCredentialResponse
//   });
//   google.accounts.id.renderButton(
//     document.getElementById("buttonDiv"),
//     { theme: "outline", size: "large" }  // customization attributes
//   );
//   google.accounts.id.prompt(); // also display the One Tap dialog
// }

// var GoogleAuth;
// // var SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly';

function handleCredentialResponse(response) {
  // decodeJwtResponse() is a custom function defined by you
  // to decode the credential response.
  const responsePayload = parseJwt(response.credential);

  console.log("ID: " + responsePayload.sub);
  console.log('Full Name: ' + responsePayload.name);
  console.log('Given Name: ' + responsePayload.given_name);
  console.log('Family Name: ' + responsePayload.family_name);
  console.log("Image URL: " + responsePayload.picture);
  console.log("Email: " + responsePayload.email);   
  // gapi.load('client:auth2', ()=>{});
  // GoogleAuth = gapi.auth2.getAuthInstance();
};

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

// function logout() {
//     // native_callback();
//     console.log('logout');        
//     // GoogleAuth.disconnect();

//     // google.accounts.id.disableAutoSelect();
//   }

