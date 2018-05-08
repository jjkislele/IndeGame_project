const BackPackUI = require('BackPackUI');

var dir = {
    right : 1,
    left : 2,
    up : 3,
    down : 4
};

cc.Class({
    extends: cc.Component,

    properties: {
        backPackUI: BackPackUI,
        player: cc.Prefab,
        footPre: cc.Prefab,
        path:[],
        beginBtn: cc.Node,
        logo: cc.Node,
        score_sprite: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        var size = cc.winSize;
        this.node.convertToWorldSpaceAR(cc.p(0,0));

        //每帧刷新
        // this.scheduleUpdate();

        //路径数组初始化
        this.path.push(cc.p(-1/2*size.width + 1/5*size.width, -1/2*size.height + 1/2*size.height));
        this.path.push(cc.p(-1/2*size.width + 4/5*size.width, -1/2*size.height + 1/2*size.height));

        //分数
        // this.score_sprite = new cc.LabelTTF(this.score,'Arial', 35);
        // this.score_sprite.x = size.width-100;
        // this.score_sprite.y = size.height -100;
        // this.addChild(this.score_sprite);

        //演示人物
        this.people();

        //玩家
        this.character = cc.instantiate(this.player);        //人物精灵创建
        this.character_pos = this.path[0];          //玩家最初位置初始化
        this.character.x = this.path[0].x;
        this.character.y = this.path[0].y;
        // this.node.addChild(this.character);
    },
    
    //每隔一段时间添加脚印
    addPath:function(){
            var footprint = cc.instantiate(this.footPre);       //创建脚印

            if(this.arrow == dir.right){
                footprint.rotation = 0;
            }
            if(this.arrow == dir.left){
                footprint.rotation = 180;
            }
            if(this.arrow == dir.up){
                footprint.rotation = -90;
            }
            if(this.arrow == dir.down){
                footprint.rotation = 90;
            }
            footprint.setPosition(this.demo.getPosition());
            this.node.addChild(footprint);
    },

    //正确路径演示
    people: function(){
        this.demo = cc.instantiate(this.player);        //演示人物
        this.demo.setPosition(this.path[0]);
        this.demo_pos = this.path[0];

        var speed = 150;         //演示人物移动的速度
        var distance = Math.sqrt((this.path[1].x- this.path[0].x) * (this.path[1].x- this.path[0].x)+(this.path[1].y- this.path[0].y) * (this.path[1].y- this.path[0].y));
        var action_seq = cc.moveTo(distance/speed,this.path[1]);

        if(this.path.length > 2){
            for(var i=2; i<this.path.length; i++){
                distance = Math.sqrt((this.path[i-1].x- this.path[i].x)*(this.path[i-1].x- this.path[i].x)+(this.path[i-1].y- this.path[i].y)*(this.path[i-1].y- this.path[i].y));
                action_seq = cc.sequence(action_seq, cc.moveTo(distance/speed,this.path[i]));
            }
        }
        
        var that = this;
        var seq = cc.sequence(action_seq,cc.callFunc(function(){
            that.beginBtn.opacity = 255;
            that.beginBtn.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(1, 50), cc.fadeTo(1,255))));
            that.demo.setPosition(cc.p(3000,3000));
            that.logo.opacity = 255;
        }));
        this.demo.runAction(seq);
        this.node.addChild(this.demo);
        // this.schedule(this.addPath, 0.3);
    },
    
    beginControl: function(){
        cc.director.loadScene("page2");
    },
    
    start:function(){
        this.backPackUI.init(this);
        var thiz = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event){
                thiz.touch_pos = touch.getLocation();
                thiz.move_trigger=1;
                return true;
            },
            onTouchMoved:function(touch, event){
                thiz.touch_pos = touch.getLocation();
            },
            onTouchEnded: function (touch, event) {
                thiz.move_trigger=0;
            }
        }, this.node);
    },
    
    // called every frame, uncomment this function to activate update callback
    update:function(){
        cc.log(this.score_sprite.string);
        // this.score_sprite.string = cc.sys.localStorage.getItem('userData');
        
        var current_pos = this.character.getPosition();
        //玩家的移动
        if(this.move_trigger==1){
            var distance = Math.sqrt((current_pos.x-this.touch_pos.x)*(current_pos.x-this.touch_pos.x)+(current_pos.y-this.touch_pos.y)*(current_pos.y-this.touch_pos.y));

            if(distance> this.move_speed){
                var dx = -(current_pos.x-this.touch_pos.x)/distance* this.move_speed;
                var dy = -(current_pos.y-this.touch_pos.y)/distance* this.move_speed;
                var nextpos = cc.p(current_pos.x+dx, current_pos.y+dy);
                this.character.setPosition(nextpos);
            }
        }

        //每帧都检测演示人物的移动方向
        var currDemoPos = this.demo.getPosition();      //当前demo位置
        var x_change = currDemoPos.x - this.demo_pos.x;
        var y_change = currDemoPos.y - this.demo_pos.y;

        if(x_change>0 && y_change===0){
            this.arrow = dir.right;
        }
        if(x_change<0 && y_change===0){
            this.arrow = dir.left;
        }
        if(x_change===0 && y_change>0){
            this.arrow = dir.up;
        }
        if(x_change===0 && y_change<0){
            this.arrow = dir.down;
        }
        this.demo_pos = this.demo.getPosition();

        //玩家每移动k像素执行一次，检查玩家是否在正确路径上
        var delta = Math.sqrt((current_pos.x-this.character_pos.x)*(current_pos.x-this.character_pos.x)+(current_pos.y-this.character_pos.y)*(current_pos.y-this.character_pos.y));
        var k=15;
        if(delta > k && window.userData.score>0){
            //cc.log("you move checkpoint");
            //更新旧位置
            this.character_pos = current_pos;

            //当前玩家到所有路径的最短距离
            var dis = getMinDistance(this.path, current_pos.x, current_pos.y);

            var critical = 20;      //开始扣分的临界距离
            if(dis>critical){
                window.userData.score--;
            }
            this.score_sprite.string = window.userData.score.toString();
        }

    },
});
