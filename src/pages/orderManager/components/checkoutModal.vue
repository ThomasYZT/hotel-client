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
              <div class="field-label">入住时间:</div>
              <div class="field-info">{{$date(new Date(orderInfo.stayTime * 1000)).format('YYYY-MM-DD HH:mm:ss') || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">房间类型:</div>
              <div class="field-info">{{orderInfo.roomType || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">房价:</div>
              <div class="field-info">{{$util.toYuan(orderInfo.price) || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">联系电话:</div>
              <div class="field-info">{{orderInfo.mobile || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">客户姓名:</div>
              <div class="field-info">{{orderInfo.customer || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">订单来源:</div>
              <div class="field-info">{{orderTypeList.find(item => item.value === orderInfo.orderType) ?
                orderTypeList.find(item => item.value === orderInfo.orderType).label : '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">会员等级:</div>
              <div class="field-info">{{vipLevel || '-'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">备注:</div>
              <template v-if="status.remark === editStatus.read">
                <div class="field-info">{{orderInfo.remark || '-'}}</div>
                <i-button style="margin-left: 10px" type="primary" size="small" @click="remarkEdit">修改</i-button>
              </template>
              <template v-else-if="status.remark === editStatus.edit">
                <div class="field-info" style="flex: 1 0 auto;">
                  <i-input type="textarea" :rows="2" placeholder="请输入备注" v-model.trim="remark" />
                  <div style="margin-top: 10px">
                    <i-button style="margin-right: 10px" size="small" @click="remarkCancel">取消</i-button>
                    <i-button type="primary" size="small" @click="remarkSave">保存</i-button>
                  </div>
                </div>
              </template>
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
          <template v-if="consumeRecords.length > 0">
            <div class="info-content"
                 v-for="item in consumeRecords"
                 :key="item.id">
              <div class="info-field">
                <div class="field-label">商品名称</div>
                <div class="field-info">{{item.goodsName || '-'}}</div>
              </div>
              <div class="info-field">
                <div class="field-info">单价:{{item.unitPrice || '-'}}，数量:{{item.num || '-'}}</div>
              </div>
            </div>
          </template>
          <div v-else>-</div>
          <div class="info-content">
            <div class="info-field">
              <div class="field-label">是否已开订单发票:</div>
              <div class="field-info">{{orderInfo.invoice === invoiceStatus.printed ? '已开' : '未开'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">是否已开早餐发票:</div>
              <div class="field-info">{{orderInfo.breakfast === breakfastStatus.printed ? '已开' : '未开'}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">应退款:</div>
              <div class="field-info">{{calcRefundMoney()}}</div>
            </div>
            <template v-if="roomLessVo && roomLessVo.refundTime && roomLessVo.stayTime">
              <div class="info-field">
                <div class="field-label">入住时间:</div>
                <div class="field-info">{{roomLessVo.stayTime}}</div>
              </div>
              <div class="info-field">
                <div class="field-label">退房时间:</div>
                <div class="field-info">{{roomLessVo.refundTime}}</div>
              </div>
              <div class="info-field">
                <div class="field-label">订单金额:</div>
                <div class="field-info">{{roomLessVo.price}}</div>
              </div>
              <div class="info-field">
                <div class="field-label">终点房金额:</div>
                <div class="field-info">{{roomLessVo.hoursRoomPrice}}</div>
              </div>
              <div class="info-field">
                <div class="field-label">应退金额:</div>
                <div class="field-info">{{roomLessVo.refundPrice}}</div>
              </div>
            </template>
          </div>
          <div class="info-field" style="margin-top: 20px">
            <i-button style="margin-right: 10px" type="primary" @click="addCustomer">增加房客</i-button>
            <i-button style="margin-right: 10px" type="primary" @click="changeRoom">换房</i-button>
            <i-button style="margin-right: 10px" type="primary" @click="continueRoom">续房</i-button>
            <i-button style="margin-right: 10px" type="primary" @click="debtOrder">挂账</i-button>
            <i-button style="margin-right: 10px" type="primary" :disabled="orderInfo.breakfast === breakfastStatus.printed" @click="ptintBreakfastTicket">打印早餐票</i-button>
            <i-button style="margin-right: 10px" type="primary" :disabled="orderInfo.invoice === invoiceStatus.printed" @click="ptintTicket">开发票</i-button>
            <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
            <i-button @click="cancel">取 消</i-button>
          </div>
        </div>
      </div>
    </page-board>

    <payModal ref="payModal"></payModal>
    <addCustomerModal ref="addCustomerModal"></addCustomerModal>
    <changeRoomModal ref="changeRoomModal"></changeRoomModal>
    <continueRoomModal ref="continueRoomModal"></continueRoomModal>
    <debtOrderModal ref="debtOrderModal"></debtOrderModal>
    <confirmModal ref="confirmModal">
      <div slot="content">
        <div v-if="leaveEarly">
          客户为提前离店，确认要退房结账吗？
          <p style="color: red">离店日期：{{$date(orderInfo.latestTfTime * 1000).format('YYYY-MM-DD')}}</p>
          <p style="color: red">当前营业日：{{$date().format('YYYY-MM-DD')}}</p>
        </div>
        <span>确定要退房结账吗？</span>
      </div>
    </confirmModal>
  </div>
</template>

<script>
import { orderStatus, orderTypeList, invoiceStatus, breakfastStatus, editStatus } from '../../../assets/enums/index';
import payModal from '../components/checkoutPayModal';
import addCustomerModal from '../components/addCustomerModal';
import changeRoomModal from '../components/changeRoomModal';
import continueRoomModal from '../components/continueRoomModal';
import debtOrderModal from '../components/debtOrderModal';
import confirmModal from '../components/checkoutConfirmModal.vue';
export default {
  components: {
    payModal,
    addCustomerModal,
    changeRoomModal,
    continueRoomModal,
    debtOrderModal,
    confirmModal
  },
  computed: {
    leaveEarly () {
      return this.$date(this.$date().format('YYYY-MM-DD'))
        .isBefore(
          this.$date(this.orderInfo.latestTfTime * 1000).format('YYYY-MM-DD')
        );
    }
  },
  data () {
    return {
      editStatus,
      invoiceStatus,
      breakfastStatus,
      orderTypeList,
      visible: false,
      showModal: true,
      isLoading: false,
      item: {},
      roomInfo: {},
      orderInfo: {},
      roomOverVo: {},
      consumeRecords: [],
      roomLessVo: {},
      isReserved: false,
      confirmFn: null,
      cancelFn: null,
      vipLevel: '',
      status: {
        remark: editStatus.read
      },
      remark: ''
    };
  },
  methods: {
    show ({ item, roomInfo = {}, confirmFn, cancelFn }) {
      this.item = item;
      this.roomInfo = roomInfo;
      this.getOrderByRoom().then(() => {
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
      this.$refs.confirmModal.show({
        confirm: () => {
          if (this.roomOverVo.price || this.consumeRecords.length > 0) {
            this.showModal = false;
            this.$refs.payModal.show({
              item: this.item,
              orderInfo: this.orderInfo,
              consumeRecords: this.consumeRecords,
              roomOverVo: {
                ...this.roomOverVo,
                price: this.$util.toCent(this.roomOverVo.price) || 0
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
        }
      });
    },
    getOrderByRoom () {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'orderCharge',
          params: {
            roomId: this.roomInfo.id
          }
        }).then(data => {
          this.orderInfo = data.order;
          this.vipLevel = data.vipLevel;
          this.consumeRecords = data.consumeRecords.filter(item => item.status === orderStatus.unPay);
          this.roomOverVo = {
            ...data.roomOverVo,
            price: this.$util.toYuan(data.roomOverVo.price) || 0
          };
          this.roomLessVo = data.RoomLessVo || {};
          this.remark = this.orderInfo.remark;
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
    ptintBreakfastTicket () {
      this.$ajax.post({
        apiKey: 'orderBreakfast',
        params: {
          code: this.orderInfo.code
        }
      }).then(() => {
        this.$message.success('打印早餐票成功');
      }).catch(() => {
        this.$message.success('打印早餐票失败');
      }).finally(() => {
        this.getOrderByRoom();
      });
    },
    ptintTicket () {
      this.$ajax.post({
        apiKey: 'orderInvoice',
        params: {
          code: this.orderInfo.code
        }
      }).then(() => {
        this.$message.success('开发票成功');
      }).catch(() => {
        this.$message.success('开发票失败');
      }).finally(() => {
        this.getOrderByRoom();
      });
    },
    addCustomer () {
      this.$refs.addCustomerModal.show({
        hotelId: this.item.hotelId,
        code: this.orderInfo.code
      });
    },
    changeRoom () {
      this.$refs.changeRoomModal.show({
        hotelId: this.item.hotelId,
        code: this.orderInfo.code,
        confirmFn: () => {
          this.confirmFn();
        }
      });
    },
    continueRoom () {
      this.$refs.continueRoomModal.show({
        orderInfo: this.orderInfo,
        roomOverVo: this.roomOverVo,
        confirmFn: () => {
          this.confirmFn();
        }
      });
    },
    debtOrder () {
      this.$refs.debtOrderModal.show({
        code: this.orderInfo.code,
        confirmFn: () => {
          this.confirmFn();
        }
      });
    },
    calcRefundMoney () {
      return `¥${this.$util.toYuan(this.orderInfo.cashPledge -
        this.consumeRecords.reduce((pre, cur) => pre + (cur.unitPrice * cur.num), 0) -
        this.roomOverVo.price)}`;
    },
    remarkEdit () {
      this.$set(this.status, 'remark', editStatus.edit);
    },
    remarkCancel () {
      this.remark = this.orderInfo.remark;
      this.$set(this.status, 'remark', editStatus.read);
    },
    remarkSave () {
      this.$ajax.post({
        apiKey: 'orderUpdateRemark',
        params: {
          code: this.orderInfo.code,
          remark: this.remark
        }
      }).then(() => {
        this.status.remark = editStatus.read;
        this.$message.success('修改成功');
        this.getOrderByRoom();
      }).catch(() => {
        this.$message.error('修改失败');
      });
    },
    reset () {
      this.item = {};
      this.roomInfo = {};
      this.orderInfo = {};
      this.roomOverVo = {};
      this.roomLessVo = {};
      this.consumeRecords = [];
      this.vipLevel = '';
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
