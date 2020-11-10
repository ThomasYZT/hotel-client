<template>
  <div class="modal-wrapper">
    <el-dialog title="结账离店"
               v-show="showModal"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="45%"
               custom-class="form-dialog"
               @close="cancel"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  inline
                  :disabled="true"
                  :model="orderInfo"
                  :label-width="80"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="title">订单基本信息:</div>
              <div class="form-item-block">
                <FormItem class="inline-form-item" label="房号">
                  <i-input type="text" placeholder="房号" v-model.trim="orderInfo.roomNumber" />
                </FormItem>
                <FormItem class="inline-form-item" label="房间类型">
                  <i-input type="text" placeholder="房间类型" v-model.trim="orderInfo.roomType" />
                </FormItem>
                <FormItem class="inline-form-item" label="房间类型">
                  <i-input type="text" placeholder="房间类型" v-model.trim="orderInfo.roomType" />
                </FormItem>
                <FormItem class="inline-form-item" label="联系电话">
                  <i-input type="text" placeholder="联系电话" v-model.trim="orderInfo.mobile" />
                </FormItem>
                <FormItem class="inline-form-item" label="客户姓名">
                  <i-input type="text" placeholder="客户姓名" v-model.trim="orderInfo.customer" />
                </FormItem>
              </div>
            </div>
          </i-form>
          <i-form ref="Form"
                  v-if="Object.keys(roomOverVo).length > 0"
                  inline
                  :disabled="true"
                  :model="roomOverVo"
                  :label-width="120"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="title">房间超时消费信息:</div>
              <div class="form-item-block">
                <FormItem class="inline-form-item" label="最晚退房时间">
                  <i-input type="text" placeholder="最晚退房时间" v-model.trim="roomOverVo.latestTfTime" />
                </FormItem>
                <FormItem class="inline-form-item" label="加收费时长">
                  <i-input type="text" placeholder="加收费时长" v-model.trim="roomOverVo.perDuration" />
                </FormItem>
                <FormItem class="inline-form-item" label="超时费用">
                  <i-input type="text" placeholder="超时费用" v-model.trim="roomOverVo.price" />
                </FormItem>
                <FormItem class="inline-form-item" label="退房时间">
                  <i-input type="text" placeholder="退房时间" v-model.trim="roomOverVo.refundTime" />
                </FormItem>
              </div>
            </div>
          </i-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>

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
  /deep/ .el-dialog__body {
    padding: 25px 0 30px;
  }
  .dialog-wrapper {
    @include flex_layout(row, center, flex-start);
    padding: 0 25px 0;
    max-height: 400px;
    overflow-y: auto;
    .form-wrapper {
      width: 100%;

      &.query-form {
        @include flex_layout(row, center, center);
        min-height: 150px;

        /deep/ .ivu-form-item {
          margin-bottom: 0;
        }
      }

      .form-item-wrapper {
        .title {
          margin-bottom: 20px;
        }

        .form-item-block {
          margin-right: 20px;
          max-height: 350px;
          font-size: 13px;
          color: #333333;

          .form-item-block-title {
            font-size: 16px;
            margin-bottom: 10px;
          }

          &:last-child {
            margin: 0;
          }
        }
      }
    }
  }

</style>
