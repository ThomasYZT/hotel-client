<template>
  <mainFrame :aside="false"
             :header="false"
             :showTool="false"
             :routerCom="false">
    <template slot="content">
      <div class="page-content">
        <div class="title-bar">
          <div class="title">松鼠智慧酒店</div>
        </div>
        <div class="auth-box">
          <div class="tab-wrapper">
            <Tabs value="login">
              <TabPane label="登 陆" name="login" :disabled="isLoading">
                <div class="login-box">
                  <i-form ref="loginForm"
                          :disabled="isLoading"
                          :model="loginFormData"
                          :rules="loginFormRule"
                          :label-width="60"
                          label-position="left">
                    <div class="form-item-wrapper">
                      <FormItem label="账号" prop="userName">
                        <i-input size="large"
                                 type="text"
                                 placeholder="用户名"
                                 maxlength="20"
                                 v-model="loginFormData.userName"
                                 @on-enter="handleSubmit('loginForm')"/>
                      </FormItem>
                      <FormItem label="密码" prop="password">
                        <i-input size="large"
                                 type="password"
                                 :password="true"
                                 placeholder="密码"
                                 v-model="loginFormData.password"
                                 @on-enter="handleSubmit('loginForm')"/>
                      </FormItem>
                    </div>
                    <!--<div class="login-tool">
                      <el-checkbox :disabled="isLoading">记住密码</el-checkbox>
                      <span class="forgot">忘记密码?</span>
                    </div>-->
                  </i-form>
                  <i-button :loading="isLoading"
                            type="primary"
                            class="submit-btn"
                            @click="handleSubmit('loginForm')">登 陆</i-button>
                </div>
              </TabPane>
              <!--<TabPane label="注 册" name="register" :disabled="isLoading">
                <div class="register-box">
                  <i-form ref="registForm"
                          :disabled="isLoading"
                          :model="registFormData"
                          :rules="registFormRule"
                          :label-width="60"
                          label-position="left">
                    <FormItem label="账号" prop="userName">
                      <i-input size="small" type="text" placeholder="用户名" maxlength="20" v-model="registFormData.userName" />
                    </FormItem>
                    <FormItem label="密码" prop="password">
                      <i-input size="small" type="password" :password="true" placeholder="密码" v-model="registFormData.password" />
                    </FormItem>
                  </i-form>
                  <i-button :loading="isLoading" type="primary" class="submit-btn"
                            @click="handleSubmit('registForm')">注 册</i-button>
                </div>
              </TabPane>-->
            </Tabs>
          </div>
        </div>
      </div>
    </template>
  </mainFrame>
</template>

<script>
import mainFrame from '../../components/Layout/mainFrame';
import ajax from '../../assets/api';
import { mapActions } from 'vuex';
export default {
  components: {
    mainFrame
  },
  data () {
    return {
      isLoading: false,
      loginFormData: {
        userName: '',
        password: ''
      },
      loginFormRule: {
        userName: [
          { required: true, message: '账户不能为空', trigger: 'blur' },
          { type: 'string', max: 20, message: '账户不能超过20个字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      registFormData: {
        userName: '',
        password: ''
      },
      registFormRule: {
        userName: [
          { required: true, message: '账户不能为空', trigger: 'blur' },
          { type: 'string', max: 20, message: '账户不能超过20个字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  /* created () {

    let getPermission = (data) => new Promise((resolve, reject) => {
      resolve(data);
      // reject('getPermissionError');
    });

    let generateRoute = (data) => new Promise((resolve, reject) => {
      resolve(data);
      // reject('generateRouteError');
    });

    let getOrgs = (data) => new Promise((resolve, reject) => {
      resolve(generateRoute(data));
      // reject('getOrgsError');
    });

    let login = () => new Promise((resolve, reject) => {
      resolve(getPermission(1));
      // reject('loginError');
    }).then(data => {
      return getOrgs(data);
    });

    login().then(data => {
      console.log(data, 'sucess');
    }).catch(err => {
      console.log(err, 'error');
    });
  }, */
  methods: {
    ...mapActions([
      'login'
    ]),
    handleSubmit (formName) {
      this.isLoading = true;
      // this.$router.push({
      //   name : 'menuList'
      // })
      this.formValidate(formName);
    },

    formValidate (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formSubmit(formName);
        } else {
          this.isLoading = false;
        }
      });
    },
    formSubmit (formName) {
      if (formName === 'loginForm') {
        this.loginSubmit();
      } else if (formName === 'registForm') {
        this.registSubmit();
      }
    },
    loginSubmit () {
      // 登录
      this.login({
        tip: false,
        ...this.loginFormData
      }).then((route) => {
        this.$message.success('登录成功');
        this.$router.push(route.path);
      }).catch(({ err, type }) => {
        if (type === 'loginError') {
          this.$message.error(`登录失败：${err.msg || JSON.stringify(err)}`);
        } else if (type === 'permissionError') {
          this.$message.error(`获取权限失败：${err.msg || JSON.stringify(err)}`);
        }
      }).finally(() => {
        this.isLoading = false;
      });
    },
    registSubmit () {
      // 注册
      ajax.post('').then(res => {

      }).catch(() => {

      }).finally(() => {
        this.isLoading = false;
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
@import "./styles/custom";
.page-content {
  @include flex_layout(column, center, center);
  height: 100%;
  width: 100%;
  background-image: url("../../assets/img/bg.png");
  background-size: 100% 100%;

  .title-bar {
    height: 62px;
    position: relative;
    .title {
      font-size: 50px;
      font-weight: normal;
      color: #FFFFFF;
      text-shadow: 1px 3px 0px #012813;
      -webkit-box-reflect: below -10px
        -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0, 0)), color-stop(0.5, rgba(0,0,0, 0)), to(rgba(255,255,255, .4)));
    }
  }

  .auth-box {
    box-sizing: border-box;
    padding: 19px;
    margin-top: 60px;
    height: 380px;
    width: 500px;
    background-color: $color_fff;
    border-radius: 10px;
    box-shadow: 0 4px 24px 0 rgba(0,0,0,.1);

    .tab-wrapper {
      margin: 0 auto;
      width: 80%;
      height: 100%;

      .login-box {
        padding-top: 30px;
        position: relative;
        height: 100%;
        width: 100%;

        .login-tool {
          @include flex_layout(row, space-between, center);
          margin-bottom: 15px;
          font-size: 18px;

          .forgot {
            cursor: pointer;
          }
        }
      }

      .register-box {
        position: relative;
        height: 100%;
        width: 100%;
      }

      .submit-btn {
        position: absolute;
        bottom: 40px;
        width: 100%;
        height: 40px;
        font-size: 18px;
        border-radius: unset;
      }
    }
  }
}
</style>
