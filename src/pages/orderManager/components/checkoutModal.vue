<template>
  <div class="modal-wrapper">
    <page-board v-model="visible"
                @close="cancel">
      <div class="dialog-wrapper">
        <div class="info-wrapper">
          <div class="info-header">订单基本信息:</div>
          <div class="info-content">
            <div class="info-field">
              <div class="field-label">房号:</div>
              <div class="field-info">{{orderInfo.roomNumber || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">房间类型:</div>
              <div class="field-info">{{orderInfo.roomType || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">联系电话:</div>
              <div class="field-info">{{orderInfo.mobile || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">客户姓名:</div>
              <div class="field-info">{{orderInfo.customer || '-'}}</div>
            </div>
          </div>
          <div class="info-header">房间超时消费信息:</div>
          <div class="info-content">
            <div class="info-field">
              <div class="field-label">最晚退房时间:</div>
              <div class="field-info">{{roomOverVo.latestTfTime || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">加收费时长:</div>
              <div class="field-info">{{roomOverVo.perDuration || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">超时费用:</div>
              <div class="field-info">{{roomOverVo.price || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">退房时间:</div>
              <div class="field-info">{{roomOverVo.refundTime || '-'}}</div>
            </div>
          </div>
          <div class="info-header">商品消费信息:</div>
          <div class="info-field">
            <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
            <i-button @click="cancel">取 消</i-button>
          </div>
        </div>
      </div>
    </page-board>

    <payModal ref="payModal"></payModal>
  </div>
</template>

<script>
import payModal from '../components/payModal';
export default {
  components: {
    payModal
  },
  data () {
    return {
      visible: false,
      showModal: true,
      isLoading: false,
      item: {},
      roomInfo: {},
      orderInfo: {},
      roomOverVo: {},
      isReserved: false,
      confirmFn: null,
      cancelFn: null
    };
  },
  methods: {
    show ({ item, roomInfo = {}, confirmFn, cancelFn }) {
      this.item = item;
      this.roomInfo = roomInfo;
      this.getOrderByRoom().then(data => {
        this.orderInfo = data.order;
        this.roomOverVo = {
          ...data.roomOverVo,
          price: this.$util.toYuan(data.roomOverVo.price)
        };
        if (confirmFn) {
          this.confirmFn = confirmFn;
        }

        if (cancelFn) {
          this.cancelFn = cancelFn;
        }
        this.visible = true;
      }).catch(() => {
        this.$message.error('获取订单信息失败');
      });
    },
    cancel () {
      this.cancelFn && this.cancelFn();
      this.reset();
    },
    confirm () {
      if (this.roomOverVo.price) {
        this.showModal = false;
        this.$refs.payModal.show({
          item: {
            ...this.item,
            orderCode: this.orderInfo.code,
            money: String(this.roomOverVo.price)
          },
          confirmFn: () => {
            this.checkout();
          },
          cancelFn: () => {
            this.showModal = true;
          }
        });
      } else {
        this.checkout();
      }
    },
    getOrderByRoom () {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'orderCharge',
          params: {
            roomId: this.roomInfo.id
          }
        }).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    checkout () {
      this.$ajax.post({
        apiKey: 'orderCheckout',
        params: {
          code: this.orderInfo.code
        },
        loading: false
      }).then(() => {
        this.confirmFn && this.confirmFn();
        this.reset();
        this.$message.success('结账成功');
      }).catch(err => {
        this.$message.error(`结账失败${err.msg ? ': ' + err.err : ''}`);
      });
    },
    reset () {
      this.item = {};
      this.roomInfo = {};
      this.orderInfo = {};
      this.roomOverVo = {};
      this.isReserved = false;
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
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
