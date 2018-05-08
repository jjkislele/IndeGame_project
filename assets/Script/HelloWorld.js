cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        text: 'Hello, World!',
        mask: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
    },

    // called every frame
    update: function (dt) {
        this.mask.x++;
        this.mask.y++;
    },
});
