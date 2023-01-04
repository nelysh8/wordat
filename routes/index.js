var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WordAT', token: '' });
});

router.post('/', function(req,res,next){
  var text = [
    {
      "ID": 1,
      "ENG": "I'm going to stay for 6 nights and 7 days",
      "KOR": "저는 6박 7일간 머무를 예정이에요"
    },
    {
      "ID": 2,
      "ENG": "This is not a place for trial",
      "KOR": "여기는 재판하는 곳이 아니에요"
    },
    {
      "ID": 3,
      "ENG": "This is not a place where the audience can enter",
      "KOR": "여기는 방청객이 출입할 수 있는 곳이 아니에요"
    },
    {
      "ID": 4,
      "ENG": "I got you a gift",
      "KOR": "너에게 줄 선물을 가져왔어"
    },
    {
      "ID": 5,
      "ENG": "I'm leaving on the train for travel tomorrow",
      "KOR": "저는 내일 기차타고 여행가요"
    },
    {
      "ID": 6,
      "ENG": "It's all about money",
      "KOR": "그건 돈이 전부야"
    },
    {
      "ID": 7,
      "ENG": "I'm all about money",
      "KOR": "나는 돈이 전부야"
    },
    {
      "ID": 8,
      "ENG": "I don't think it's good to talk like this",
      "KOR": "이런 식으로 말하는 것은 좋지 않다고 생각합니다"
    }
  ];
  res.json(text);
});



module.exports = router;
