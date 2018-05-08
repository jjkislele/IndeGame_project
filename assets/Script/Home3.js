var help = require("GameHelp");
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
        player: cc.Prefab,
        footPre: cc.Prefab,
        path:[],
        backPackUI: BackPackUI,
        rubbish: cc.Prefab,
        scroll_array:[],
        move_speed:0,
        error_tip1: cc.Label,
        error: cc.Node,
        critical: 20,//临界距离
        score_sprite: cc.Label,
        story: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        var size = cc.winSize;
        this.score_sprite.string = window.userData.score2.toString();
        this.node.convertToWorldSpaceAR(cc.p(0,0));
        this.bool = false;
        this.touch_able = false;

        //路径数组初始化
        this.path.push(cc.p(-1/2*size.width + 1/9*size.width, -1/2*size.height + 5/6*size.height));
        this.path.push(cc.p(-1/2*size.width + 3/9*size.width, -1/2*size.height + 5/6*size.height));
        this.path.push(cc.p(-1/2*size.width + 3/9*size.width, - 1/2*size.height + 1/6*size.height ));
        this.path.push(cc.p(-1/2*size.width + 5/9*size.width , - 1/2*size.height + 1/6*size.height ));
        this.path.push(cc.p(-1/2*size.width + 5/9*size.width, - 1/2*size.height + 5/6*size.height ));
        this.path.push(cc.p(-1/2*size.width + 7/9*size.width , - 1/2*size.height + 5/6*size.height ));
        
        this.people();

        //玩家
        this.character = cc.instantiate(this.player);        //人物精灵创建
        this.character_pos = this.path[0];          //玩家最初位置初始化
        this.character_last_flame_pos = this.path[0];
        this.character.x = this.path[0].x;
        this.character.y = this.path[0].y;
        this.node.addChild(this.character);
        
        // 遮罩位置
        this.node.parent.setPosition(this.path[0].x, this.path[0].y);
        this.node.setPosition(-this.path[0].x, -this.path[0].y)

        //初始化背景图片，即战争迷雾
        // var bg = new cc.Sprite(res.shadow);
        // bg.x = winSize.width/2;
        // bg.y = winSize.height/2;
        // this.addChild(bg,0);

        //游戏地图被迷雾覆盖

        //没有裁剪模板时会报错,象征性的模板，没有实际意义
        // var stencil = new cc.DrawNode();
        // stencil.drawRect(cc.p(0,0), cc.p(1,1), cc.color(0,0,0),1,cc.color(0,0,0));
        // clipping.stencil = stencil;
    },
    
    // 故事关闭
    btn: function(){
        this.story.getChildByName('LV'+this.pickId).active = false;
        this.touch_able = false;
    },
    
    disappear: function(){
        this.story.getChildByName('LV'+this.pickId).active = false;
        this.touch_able = false;
    },

    // called every frame, uncomment this function to activate update callback
    update:function(){
        if(!this.bool){
            var current_pos_demo = this.demo.getPosition();
            this.node.parent.setPosition(current_pos_demo);
            this.node.setPosition(cc.p(-current_pos_demo.x, -current_pos_demo.y));
        }
        
        // cc.log(current_pos_demo);

        var current_pos = this.character.getPosition();
        //current_pos.x = current_pos.x + cc.winSize.width / 2;
        //current_pos.y = current_pos.y + cc.winSize.height/2;

        if(help.judgeEndPos(current_pos.x, current_pos.y, this.path[this.path.length-1])){
            cc.log("你已经到达终点");
            cc.director.loadScene("page4");
        }
        
        var pickId = help.judgeGetScroll(this.scroll_array, current_pos.x, current_pos.y)
        if(pickId !=-1){
            cc.log("你捡到了卷轴");
            
            this.touch_able = true;
            this.move_trigger=0;
            //数组未指向下一个，导致出错
            this.story.getChildByName('LV'+pickId).active = true;
            this.scroll_array[pickId].setPosition(cc.p(5000,5000));
            window.userData.item.push(pickId);
            this.pickId = pickId;
            this.backPackUI.init(this);
            // this.scheduleOnce(this.disappear,3);
        }

        //玩家的移动
        if(this.move_trigger==1){
            var xx = current_pos.x + cc.winSize.width/2;
            var yy = current_pos.y + cc.winSize.height/2;
            var distance = Math.sqrt((xx-this.touch_pos.x)*(xx-this.touch_pos.x)+(yy-this.touch_pos.y)*(yy-this.touch_pos.y));
            
            if(distance> this.move_speed){
                var dx = -(xx -this.touch_pos.x)/distance* this.move_speed;
                var dy = -(yy  -this.touch_pos.y)/distance* this.move_speed;
                var nextpos = cc.p(current_pos.x+dx, current_pos.y+dy);
                var nextpos_bg = cc.p(-current_pos.x-dx, -current_pos.y-dy);
                
                this.node.setPosition(nextpos_bg)
                this.node.parent.setPosition(nextpos);
                this.character.setPosition(nextpos);
            }
        }

         //每帧都检查玩家的移动方向
        var character_x_change = current_pos.x - this.character_last_flame_pos.x;
        var character_y_change = current_pos.y - this.character_last_flame_pos.y;
        var gap = 2;
        if(character_x_change==0 && character_y_change==0){     //玩家没有移动
            //cc.log("you move nothing");
        }
        if(character_x_change>0 && Math.abs(character_y_change)<=gap){      //正右移动
            //cc.log("you move right");
        }
        if(character_x_change<0 && Math.abs(character_y_change)<=gap){      //正左移动
            //cc.log("you move left");
        }
        if(character_y_change>gap){      //正上移动
            //cc.log("you move up");
        }
        if(character_y_change<-gap){      //正下移动
            //cc.log("you move down");
        }
        this.character_last_flame_pos = current_pos;

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
        if(delta > k && window.userData.score2>0){
            cc.log("you move checkpoint");
            //更新旧位置
            this.character_pos = current_pos;

            //当前玩家到所有路径的最短距离
            var dis = help.getMinDistance(this.path, current_pos.x, current_pos.y);

            if(dis>this.critical){
                
                if(!this.has_show){
                    this.has_show = true;
                    //主场景提示
                    cc.log(this.error_tip1);
                    this.error.setPosition(cc.p(0,390));
                    // this.error_tip1.active = true;
                    // this.error_tip1 = new cc.LabelTTF("你进入了错误的路径",'Arial', 35);
                    // this.error_tip1.x = cc.winSize.width/2;
                    // this.error_tip1.y = cc.winSize.height/5;
                    // this.addChild(this.error_tip1);
                    this.scheduleOnce(this.delete_error, 3);

                }
                window.userData.score2--;
            }
            // this.score_sprite1.setString(this.score);
            this.score_sprite.string = window.userData.score2.toString();
        }
    },
    
    delete_error: function(){
        this.error.setPosition(cc.p(0,0));
    },
    
        //每隔一段时间添加脚印
    addPath:function(){
        var footprint = cc.instantiate(this.footPre);       //创建脚印

        if(this.arrow == dir.right){
            footprint.rotation = 0;
            this.demo.rotation = 0;
        }
        if(this.arrow == dir.left){
            footprint.rotation = 180;
            this.demo.rotation = 180;
        }
        if(this.arrow == dir.up){
            footprint.rotation = -90;
            this.demo.rotation = -90;
        }
        if(this.arrow == dir.down){
            footprint.rotation = 90;
            this.demo.rotation = 90;
        }
        footprint.setPosition(this.demo.getPosition());
        this.node.addChild(footprint, -1);

    },

    //正确路径演示
    people:function(){
        this.demo = cc.instantiate(this.player);        //演示人物
        this.demo.setPosition(this.path[0]);
        this.demo_pos = this.path[0];
        //演示人物视野
        // this.player_view = new cc.Sprite(res.view);
        // this.player_view.x = this.path[0].x;
        // this.player_view.y = this.path[0].y;
        // this.clipping.stencil.addChild(this.player_view, 0);

        var speed = 150;         //演示人物移动的速度
        var distance = Math.sqrt((this.path[1].x- this.path[0].x)*(this.path[1].x- this.path[0].x)+(this.path[1].y- this.path[0].y)*(this.path[1].y- this.path[0].y));
        var action_seq = cc.moveTo(distance/speed,this.path[1]);
        // var action_seq2 = cc.moveTo(distance/speed,this.path[1]);
        if(this.path.length>2){
            for(var i=2; i<this.path.length; i++){
                distance = Math.sqrt((this.path[i-1].x- this.path[i].x)*(this.path[i-1].x- this.path[i].x)+(this.path[i-1].y- this.path[i].y)*(this.path[i-1].y- this.path[i].y));
                action_seq = cc.sequence(action_seq, cc.moveTo(distance/speed,this.path[i]));
                // action_seq2 = cc.sequence(action_seq2, cc.moveTo(distance/speed,this.path[i]));
            }
        }
        var callback = cc.callFunc(this.demoEnd, this, "");
        // var callback2 = cc.callFunc(this.demoEnd, this, "");
        action_seq = cc.sequence(action_seq, callback);
        // action_seq2 = cc.sequence(action_seq2, callback);
        this.demo.runAction(action_seq);                //演示人物移动
        // this.player_view.runAction(action_seq2);        //视野移动

        this.node.addChild(this.demo);
        this.schedule(this.addPath, 0.3);
    },

    //路径演示结束, 这时才允许点击
    demoEnd:function(){
        var thiz = this;

        //删除演示人物和演示人物视野
        // this.demo.setPosition(cc.p(3000,3000));
        cc.removeSelf();
        this.node.parent.setPosition(this.path[0].x, this.path[0].y);
        this.node.setPosition(-this.path[0].x, -this.path[0].y);
        this.bool = true;
        // this.clipping.stencil.removeChild(this.player_view);

        //创建玩家视野
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event){
                if(thiz.touch_able === false){
                    thiz.touch_pos = touch.getLocation();
                    thiz.move_trigger=1;
                    cc.log("aaa");
                    return true;
                }
                else{
                    return false;
                }
            },
            onTouchMoved:function(touch, event){
                if(thiz.touch_able === false){
                    thiz.touch_pos = touch.getLocation(); 
                }
            },
            onTouchEnded: function (touch, event) {
                thiz.move_trigger=0;
            }
        }, this.node);
       
        // 初始化该场景上的全部卷轴
        var size = cc.winSize;
        // for(var i=0; i<10; i++){
        //     this.sc = cc.instantiate(this.rubbish);
        //     // 位置随机在 0.1~0.9倍手机尺寸
        //     // cc.log((Math.random()*0.8+0.1)*size.width);
        //     this.sc.name = 'LV1';
        //     // cc.log(this.sc.name);
        //     window.userData.name = this.sc.name;
        //     this.sc.setPosition(cc.p((Math.random()*0.8+0.1)*size.width - size.width/2, (Math.random()*0.8+0.1)*size.height - size.height/2));

        //     this.node.addChild(this.sc);
        //     this.scroll_array.push(this.sc);
        // }
        //固定位置
        var sc;
        sc = cc.instantiate(this.rubbish);
        sc.name = 'LV1';
        window.userData.name = sc.name;
        sc.setPosition(cc.p(size.width*2/9 - size.width/2, size.height*2/6 - size.height/2 ));
        this.node.addChild(sc);
        this.scroll_array.push(sc);
        
        sc = cc.instantiate(this.rubbish);
        sc.name = 'LV2';
        window.userData.name = sc.name;
        sc.setPosition(cc.p(size.width*4/9 - size.width/2, size.height*3/6 - size.height/2 ));
        this.node.addChild(sc);
        this.scroll_array.push(sc);
        
        sc = cc.instantiate(this.rubbish);
        sc.name = 'LV3';
        window.userData.name = sc.name;
        sc.setPosition(cc.p(size.width*4/9 - size.width/2, size.height*1/6 - size.height/2 ));
        this.node.addChild(sc);
        this.scroll_array.push(sc);
        
        sc = cc.instantiate(this.rubbish);
        sc.name = 'LV4';
        window.userData.name = sc.name;
        sc.setPosition(cc.p(size.width*6/9 - size.width/2, size.height*5/6 - size.height/2 ));
        this.node.addChild(sc);
        this.scroll_array.push(sc);
        
    },
});
