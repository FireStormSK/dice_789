/**
 * Created by Chris on 2016/1/16.
 */
var WatchEvent = (function (_super) {
    __extends(WatchEvent, _super);
    function WatchEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        _super.call(this, type, bubbles, cancelable);
        this.direction = ""; //方向
        this.PlayerPosition = 0; //现在玩家
        this.nextPlayerPosition = 0; //轮到玩家
        this.dice1 = 0;
        this.dice2 = 0;
        this.msg = "";
    }
    var d = __define,c=WatchEvent,p=c.prototype;
    WatchEvent.WATCH = "watch";
    return WatchEvent;
})(egret.Event);
egret.registerClass(WatchEvent,'WatchEvent');
