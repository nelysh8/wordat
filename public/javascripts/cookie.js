var setCookie = function(name, value, day) {
    var date = new Date();
    date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
    document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
};

var getCookie = function(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
};

var deleteCookie = function(name) {
    var date = new Date();
    document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
}



// 1
// 2
// 3
// 4
//     setCookie("test", "test1234", 1);
//     alert(getCookie("test"));
//     deleteCookie("test");
//     alert(getCookie("test"));
// 1# : test라는 이름과 test1234라는 값을 가지며 1일동안 유지되는 cookie를 생성

// 2# : test 라는 이름의 cookie를 조회

// 3# : test 라는 이름의 cookie를 삭제

// 4# : test 라는 이름의 cookie를 조회