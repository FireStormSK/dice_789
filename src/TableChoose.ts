/**
 * Created by Programmer on 2016/1/6.
 */
class TableChoose extends egret.DisplayObjectContainer
{
    private _btnStart:egret.Sprite;
    private _bg:egret.Bitmap;

    public constructor()
    {
        super();
        if(this.stage)
        {
            this.init();
        }
        else
        {
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        }
    }
    private onAddToStage(event:egret.Event){
        //设置加载进度界面
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        this.init();
    }

    private init()
    {
        //游戏介绍界面，只有2个开始按钮和一个背景
        this._bg = new egret.Bitmap();
        this._bg.texture = RES.getRes("TablePage");
        this._bg.width = this.stage.stageWidth;
        this._bg.height = this.stage.stageHeight;
        this.addChild(this._bg);
        var Table:egret.TextField = new egret.TextField();
        Table.text="炒鸡简单的酒令游戏哦！/n";
        Table.x=100;
        Table.y=10;
        Table.height = 100;
        Table.width = 520;
        Table.size = 42;
        Table.textColor = 0x000000;
        Table.textAlign = egret.HorizontalAlign.CENTER;
        this.get();
    }
    private initTables(TableNum:number)
    {
        for(var i:number=1;i<=TableNum;i++)
        {
            var Table:egret.TextField = new egret.TextField();
            Table.text=(i).toString();
            Table.x=100;
            Table.y=100*i;
            Table.height = 100;
            Table.width = 520;
            Table.size = 42;
            Table.textColor = 0x000000;
            Table.textAlign = egret.HorizontalAlign.CENTER;
            Table.touchEnabled =true;
            Table.addEventListener(egret.TouchEvent.TOUCH_TAP,this.NewTableHandler,this);
            this.addChild(Table);
        }
        var btNewTable:egret.TextField = new egret.TextField();
        btNewTable.text = "开新桌"
        btNewTable.x = 100;
        btNewTable.y = 100*TableNum+100;
        btNewTable.bold = true;
        btNewTable.height = 100;
        btNewTable.width = 520;
        btNewTable.size = 42;
        btNewTable.textColor = 0x000000;
        btNewTable.textAlign = egret.HorizontalAlign.CENTER;
        btNewTable.touchEnabled =true;
        btNewTable.addEventListener(egret.TouchEvent.TOUCH_TAP,this.NewTableHandler,this);
        this.addChild(btNewTable);
    }
    private get():void
    {
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open("http://139.129.46.227:8080/f2f/dice/table.ff?gameid=10010",egret.HttpMethod.GET);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send();
        request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
    }
    private onGetIOError(event:egret.IOErrorEvent):void {
        console.log("get error : " + event);
    }
    private onGetComplete(event:egret.Event):void
    {
        var request = <egret.HttpRequest>event.currentTarget;
        var data = JSON.parse(request.response);
        Main.TABLENUM = data.tableCount;
        this.initTables(Main.TABLENUM);

    }
    private NewTableHandler(e:egret.TouchEvent)
    {
        var bt = <egret.TextField>e.target;
        bt.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.NewTableHandler,this);
        if(bt.text=="开新桌")
        {
            Main.TABLE =(Main.TABLENUM+1).toString();
        }
        else
        Main.TABLE=bt.text;
        console.log(Main.TABLE);
        this.dispatchEvent(new egret.Event("GameInit"));
    }

}