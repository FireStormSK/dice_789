import tr = egret.sys.tr;
/**
 * Created by Programmer on 2016/1/18.
 */
class WebSocketCtrl extends egret.Sprite
{
    public static inited:boolean = false;
    private webSocket:egret.WebSocket;
    private urlLoder:egret.URLLoader;
    private i:number = 0;
    private _WebState:egret.DisplayObject;
    public constructor()
    {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }
    private onAddToStage(event:egret.Event){
        //设置加载进度界面
        this.WebSocketInit();
    }
    private WebSocketInit():void
    {
        this.i++;
   //     this.post();
        //登入
        this.webSocket = new egret.WebSocket();
        this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this.webSocket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        var UrlStr:string = " ws://139.129.46.227:8080/f2f/ws/dice/"+Main.TABLE+"/" + Main.ME.Name;
        this.webSocket.connectByUrl(UrlStr);
        console.log("初始化websocket:"+UrlStr);
    }
    private get():void
    {
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(" http://139.129.46.227:8080/f2f/dice/player.ff?gameid=10010&tableid="+Main.TABLE,egret.HttpMethod.GET);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send();
        request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);

/*        //  var url:string ="http://httpbin.org/get";
        var url:string = "http://120.25.92.210:8080/F2F/ServerServlet";
        var loader:egret.URLLoader = new egret.URLLoader();
        // 设置返回数据格式
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        loader.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
        var request:egret.URLRequest = new egret.URLRequest(url);
        request.method = egret.URLRequestMethod.GET;
        request.data = new egret.URLVariables("gameid=10010&tableid=1");
        loader.load(request);*/
    }
    private onGetIOError(event:egret.IOErrorEvent):void {
        console.log("get error : " + event);
    }
    private onGetComplete(event:egret.Event):void
    {
        var request = <egret.HttpRequest>event.currentTarget;
        var data = JSON.parse(request.response);
        console.log("获取人数返回:"+request.response);
        Main.PLAYERLIST = new Array<User>();
        if(data.playerCount == 1) {
            Main.PLAYER_NAME = Main.ME.name;
            Main.CANPLAY = true;
            Main.GAMEDIRECTION = "R";
        }
        Main.PLAYERNUM = data.playerCount;
        for(var i: number = 0;i < data.playerCount;i++)
        {
            var user = new User();
            user.Id = data.playerList[i].id;
            user.Name = data.playerList[i].name;                          
            user.Role = data.playerList[i].role;
            user.JoinIndex = data.playerList[i].joinIndex;
            user.PositionIndex = data.playerList[i].positionIndex;
            Main.PLAYERLIST.push(user);
            if(Main.ME.Name == user.Name)
            {
                Main.ME.Id = user.Id;
                Main.ME.Role = user.Role;
                Main.ME.JoinIndex = user.JoinIndex;
                Main.ME.PositionIndex = user.PositionIndex;
            }
        }
        this.dispatchEvent(new egret.Event("GameStart"));
        /*
        console.log("人数"+data.playerCount+"result:"+data.result+"msg:"+data.msg);
        if(data.playerCount==1)
        {
            Main.PLAYER_NAME = Main.ME.name;
            Main.CANPLAY = true;
            Main.GAMEDIRECTION = "R";
        }
        Main.PLAYERNUM = data.playerCount;
        Main.PLAYERLIST = new Array<User>();

       // Main.PLAYERLIST.push(Main.USERINFO_NAME);
        for(var i:number = 0;i<data.playerCount;i++)
        {
           Main.PLAYERLIST.push(data.playerList[i]);
        }
        this.dispatchEvent(new egret.Event("GameStart"));
        console.log("PlayerCount:"+data.playerCount +"PLAYERLIST:"+Main.PLAYERLIST+"发送GameStart");
        */
/*
        var loader:egret.URLLoader = <egret.URLLoader> event.target;
        var data:egret.URLVariables = loader.data;
        // 1.采用js的解析方法
        var js = eval("("+data.toString()+")");
        console.log("origin:"+js.origin);
        // 2.采用json解析器方法
        var txt = data.toString();
        var obj = JSON.parse(txt);
        console.log("origin:"+obj.origin);
*/
    }
/*    private post():void
    {
        this.urlLoder = new egret.URLLoader();
        var urlReq:egret.URLRequest = new egret.URLRequest();
        //urlReq.url = "http://httpbin.org/user-agent";
        urlReq.url = "http://120.25.92.210:8080/F2F/ServerServlet";
        urlReq.method = egret.URLRequestMethod.POST;
        urlReq.data = new egret.URLVariables("gameid=10010&tableid=1");
        this.urlLoder.dataFormat = egret.URLLoaderDataFormat.VARIABLES;
        this.urlLoder.load(urlReq);
        console.log("发送Post");
        //this.urlLoder.addEventListener(egret.Event.COMPLETE,this.onComplete,this);
        this.urlLoder.addEventListener(egret.Event.COMPLETE,this.onPostComplete,this);

    }
    private onPostComplete(event:egret.Event):void
    {
        var loader:egret.URLLoader = <egret.URLLoader>event.target;
        var data:egret.URLVariables = loader.data;
        console.log("返回POST"+data.toString());
    }*/
    public onSocketSend(evt:DiceEvent):void
    {
        var msg = '{"alert":{"type":"","msg":""}, "game":"dice", "table":'+Main.TABLE+', "msg":'+evt.msg+' , "from":"'+Main.ME.Name+'","to":"","date":""}';
        this.webSocket.writeUTF(msg);
        console.log("发送ws:"+msg);
    }
    private onSocketOpen():void {
        //  var msg = '{"alert":"", "game":"dice", "table":"1", "msg":"test" , "from":"LichKing","to":"","date":""}';
        var cmd = "Hello Egret WebSocket";
        this.get();
        //this.addEventListener(DiceEvent.PLAY,this.onSocketSend,this);
        console.log("连接成功" + cmd);
        //this.webSocket.writeUTF(msg);
    }

    private onReceiveMessage(e:egret.Event):void {
        var msg = this.webSocket.readUTF();
        console.log("收到数据：" + msg);
        var data = JSON.parse(msg);
        if(data.alert.type==11)
        {
            var playEvent:DiceEvent = new DiceEvent(DiceEvent.USERCHANGE);
            playEvent.alert = data.alert;
            this.dispatchEvent(playEvent);
            console.log("用户变化，发送:"+playEvent.alert.msg.toString());
            return;
        }

        var msgmsg = data.msg;
        Main.PLAYER_NAME = msgmsg.NextPlayer;
        Main.GAMEDIRECTION = msgmsg.Direction;
        if(data.from==Main.ME.name)
        {
            return;
        }
        var watchEvent:WatchEvent = new WatchEvent(WatchEvent.WATCH);
        watchEvent.direction = msgmsg.Direction;
        watchEvent.nextPlayerPosition = msgmsg.NextPlayer;
        watchEvent.dice1 = msgmsg.dice1;
        watchEvent.dice2 = msgmsg.dice2;
        watchEvent.PlayerPosition = data.from;
        
        if(Main.PLAYER_NAME==Main.ME.Name)
        {
            Main.CANPLAY = true;
            this.dispatchEvent(new egret.Event("OnMyTurn"));
            watchEvent.msg="现在轮到我";
            console.log("轮到我");
        }
        else
        {
            watchEvent.msg = watchEvent.PlayerPosition+"摇了"+(watchEvent.dice1+watchEvent.dice2).toString()+"点，轮到："+watchEvent.nextPlayerPosition;
            console.log("轮到："+Main.PLAYER_NAME);
        }
        this.dispatchEvent(watchEvent);

    }
}