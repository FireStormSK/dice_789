/**
 * Created by Programmer on 2016/1/6.
 */
var StateIntro = (function (_super) {
    __extends(StateIntro, _super);
    function StateIntro() {
        _super.call(this);
        if (this.stage) {
            this.init();
        }
        else {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }
    }
    var d = __define,c=StateIntro,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.init();
    };
    p.init = function () {
        //游戏介绍界面，只有一个开始按钮和一个背景
        //this.addChild(this._btnStart);
        this._bg = new egret.Bitmap();
        this._bg.texture = RES.getRes("StartPage");
        this._bg.width = this.stage.stageWidth;
        this._bg.height = this.stage.stageHeight;
        this._bg.touchEnabled = true;
        this._bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapHandler, this);
        this.addChild(this._bg);
    };
    p.tapHandler = function (e) {
        //在界面上点击下，就开始游戏啦
        this.dispatchEvent(new egret.Event("TableChoose"));
    };
    return StateIntro;
})(egret.DisplayObjectContainer);
egret.registerClass(StateIntro,'StateIntro');
