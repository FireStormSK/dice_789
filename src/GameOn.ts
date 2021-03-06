/**
 * Created by Programmer on 2016/1/7.
 */
import Bitmap = egret.Bitmap;

class GameOn extends egret.Sprite
{
    private _bg:Bitmap;
    private _dice1:Bitmap;
    private _dice2:Bitmap;
    private _box:Bitmap;
    private _tooltip:egret.TextField;
    private _arrow:egret.Sprite;
    private _UserList:egret.DisplayObjectContainer;

    public constructor(){
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

    private init():void
    {
        console.log("initGameOn");
        //监听轮到自己
        this.addEventListener("OnMyTurn",this.onMyTurn,this);
        //添加背景
        this._bg = new egret.Bitmap();
        this._bg.texture = RES.getRes("bg1");
        this._bg.width = this.stage.stageWidth;
        this._bg.height = this.stage.stageHeight;
        this.addChild(this._bg);
        //添加两个骰子
        this._dice1 = new Bitmap();
        this._dice1.texture = RES.getRes("dice_1");
        this._dice1.x = 290;
        this._dice1.y = 730;
        this._dice1.scaleX = 0.8;
        this._dice1.scaleY = 0.8;
        this.addChild(this._dice1);
        this._dice2 = new Bitmap();
        this._dice2.texture = RES.getRes("dice_1");
        this._dice2.x = 365;
        this._dice2.y = 730;
        this._dice2.scaleX = 0.8;
        this._dice2.scaleY = 0.8;
        this.addChild(this._dice2);
        //骰盅
        this._box = new egret.Bitmap();
        this._box.texture = RES.getRes("box");
        this._box.x = 220;
        this._box.y = 510;
        this._box.scaleX = 1.5;
        this._box.scaleY = 1.5;
        this._box.touchEnabled =true;
        this.addChild(this._box);
        //桌名
        var TableName:egret.TextField = new egret.TextField();
        TableName.text = "桌ID："+Main.TABLE;
        TableName.x = 10;
        TableName.y = 10;
        this.addChild(TableName);
        //提示语
        this._tooltip = new egret.TextField();

        this._tooltip.x = 100;
        this._tooltip.y = 140;
        this._tooltip.bold = true;
        this._tooltip.height = 100;
        this._tooltip.width = 520;
        this._tooltip.size = 42;
        this._tooltip.textColor = 0xFF0000;
        this._tooltip.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(this._tooltip);
        if(Main.CANPLAY)
        {
            this._box.addEventListener(egret.TouchEvent.TOUCH_TAP,this.boxTapHandler,this);
            this._tooltip.text = "点击骰盅，按照箭头顺序轮到下一位\nRock and Roll";
        }
        else
            this._tooltip.text = "等待"+Main.PLAYERLIST[0].Name+"开始游戏";
        //用户列表
        this.AddUserList();
        this.createArrow();
        this._arrow.x = 380;
        this._arrow.y = 290;
        this._arrow.alpha = 0;
        this.addChild(this._arrow);
    }

    private get():void
    {
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open("http://139.129.46.227:8080/f2f/dice/player.ff?gameid=10010&tableid="+Main.TABLE,egret.HttpMethod.GET);
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
        console.log("gameon人数"+data.playerCount+"playerList:"+data.playerList);
        Main.PLAYERNUM = data.playerCount;
        Main.PLAYERLIST = new Array<User>();
        for(var i:number = 0;i<data.playerCount;i++)
        {
            var user: User = new User();
            user.Id = data.playerList[i].id;
            user.Role = data.playerList[i].role;
            user.Name = data.playerList[i].name;
            user.JoinIndex = data.playerList[i].joinIndex;
            user.PositionIndex = data.playerList[i].positionIndex;
            Main.PLAYERLIST.push(user);
        }
        this.RestartGame();
    }
    private RestartGame()
    {
        this.removeChild(this._UserList);
        this.AddUserList();

        this._box.x = 220;
        this._box.y = 510;
        this._arrow.alpha = 0;
        //更新玩家信息
        for(var i: number = 0;i < Main.PLAYERNUM;i++)
        {
            if(Main.PLAYERLIST[i].Name == Main.ME.Name)
            {
                Main.ME.Id = Main.PLAYERLIST[i].Id;
                Main.ME.Role = Main.PLAYERLIST[i].Role;
                Main.ME.JoinIndex = Main.PLAYERLIST[i].JoinIndex;
                Main.ME.PositionIndex = Main.PLAYERLIST[i].PositionIndex;
            }
            if(Main.ME.Role == "1") {
                Main.CANPLAY = true;
                this._tooltip.text = "我是游戏主持人，提示大家准备好\n点击骰盅游戏即可开始！";
            }
            else {
                Main.CANPLAY = false;
                this._tooltip.text = "等待主持人开始游戏";
            }
        }

        this.onMyTurn();
    }
    private AddUserList()
    {
        this._UserList = new egret.DisplayObjectContainer();
        var num:number = Main.PLAYERNUM;
       for(var i:number=0;i<num;i++)
        {
            this.AddUser(i);
        }
        if(this.stage)
        {
            this._UserList.y = this.stage.stageHeight - 150;
        }
        console.log("人数："+Main.PLAYERNUM);
        this.addChild(this._UserList);
    }

    private AddUser(usernum:number)
    {
        var user = new egret.DisplayObjectContainer();
        var User_Avatar = new egret.Bitmap();
        user.width = 100;
        user.height = 100;
        User_Avatar.texture = RES.getRes("boy");
        User_Avatar.x = 18;
        User_Avatar.y = 5;
        User_Avatar.width = 64;
        User_Avatar.height = 64;
        var User_Name = new egret.TextField();
        if(Main.PLAYERLIST[usernum].Name==Main.ME.Name)
        {
            User_Name.textColor = 0xFF0000;
        }
        user.name = Main.PLAYERLIST[usernum].Name;
        User_Name.text = Main.PLAYERLIST[usernum].Name;
        User_Name.x = 0;
        User_Name.y = 70;
        User_Name.width = 100;
        User_Name.textAlign = egret.HorizontalAlign.CENTER;
        User_Name.size = 20;
        user.addChild(User_Avatar);
        user.addChild(User_Name);
        user.x = usernum * 100 + 60;

        console.log("添加用户:"+User_Name.text+usernum);
        if(Main.ME.Role == "1")
        {
             user.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.UserPostionHandler,this);
             user.addEventListener(egret.TouchEvent.TOUCH_END,this.ChagePosition,this);
             user.touchEnabled = true;
             console.log("我是管理员");
        }
        this._UserList.addChild(user);
    }
   
