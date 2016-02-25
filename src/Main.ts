/**
 * Copyright by SuKe 2016 ^-^
 */

class Main extends egret.DisplayObjectContainer{

    public static STATE_INTRO:number = 1;
    public static STATE_GAME:number = 2;
    public static STATE_TABLE:number = 3;
    public static ME:User;
    public static CANPLAY:boolean = false;
    public static PLAYERNUM:number = 0;
    public static PLAYERLIST:Array<User>;
    public static PLAYER_NAME:string="";
    public static GAMEDIRECTION:string="";
    public static TABLE:string="";
    public static TABLENUM:number=0;
    private loadingView:LoadingUI;
    private _state:number;
    private _curState:egret.DisplayObject;
    private _websocket:WebSocketCtrl;
    private _bg:egret.Sprite;
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        this.loadingView  = new LoadingUI();
        this.stage.addChild(this.loadingView);

        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resources.json","resource/");
    }


    private onConfigComplete(event:RES.ResourceEvent):void{

        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("preload");
    }

    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            //资源加载完毕，开始创建游戏场景
            this.createGameScene();
        }
    }
    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
        }
    }

    private textContainer:egret.Sprite;

    /**
     * 创建游戏场景
     */
    private createGameScene():void
    {
        //添加游戏背景
        this._bg = new egret.Sprite();
        this._bg.graphics.beginFill(0x00ff00);
        this._bg.graphics.drawRect(0,0,this.stage.stageWidth,this.stage.stageHeight);
        this._bg.graphics.endFill();
        this.addChild(this._bg);
        this._state = -1;

        //游戏的各个界面通过状态机实现，首先进入的是游戏介绍界面,每个界面会初始化一次
      //  this.state = Main.STATE_GAME;
        this.state = Main.STATE_INTRO;
        //this.state = Main.STATE_TABLE;
        //this.state = Main.STATE_OVER;
    }

    public set state(s:number)
    {
        if(this._state != s)
        {
            this._state = s;
            if(this._curState && this._curState.parent)
            {
                this.removeChild(this._curState);
            }
            switch(this._state)
            {

                case Main.STATE_INTRO:
                    //创建游戏介绍界面
                    this._curState = new StateIntro();
                    //当点击游戏介绍界面后，进入游戏主界面
                    this._curState.addEventListener("TableChoose",this.tableChoose,this);
                    this.addChild(this._curState);
                    break;
                case Main.STATE_TABLE:
                    this._curState = new TableChoose();

                    this._curState.addEventListener("GameInit",this.gameInit,this);

                    this.addChild(this._curState);
                    break;
                case Main.STATE_GAME:
                    //创建游戏主界面
                    //
                    var _Gameon:GameOn = new GameOn();
                        this._websocket.addEventListener(DiceEvent.USERCHANGE,_Gameon.onUserChange,_Gameon);
                        this._websocket.addEventListener(WatchEvent.WATCH,_Gameon.onWatch,_Gameon);
                        this._websocket.addEventListener("OnMyTurn",_Gameon.onMyTurn,_Gameon);
                    this._curState = _Gameon;
                    this._curState.addEventListener(DiceEvent.PLAY,this._websocket.onSocketSend,this._websocket);
                    this._curState.addEventListener(DiceEvent.POSITIONCHANGE,this._websocket.onSocketSend,this._websocket);
                    //当游戏结束后进入游戏结束界面
                    //  this._curState.addEventListener("GameOver",this.gameOver,this);
                    this.addChild(this._curState);
                    break;
                /*
                 case Main.STATE_OVER:
                 //创建游戏结束界面
                 this._curState = new StateOver();
                 //当点击重新开始游戏时，再次进入游戏主界面
                 this._curState.addEventListener("GameStart",this.gameStart,this);
                 this.addChild(this._curState);
                 break;
                 */
            }
        }
    }
    private gameInit(e:egret.Event)
    {
        Main.ME = new User();
        switch(Math.floor(Math.random()*9))
        {
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
        this._websocket.addEventListener("GameStart",this.gameStart,this);
        this.addChild(this._websocket);
    }
    private gameStart(e:egret.Event)
    {

        this.state = Main.STATE_GAME;
        console.log("GameStart")
    }
    private tableChoose(e:egret.Event)
    {
        this.state = Main.STATE_TABLE;
    }


}


