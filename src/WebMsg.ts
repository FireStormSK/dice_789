/**
 * Created by Chris on 2016/1/16.
 */
class DiceEvent extends egret.Event
{
    public static PLAY:string = "play";
    public static USERCHANGE:string = "userchange";
    public static WATCH:string = "watch";
    public  alert:any;//公共喊话	 不填
    public  game:string=""; //游戏		 必填
    public  table:string="";//桌号		 必填
    public  msg:string="";//报文		 必填
    public  from:string="";//发送方		 必填
    public  to:string="";//接收方 		 非必填
    public  date:string="";//发送时间	 必填
    public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false)
    {
        super(type,bubbles,cancelable);
    }
}