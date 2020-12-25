<template>
  <div class="board-wrapper">
    <page-board v-model="visible"
                @close="cancel">
      <div class="dialog-wrapper">
        <div class="info-wrapper">
          <div class="info-header">会员详情</div>
          <div class="info-content">
            <div class="info-field">
              <div class="field-label">会员ID:</div>
              <div class="field-info">{{detail.vipUserId || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">姓名:</div>
              <div class="field-info">{{detail.name || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">昵称:</div>
              <div class="field-info">{{detail.nickName || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">手机号:</div>
              <div class="field-info">{{detail.phone || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">身份证号:</div>
              <div class="field-info">{{detail.idCard || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">性别:</div>
              <div class="field-info">{{genderList.find(item => item.value === detail.sex) ?
                genderList.find(item => item.value === detail.sex).label : ''}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">出生日期:</div>
              <div class="field-info">{{detail.birthday || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">生日:</div>
              <div class="field-info">{{detail.birthday || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">会员等级:</div>
              <div class="field-info">{{detail.vipLevelName || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">经验:</div>
              <div class="field-info">{{detail.experience || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">积分:</div>
              <div class="field-info">{{detail.integral || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">余额:</div>
              <div class="field-info">{{detail.remainingSum || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">到期时间:</div>
              <div class="field-info">{{detail.expireDate || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">激活状态:</div>
              <div class="field-info">{{vipActiveStatusList.find(item => item.value === detail.isActivation) ?
                vipActiveStatusList.find(item => item.value === detail.isActivation).label : ''}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">所在省份:</div>
              <div class="field-info">{{detail.province || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">所在城市:</div>
              <div class="field-info">{{detail.city || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">注册状态:</div>
              <div class="field-info">{{registerStatusList.find(item => item.value === detail.status) ?
                registerStatusList.find(item => item.value === detail.status).label : ''}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">激活时间:</div>
              <div class="field-info">{{detail.actTime || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">激活酒店:</div>
              <div class="field-info">{{detail.actHotelName || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">注册酒店名称:</div>
              <div class="field-info">{{detail.registerHotelName || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">注册时间:</div>
              <div class="field-info">{{detail.registerTime || '-'}}</div>
            </div>
          </div>
        </div>
        <tableTemplate></tableTemplate>
      </div>
    </page-board>
  </div>
</template>

<script>
import { genderList, vipActiveStatusList, registerStatusList } from '../../../assets/enums';
import tableTemplate from './tableTemplate';
import { mapGetters } from 'vuex';
export default {
  components: {
    tableTemplate
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data () {
    return {
      genderList,
      registerStatusList,
      vipActiveStatusList,
      detail: {},
      visible: false,
      isLoading: false
    };
  },
  methods: {
    show ({ item }) {
      if (!item) return;
      this.getVipInfo(item.id).then(res => {
        this.detail = res;
        this.visible = true;
      }).catch(() => {
        this.reset();
        this.$message.error('获取信息失败');
      });
    },
    cancel () {
      this.reset();
    },
    reset () {
      this.detail = {};
      this.visible = false;
    },
    getVipInfo (id) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'vipInfoGet',
          params: {
            id
          }
        }).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.dialog-wrapper {
  .info-wrapper {
    margin-bottom: 20px;
    width: 70%;
    .info-header {
      font-size: 18px;
      font-weight: bold;
    }
    .info-content {
      @include flex_layout(row, center, flex-start);
      flex-wrap: wrap;
      .info-field {
        @include flex_layout(row, flex-start, center);
        @include flex_set(1, 0, 50%);
        padding: 5px 5px;
        margin-bottom: 5px;
        font-size: 14px;
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
}
</style>
