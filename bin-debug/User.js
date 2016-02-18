/**
 *
 * @author
 *
 */
var User = (function (_super) {
    __extends(User, _super);
    function User() {
        _super.call(this);
        this.Id = "";
        this.Role = "";
        this.Name = "";
        this.JoinIndex = 0;
        this.PositionIndex = 0;
    }
    var d = __define,c=User,p=c.prototype;
    return User;
})(egret.Sprite);
egret.registerClass(User,'User');
