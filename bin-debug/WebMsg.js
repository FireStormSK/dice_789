/**
 * Created by Chris on 2016/1/16.
 */
var DiceEvent = (function (_super) {
    __extends(DiceEvent, _super);
    function DiceEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        _super.call(this, type, bubbles, cancelable);
        this.game = ""; //游戏		 必填
        this.table = ""; //桌号		 必填
        this.msg = ""; //报文		 必填
        this.from = ""; //发送方		 必填
        this.to = ""; //接收方 		 非必填
        this.date = ""; //发送时间	 必填
    }
    var d = __define,c=DiceEvent,p=c.prototype;
    DiceEvent.PLAY = "play";
    DiceEvent.USERCHANGE = "userchange";
    DiceEvent.WATCH = "watch";
    return DiceEvent;
})(egret.Event);
egret.registerClass(DiceEvent,'DiceEvent');
