<template>
  <div class="frame-header">
    <!--<div class="title-bar">
      <img class="logo" src="../../assets/img/logo.png" alt="">
      <span class="title">uu智慧酒店管理系统（××酒店）</span>
    </div>
    <div class="tool-bar">
      <win-bar></win-bar>
    </div>-->
    <div v-if="tool" class="operation-column flex-box">
      <div class="left-box">
        <div class="system-item">关于软件</div>
        <div class="global-info">
          <div class="info-item">
            今日营业额：<span class="red-text">8888</span>元
          </div>
          <div class="info-item">
            昨日营业额：<span class="red-text">8888</span>元
          </div>
        </div>
        <div class="tool-box">
          <i-input class="search-tool" size="small" placeholder="搜索会员、商品、功能">
            <i slot="prefix" class="iconfont icon-search"></i>
          </i-input>
        </div>
      </div>
      <div class="right-box">
        <div class="system-item">
          消息
          <i class="iconfont icon-xiaoxi"></i>
        </div>
        <div class="system-item">
          帮助
          <i class="iconfont icon-bangzhu"></i>
        </div>
        <i-poptip trigger="hover" placement="bottom-end">
          <div class="system-item">
            账户
            <i class="iconfont icon-zhanghu"></i>
          </div>
          <template slot="content">
            <div class="menu-item">个人信息</div>
            <div class="menu-item">修改密码</div>
            <div class="menu-item" @click="didLogoutClick">注销</div>
          </template>
        </i-poptip>
      </div>
    </div>
    <confirmModal ref="confirmModal"></confirmModal>
  </div>
</template>

<script>
import WinBar from '../WinBar';
import { mapGetters, mapActions } from 'vuex';
export default {
  components: {
    WinBar
  },
  props: {
    tool: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'windowState'
    ])
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    didLogoutClick () {
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否退出登录`,
        confirm: () => {
          this.logout().then(() => {
            this.$message.success('退出登录成功');
          }).catch(() => {
            this.$message.success('退出登录失败');
          });
        }
      });
    }
  },
  mounted () {

  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.frame-header {
  @include flex_layout(row, space-between, center);
  /*padding: 0 10px 0 20px;*/
  /*height: 38px;*/
  height: 30px;
  background-color: $lightGreen;
  -webkit-app-region: drag;

  .title-bar {
    @include flex_layout(row, flex-start, center);
    margin-left: 20px;
    height: 100%;
    .logo {
      width: 23px;
      height: 23px;
    }

    .title {
      margin-right: 10px;
      margin-left: 5px;
      color: $color_000;
      font-size: $font-size-mormal;
      font-weight: bold;
    }
  }
  .tool-bar {
    height: 100%;
  }

  .operation-column {
    height: 30px;
    width: 100%;
    line-height: 30px;

    &.flex-box {
      .left-box {
        @include flex_set(1, 0, auto);
        .system-item {
          margin-left: 20px;
          margin-right: 20px;
          display: inline-block;
          vertical-align: top;
          cursor: pointer;
        }

        .global-info {
          @include flex_layout(row, flex-start, center);
          display: inline-block;
          vertical-align: top;

          .info-item {
            margin-right: 10px;
            display: inline-block;
            vertical-align: top;

            .red-text {
              color: red;
            }
          }
        }

        .tool-box {
          height: 30px;
          display: inline-block;
          vertical-align: top;

          .search-tool {
            margin-left: 50px;
            vertical-align: top;
            height: 100%;
            /deep/ .ivu-input {
              padding-top: 0;
              padding-bottom: 0;
              height: 30px;
              border: none;
              border-radius: unset;
              background-color: $lightGray;
            }

            .icon-search {
              line-height: 30px;
            }
          }
        }
      }

      .right-box {
        @include flex_layout(row, flex-end, center);
        @include flex_set(0, 1, auto);

        .system-item {
          display: inline-block;
          margin-right: 20px;
          cursor: pointer;
        }
      }
    }

    .menu-item {
      @include flex_layout(row, center, center);
      height: 40px;
      cursor: pointer;
      border-bottom: 1px solid  $lightGray;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        color: $normalGreen;
      }
    }
  }
}
</style>