    private UserPostionHandler(evt: egret.TouchEvent): void {
        if(evt.type == egret.TouchEvent.TOUCH_MOVE) {
            this._UserList.setChildIndex(evt.target,1);
            evt.target.x = evt.stageX-50;
        }
    }
    private ChagePosition(evt:egret.TouchEvent):void
    { 
        if(evt.type == egret.TouchEvent.TOUCH_END) {
            console.log("失去焦点");
            for(var i: number = 0;i < Main.PLAYERNUM;i++) {           
                Main.PLAYERLIST[i].x = (this._UserList.getChildByName(Main.PLAYERLIST[i].Name)).x;
                console.log(Main.PLAYERLIST[i].x);
            }
            this.bubbleSort();
            this.bubbleSortMovie();
        }
    }
    private bubbleSortMovie(): void
    {
        for(var i: number = 0;i < Main.PLAYERNUM;i++)
        {
            var tw = egret.Tween.get(this._UserList.getChildByName(Main.PLAYERLIST[i].Name));
            
            tw.to({ x: (i*100+60),y: (0) },500);
        }
    }
    private bubbleSort():void
    {
        for(var i: number=0;i < Main.PLAYERNUM;i++)
        {
            for(var j: number=0;j < Main.PLAYERNUM - i - 1;j++)
            { 
                if(Main.PLAYERLIST[j].x>Main.PLAYERLIST[j+1].x)
                {
                    var tmp = Main.PLAYERLIST[j];
                    Main.PLAYERLIST[j] = Main.PLAYERLIST[j + 1];
                    Main.PLAYERLIST[j + 1] = tmp;
                }
            }
        }
        var playEvent: DiceEvent = new DiceEvent(DiceEvent.POSITIONCHANGE);
        playEvent.from = Main.ME.Name;
        this.dispatchEvent(playEvent);
    }
    /*
function bubbleSort($numbers) {
    $cnt = count($numbers);
    for($i = 0;$i < $cnt;$i++) {
        for($j = 0;$j < $cnt - $i - 1;$j++) {
            if($numbers[$j] > $numbers[$j + 1]) {
                $temp = $numbers[$j];
                $numbers[$j] = $numbers[$j + 1];
                $numbers[$j + 1] = $temp;
            }
        }
    }
    return $numbers;
}*/
    private createArrow()
    {
        //绘制划线的提示箭头
        this._arrow = new egret.Sprite();
        this._arrow.graphics.lineStyle( 20, 0xffff99 );
        this._arrow.graphics.moveTo(-150, 0);
        this._arrow.graphics.lineTo(150, 0);
        this._arrow.graphics.moveTo(50, -50);
        this._arrow.graphics.lineTo(150, 0);
        this._arrow.graphics.moveTo(50, 50);
        this._arrow.graphics.lineTo(150, 0);
    }
    private boxTapHandler(e:egret.TouchEvent):void
    {
        this._box.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.boxTapHandler,this);
        this._arrow.alpha = 0;
        this._box.x=220;
        this._box.y=510;
        this.PlayDice();
        var tw = egret.Tween.get(this._box);
        tw.to({x:240,y:510},100);
        tw.to({x:200,y:510},100);
        tw.to({x:240,y:510},100);
        tw.to({x:200,y:510},100);
        tw.to({x:240,y:510},100);
        tw.to({x:200,y:510},100);
        tw.to({x:240,y:510},100);
        tw.to({x:200,y:510},100);
        tw.to({x:240,y:510},100);
        tw.to({x:220,y:510},100);
        tw.to({x:220,y:360},500);
    }
    private PlayDice():void
    {
        Main.PLAYER_NAME = Main.ME.Name;
        var dicenum1:number = Math.floor(Math.random()*(6)+1);
        switch (dicenum1)
        {
            case 1:
                this._dice1.texture = RES.getRes("dice_1");
                break;
            case 2:
                this._dice1.texture = RES.getRes("dice_2");
                break;
            case 3:
                this._dice1.texture = RES.getRes("dice_3");
                break;
            case 4:
                this._dice1.texture = RES.getRes("dice_4");
                break;
            case 5:
                this._dice1.texture = RES.getRes("dice_5");
                break;
            case 6:
                this._dice1.texture = RES.getRes("dice_6");
                break;
        }
        var dicenum2:number = Math.floor(Math.random()*(6)+1);
        switch (dicenum2)
        {
            case 1:
                this._dice2.texture = RES.getRes("dice_1");
                break;
            case 2:
                this._dice2.texture = RES.getRes("dice_2");
                break;
            case 3:
                this._dice2.texture = RES.getRes("dice_3");
                break;
            case 4:
                this._dice2.texture = RES.getRes("dice_4");
                break;
            case 5:
                this._dice2.texture = RES.getRes("dice_5");
                break;
            case 6:
                this._dice2.texture = RES.getRes("dice_6");
                break;
        }
        this.Logic(dicenum1,dicenum2);
    }
    private WebSend(msg:string):void
    {
        var playEvent:DiceEvent = new DiceEvent(DiceEvent.PLAY);
        playEvent.from = Main.ME.Name;
        playEvent.msg=msg;
        //发送要求事件
        this.dispatchEvent(playEvent);
    }
    private Logic(dice1:number,dice2:number):void
    {

        this._tooltip.text = "";
        this._arrow.alpha = 0.7;
        if(dice1+dice2==7)
        {
            this._tooltip.text = "我就安静的倒酒，\n继续摇！";
            this.WebSend('{"Direction":"'+Main.GAMEDIRECTION+'","NextPlayer":"'+Main.ME.Name+'","dice1":"'+dice1+'","dice2":"'+dice2+'"}');
            this._box.addEventListener(egret.TouchEvent.TOUCH_TAP,this.boxTapHandler,this);
            return;
        }
        else if(dice1+dice2==8)
        {
            this._tooltip.text = "喝一半\n继续摇！";
            this.WebSend('{"Direction":"'+Main.GAMEDIRECTION+'","NextPlayer":"'+Main.ME.Name+'","dice1":"'+dice1+'","dice2":"'+dice2+'"}');
            this._box.addEventListener(egret.TouchEvent.TOUCH_TAP,this.boxTapHandler,this);
            return;
        }
        else if(dice1+dice2==9)
        {
            this._tooltip.text ="喝光吧\n继续摇！"
            this.WebSend('{"Direction":"'+Main.GAMEDIRECTION+'","NextPlayer":"'+Main.ME.Name+'","dice1":"'+dice1+'","dice2":"'+dice2+'"}');
            this._box.addEventListener(egret.TouchEvent.TOUCH_TAP,this.boxTapHandler,this);
            return;
        }
        if(dice1==dice2)
        {
            if(Main.GAMEDIRECTION=="R")
            {
                Main.GAMEDIRECTION = "L";
            }
            else
            {
                Main.GAMEDIRECTION = "R";
            }
            if(dice1==1)
            {
                this._tooltip.text ="恭喜你，酒司令，指定人喝吧！\n继续摇！";
                this.WebSend('{"Direction":"'+Main.GAMEDIRECTION+'","NextPlayer":"'+Main.ME.Name+'","dice1":"'+dice1+'","dice2":"'+dice2+'"}');
                this._box.addEventListener(egret.TouchEvent.TOUCH_TAP,this.boxTapHandler,this);
            }
            this._tooltip.text += "现在调转轮转顺序！";
            this._arrow.rotation += 180;
            this.onTurn(Main.GAMEDIRECTION,dice1,dice2);
        }
        else
        {
            this._tooltip.text = "下一位！";
            this.onTurn(Main.GAMEDIRECTION,dice1,dice2);
        }
    }
    private onTurn(dirc:string,dice1:number,dice2:number):string
    {
        var i: number=0;
        i=Main.ME.PositionIndex;
        if(dirc=="R")
        {   
            //向右转
            i ++;
            if(i > Main.PLAYERNUM)
                i = 1;
        }
        if(dirc == "L")
        {
            i--;
            if(i <= 0)
                i = Main.PLAYERNUM;
        }
        console.log("方向："+dirc+"playerlist:"+Main.PLAYERLIST+"i:"+i+"轮到："+Main.PLAYERLIST[i-1].Name);
        this.WebSend('{"Direction":"' + Main.GAMEDIRECTION + '","NextPlayer":"' + Main.PLAYERLIST[i - 1].Name+'","dice1":"'+dice1+'","dice2":"'+dice2+'"}');
        return Main.PLAYER_NAME;
    }
    public onMyTurn():void
    {
        if(Main.CANPLAY)
        {
            this._box.addEventListener(egret.TouchEvent.TOUCH_TAP,this.boxTapHandler,this);
         //   this._tooltip.text = "现在轮到我，点击骰盅开始摇！";
            console.log("添加盒子监听");
        }
        else
        {
            console.log("换人了，不是我");
        }
    }
    public onUserChange(evt:DiceEvent):void
    {
        console.log("执行一次userchange");
        this.get();
        var ChangeType:string = evt.alert.msg.substring(evt.alert.msg.length-6);
        if(ChangeType=="进入游戏！！")
        {
            console.log("收到用户变化数据:"+"进入");
        }
        else if(ChangeType=="退出游戏！！")
        {
            console.log("收到用户变化数据:"+"退出");
        }
      
    }
    private updateArrow(dirc:string):void
    {
        if(dirc=="R")
        {
            this._arrow.rotation = 0;
        }
        else if(dirc=="L")
        {
            this._arrow.rotation = 180;
        }
        else
            alert("箭头方向有错误！");
    }
    private updateDice(dice1num:string,dice2num:string):void
    {
        switch (dice1num)
        {
            case "1":
                this._dice1.texture = RES.getRes("dice_1");
                break;
            case "2":
                this._dice1.texture = RES.getRes("dice_2");
                break;
            case "3":
                this._dice1.texture = RES.getRes("dice_3");
                break;
            case "4":
                this._dice1.texture = RES.getRes("dice_4");
                break;
            case "5":
                this._dice1.texture = RES.getRes("dice_5");
                break;
            case "6":
                this._dice1.texture = RES.getRes("dice_6");
                break;
        }
        switch (dice2num)
        {
            case "1":
                this._dice2.texture = RES.getRes("dice_1");
                break;
            case "2":
                this._dice2.texture = RES.getRes("dice_2");
                break;
            case "3":
                this._dice2.texture = RES.getRes("dice_3");
                break;
            case "4":
                this._dice2.texture = RES.getRes("dice_4");
                break;
            case "5":
                this._dice2.texture = RES.getRes("dice_5");
                break;
            case "6":
                this._dice2.texture = RES.getRes("dice_6");
                break;
        }
        if(Main.PLAYER_NAME==Main.ME.Name)
        {
            return;
        }
        var tw = egret.Tween.get(this._box);
        tw.to({x:240,y:510},100);
        tw.to({x:200,y:510},100);
        tw.to({x:240,y:510},100);
        tw.to({x:200,y:510},100);
        tw.to({x:240,y:510},100);
        tw.to({x:200,y:510},100);
        tw.to({x:240,y:510},100);
        tw.to({x:200,y:510},100);
        tw.to({x:240,y:510},100);
        tw.to({x:220,y:510},100);
        tw.to({x:220,y:360},500);
        console.log("更新dice"+dice1num+dice2num);
    }
    private updateTooltip(msg:string):void
    {
        this._tooltip.text = msg;
    }
    public onWatch(evt:WatchEvent):void
    {
        this.updateArrow(evt.direction);
        this.updateDice(evt.dice1.toString(),evt.dice2.toString());
        this.updateTooltip(evt.msg);
        console.log("watchEvt:NextP "+evt.nextPlayerPosition+"dice: "+evt.dice1+evt.dice2);
    }

}