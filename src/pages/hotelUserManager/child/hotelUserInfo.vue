<template>
  <div class="page-container">
    <div class="page-content">
      <div class="info-field-box">
        <div class="info-field">
          <div class="field-label">姓名:</div>
          <div class="field-info">{{detail.name}}</div>
        </div>
        <div class="info-field">
          <div class="field-label">性别:</div>
          <div class="field-info">{{genderList.find(item => item.value === detail.gender) ?
            genderList.find(item => item.value === detail.gender).label : ''}}</div>
        </div>
        <div class="info-field">
          <div class="field-label">手机号:</div>
          <div class="field-info">{{detail.mobile}}</div>
        </div>
        <div class="info-field">
          <div class="field-label">身份证号:</div>
          <div class="field-info">{{detail.cardNo}}</div>
        </div>
        <div class="info-field">
          <div class="field-label">职位:</div>
          <div class="field-info">{{detail.position}}</div>
        </div>
        <div class="info-field">
          <div class="field-label">生日:</div>
          <div class="field-info">{{detail.birthday}}</div>
        </div>
        <div class="info-field">
          <div class="field-label">登录名:</div>
          <div class="field-info">{{detail.userName}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { genderList } from '../../../assets/enums';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data () {
    return {
      genderList,
      detail: {}
    };
  },
  methods: {
    getUserDetail () {
      this.$ajax.get({
        apiKey: 'userGet',
        params: {
          id: this.userInfo.id
        }
      }).then(data => {
        this.detail = data;
      }).catch(() => {
        this.$message.error('获取用户信息失败');
      });
    }
  },
  mounted () {
    this.getUserDetail();
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.page-container {
  .page-content {
    background-color: $color_fff;
    border-radius: 5px;
  }

  .info-field-box {
    @include flex_layout(row, center, flex-start);
    flex-wrap: wrap;
    .info-field {
      @include flex_layout(row, flex-start, center);
      @include flex_set(1, 0, 50%);
      padding: 10px 20px;
      margin-bottom: 20px;
      font-size: 16px;
      color: #333333;
      .field-label {
        @include flex_set(0, 1, auto);
        margin-right: 20px;
      }
      .field-info {

      }
    }

  }
}
</style>
