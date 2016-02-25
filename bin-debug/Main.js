/**
 * Copyright by SuKe 2016 ^-^
 */
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resources.json", "resource/");
    };
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    };
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            //资源加载完毕，开始创建游戏场景
            this.createGameScene();
        }
    };
    /**
     * preload资源组加载进度
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     */
    p.createGameScene = function () {
        //添加游戏背景
        this._bg = new egret.Sprite();
        this._bg.graphics.beginFill(0x00ff00);
        this._bg.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        this._bg.graphics.endFill();
        this.addChild(this._bg);
        this._state = -1;
        //游戏的各个界面通过状态机实现，首先进入的是游戏介绍界面,每个界面会初始化一次
        //  this.state = Main.STATE_GAME;
        this.state = Main.STATE_INTRO;
        //this.state = Main.STATE_TABLE;
        //this.state = Main.STATE_OVER;
    };
    d(p, "state",undefined
        ,function (s) {
            if (this._state != s) {
                this._state = s;
                if (this._curState && this._curState.parent) {
                    this.removeChild(this._curState);
                }
                switch (this._state) {
                    case Main.STATE_INTRO:
                        //创建游戏介绍界面
                        this._curState = new StateIntro();
                        //当点击游戏介绍界面后，进入游戏主界面
                        this._curState.addEventListener("TableChoose", this.tableChoose, this);
                        this.addChild(this._curState);
                        break;
                    case Main.STATE_TABLE:
                        this._curState = new TableChoose();
                        this._curState.addEventListener("GameInit", this.gameInit, this);
                        this.addChild(this._curState);
                        break;
                    case Main.STATE_GAME:
                        //创建游戏主界面
                        //
                        var _Gameon = new GameOn();
                        this._websocket.addEventListener(DiceEvent.USERCHANGE, _Gameon.onUserChange, _Gameon);
                        this._websocket.addEventListener(WatchEvent.WATCH, _Gameon.onWatch, _Gameon);
                        this._websocket.addEventListener("OnMyTurn", _Gameon.onMyTurn, _Gameon);
                        this._curState = _Gameon;
                        this._curState.addEventListener(DiceEvent.PLAY, this._websocket.onSocketSend, this._websocket);
                        this._curState.addEventListener(DiceEvent.POSITIONCHANGE, this._websocket.onSocketSend, this._websocket);
                        //当游戏结束后进入游戏结束界面
                        //  this._curState.addEventListener("GameOver",this.gameOver,this);
                        this.addChild(this._curState);
                        break;
                }
            }
        }
    );
    p.gameInit = function (e) {
        Main.ME = new User();
        switch (Math.floor(Math.random() * 9)) {
            case 0:
                Main.ME.Name = "阿土仔";
                break;
            case 1:
                Main.ME.Name = "大老千";
                break;
            case 2:
                Main.ME.Name = "钱夫人";
                break;
            case 3:
                Main.ME.Name = "孙小美";
                break;
            case 4:
                Main.ME.Name = "林娇娇";
                break;
            case 5:
                Main.ME.Name = "金贝贝";
                break;
            case 6:
                Main.ME.Name = "本宫宝藏";
                break;
            case 7:
                Main.ME.Name = "糖糖";
                break;
            case 8:
                Main.ME.Name = "疯狂的苏可";
                break;
        }
        this._websocket = new WebSocketCtrl();
        this._websocket.addEventListener("GameStart", this.gameStart, this);
        this.addChild(this._websocket);
    };
    p.gameStart = function (e) {
        this.state = Main.STATE_GAME;
        console.log("GameStart");
    };
    p.tableChoose = function (e) {
        this.state = Main.STATE_TABLE;
    };
    Main.STATE_INTRO = 1;
    Main.STATE_GAME = 2;
    Main.STATE_TABLE = 3;
    Main.CANPLAY = false;
    Main.PLAYERNUM = 0;
    Main.PLAYER_NAME = "";
    Main.GAMEDIRECTION = "";
    Main.TABLE = "";
    Main.TABLENUM = 0;
    return Main;
})(egret.DisplayObjectContainer);
egret.registerClass(Main,'Main');
