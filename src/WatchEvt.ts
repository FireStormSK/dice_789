/**
 * Created by Chris on 2016/1/16.
 */
class WatchEvent extends egret.Event
{
    public static WATCH:string = "watch";
    public direction:string=""; //方向
    public PlayerPosition:number = 0;//现在玩家
    public nextPlayerPosition: number = 0;//轮到玩家
    public dice1:number=0;
    public dice2:number=0;
    public msg:string = "";
    public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false)
    {
        super(type,bubbles,cancelable);
    }
}