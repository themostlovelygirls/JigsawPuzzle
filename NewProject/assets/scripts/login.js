cc.Class({
  extends: cc.Component,

  properties: {

  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {

  },

  start() {
    try {
      wx.cloud.init();
      this.auth2();
    } catch (ex) {
      console.log(ex);
    }
    
  },

  auth2() {

    console.log("auth");

    let exportJson = {};
    let sysInfo = window.wx.getSystemInfoSync();
    //获取微信界面大小
    let width = sysInfo.screenWidth;
    let height = sysInfo.screenHeight;

    let self = this;
    window.wx.getSetting({
      success(res) {
        console.log(res.authSetting);
        if (res.authSetting["scope.userInfo"]) {
          console.log("用户已授权");
          window.wx.getUserInfo({
            success(res) {
              /* console.log(res); */
              exportJson.userInfo = res.userInfo;
              //此时可进行登录操作
              let username = res.userInfo.nickName;
              let avatarUrl = res.userInfo.avatarUrl
              self.login(username, avatarUrl, self);
            }
          });
        } else {
          console.log("用户未授权");
          let button = window.wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
              left: 0,
              top: 0,
              width: width,
              height: height,
              backgroundColor: '#00000000', //最后两位为透明度
              color: '#ffffff',
              fontSize: 20,
              textAlign: "center",
              lineHeight: height,
            }
          });
          button.onTap((res) => {
            if (res.userInfo) {
              console.log("用户授权:", res);
              exportJson.userInfo = res.userInfo;
              //此时可进行登录操作
              let username = res.userInfo.nickName;
              let avatarUrl = res.userInfo.avatarUrl;
              self.login(username, avatarUrl,self);
              button.destroy();
            } else {
              console.log("用户拒绝授权:", res);
            }
          });
        }
      }
    })
  },

  login(username, avatarUrl, self) {
    console.log("in login");
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          console.log("发起网络请求");
          console.log(res.code);

          wx.cloud.callFunction({
            name: 'login',
            data: {
              jscode: res.code,
            },
            success: function (res) {
              /* console.log(res.result); */
              require('global').userid = res.result.openid;
              require('global').username = username;
              require('global').avatarUrl = (avatarUrl + "?aaa=aa.jpg");

              self.node.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
                cc.director.loadScene("mainScene");
            })));

            },
            fail: console.error
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  // update (dt) {},
});