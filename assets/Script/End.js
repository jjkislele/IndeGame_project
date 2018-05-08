const BackPackUI = require('BackPackUI');

cc.Class({
    extends: cc.Component,

    properties: {
        evaluation: cc.Node,
        scrollView: cc.ScrollView,
        items: cc.Prefab,
        score: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        var score = 1/8*window.userData.score + 2/8*window.userData.score2 + 4/8*window.userData.score3 + 1/8*window.userData.score4;
        
        this.score.string = score.toString();
        // this.score.string = 100;
        
        cc.log(this.item);
        for(var i = 0; i < window.userData.item.length; i++){
            var pp = cc.instantiate(this.items);
            pp.x =0;
            pp.y =0;
            cc.log(pp);
            //pp.setPositon(cc.p(0,0));
            this.scrollView.content.addChild(pp);
        }
        
        if(score >= 0 && score <= 40){
            this.evaluation.getChildByName("bad_sprite").active = true;
        }
        else if(score > 40 && score <= 60){
            this.evaluation.getChildByName("normal_sprite").active = true;
        }
        else if(score > 60 && score <= 80){
            this.evaluation.getChildByName("good_sprite").active = true;
        }
        else if(score > 80 && score <= 100)
        {
            this.evaluation.getChildByName("perfert_sprite").active = true;
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
});
