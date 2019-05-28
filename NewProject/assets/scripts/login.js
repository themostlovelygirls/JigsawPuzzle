

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.auth2();
    },

    auth2() {
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
                            console.log(res);
                            exportJson.userInfo = res.userInfo;
                            //此时可进行登录操作
                            self.login();
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
                            self.login();
                            button.destroy();
                        } else {
                            console.log("用户拒绝授权:", res);
                        }
                    });
                }
            }
        })
    },

    login() {
        console.log("in login");
        wx.login({
            success (res) {
              if (res.code) {
                //发起网络请求
                console.log("发起网络请求");
                console.log(res.code);
                let url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxb6d120ce01fc2435&secret=d7d2085857514ffc3d27269c391e3d1a&js_code="+res.code+"&grant_type=authorization_code";
                wx.request({
                  url: url,
                  data: {
                    code: res.code
                  },
                  method: 'GET',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function(res) {
                    console.log(res);
                  },
                  fail: function() {
                    console.log("login error");
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
    },

    start () {

    },

    // update (dt) {},
});
