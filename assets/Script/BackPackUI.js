cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        items: cc.Prefab,
        totalCount: 0
    },
    
    // 初始化添加preItem
    init: function(home)
    {
        this.papers = [];
        this.home = home;
        for(let i = 0; i < this.totalCount; i++){
            let paper = this.addItem();
            this.papers.push(paper);
        }
        // if(this.node.getPosition() === this.player.getPosition()){
        //     let paper = this.addItem();
        //     this.papers.push(paper);
        // }
        // window.userData.name = 'story0';
        // cc.log(window.userData.name);
    },
    
    // 添加Item函数
    addItem: function()
    {
        // cc.log("aaaaaaa");
        let item = cc.instantiate(this.items);
        this.scrollView.content.addChild(item);
        return item;
    },
    
    // 发射事件假
    show: function()
    {
        // window.userData.gold+=100;
        this.node.emit('fade-in');
        this.toggleHomeBtns(false);
    },
    
    // 发射事件真
    hide: function()
    {
        // cc.log(window.userData.gold);
        this.node.emit('fade-out');
        this.toggleHomeBtns(true);
    },
    
    toggleHomeBtns: function(enable)
    {
        let group = this.node.parent.getChildByName("btn");
        if (!enable) {
            cc.eventManager.pauseTarget(group, true);
        } else {
            cc.eventManager.resumeTarget(group, true);
        }
    }
});
