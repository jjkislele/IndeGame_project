window.userData = {
    position01: cc.p(0,0),
    score: 100,
    score2:100,
    score3:100,
    score4:100,
    item:[],
    name: 'story'
};

cc.sys.localStorage.setItem('userData', JSON.stringify(userData));

// (function(){
//     var userData = JSON.parse(cc.sys.localStorage.getItem('userData'));
//     // cc.sys.localStorage.setItem('userData', JSON.stringify(userData));
//     cc.log("立即执行函数");
// }());
