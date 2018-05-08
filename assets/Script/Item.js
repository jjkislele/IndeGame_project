// const getInt = function (num) {
//     // var ratio = cc.random0To1();
//     switch(num){
//         case 0:
//             this.ratio = 0;
//             break;
//         case 1:
//             this.ratio = 1;
//             break;
//         case 2:
//             this.ratio = 2;
//             break;
//         case 3:
//             this.ratio = 3;
//             break;
//     }
//     return this.ratio;
// };

cc.Class({
    extends: cc.Component,

    properties: {
        sfHeroes: {
            default: [],
            type: cc.SpriteFrame
        },
        labelLevel: cc.Label,
        spHero: cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {
        if(window.userData.item.length > 0){
            this.refresh();
        }
        
    },

    refresh: function () {
        //for(var i = 0; i < ; i++){
        if(window.userData.item.length>0){
            this.heroIdx = window.userData.item[window.userData.item.length-1];
            cc.log('LV.' + (this.heroIdx+1));
            this.spHero.spriteFrame = this.sfHeroes[this.heroIdx];
            this.labelLevel.string = 'LV.' + (this.heroIdx+1);
        }
            
        //}
        // switch(window.userData.item){
        //     case 0:
        //         this.heroIdx = getInt(0);
        //         this.levelIdx = getInt(0);
        //         this.labelLevel.string = 'LV.' + this.levelIdx;
        //         this.spHero.spriteFrame = this.sfHeroes[this.heroIdx];
        //         break;
        //     case 'story1':
        //         this.heroIdx = getInt(1);
        //         this.levelIdx = getInt(1);
        //         this.labelLevel.string = 'LV.' + this.levelIdx;
        //         this.spHero.spriteFrame = this.sfHeroes[this.heroIdx];
        //         break;
        //     case 'story2':
        //         this.heroIdx = getInt(2);
        //         this.levelIdx = getInt(2);
        //         this.labelLevel.string = 'LV.' + this.levelIdx;
        //         this.spHero.spriteFrame = this.sfHeroes[this.heroIdx];
        //         break;
        //     case 'story3':
        //         this.heroIdx = getInt(3);
        //         this.levelIdx = getInt(3);
        //         this.labelLevel.string = 'LV.' + this.levelIdx;
        //         this.spHero.spriteFrame = this.sfHeroes[this.heroIdx];
        //         break;
        // }
        
        cc.log("进来了！");
    },
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
