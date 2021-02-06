<template>
  <div class="modal-wrapper">
    <el-dialog title="支付"
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
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="90"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="inline-form-item" label="支付方式" prop="payType">
                  <i-select v-model="formData.payType"
                            placeholder="请选择">
                    <i-option v-for="item in payTypeList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
                </FormItem>
                <!--<FormItem class="inline-form-item" label="支付类型" prop="type">
                  <i-select v-model="formData.type"
                            placeholder="请选择">
                    <i-option v-for="item in payTargetList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
                </FormItem>-->
                <FormItem class="inline-form-item" label="支付金额" prop="totalMoney">
                  <i-input type="text" placeholder="支付金额" v-model.trim="formData.totalMoney" />
                </FormItem>
              </div>
            </div>
          </i-form>

          <div v-if="showDetail" v-html="detailTemplate"></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { payTypeList, payTargetList, couponsType } from '../../../assets/enums';
import defaultsDeep from 'lodash/defaultsDeep';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data () {
    const validateMoney = (rule, value, callback) => {
      if (!value) callback();
      this.$validator.validateMoney(value).then(() => {
        callback();
      }).catch(err => {
        callback(err);
      });
    };
    return {
      payTypeList,
      payTargetList,
      visible: false,
      isLoading: false,
      confirmFn: null,
      cancelFn: null,
      item: {},
      config: {},
      formData: {
        userId: 0,
        // type: 0,
        totalMoney: ''
      },
      formRule: {
        payType: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ],
        // type: [
        //   { required: true, type: 'number', message: '请选择支付类型', trigger: 'blur' }
        // ],
        totalMoney: [
          { required: true, message: '请输入支付金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ]
      },
      showDetail: false,
      detailTemplate: ''
    };
  },
  methods: {
    show ({
      item,
      config = { cashPledge: true, roomMoney: true, consume: true, coupon: null },
      confirmFn,
      cancelFn,
      showDetail = false
    }) {
      if (!item || !item.orderPaymentVos || item.orderPaymentVos.length === 0) {
        this.$message.warning('缺少支付信息');
        return;
      }
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.item = item;
      this.config = config;
      this.showDetail = showDetail;
      this.formData = defaultsDeep({}, item, this.formData);
      this.formData.totalMoney = this.calcTotalMoney(item);
      showDetail && (this.detailTemplate = this.getDetailTemplate(item));
      this.visible = true;
    },
    cancel () {
      this.cancelFn && this.cancelFn();
      this.reset();
    },
    confirm () {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.submitForm();
        }
      });
    },
    calcTotalMoney (item) {
      let sum = 0;
      if (this.config.roomMoney) {
        sum += item.orderPaymentVos.reduce((pre, cur) => {
          return pre + cur.roomMoney;
        }, 0);

        if (this.config.coupon) {
          if (this.config.coupon.purpose === couponsType.moneyOff) {
            sum -= this.config.coupon.subtractAmount;
          } else if (this.config.coupon.purpose === couponsType.discount) {
            sum = sum * (this.config.coupon.subtractAmount / 10);
          }
        }
      }

      if (this.config.cashPledge) {
        sum += item.orderPaymentVos.reduce((pre, cur) => {
          return pre + cur.cashPledge;
        }, 0);
      }

      if (this.config.consume) {
        sum += item.orderPaymentVos.reduce((pre, cur) => {
          return pre + cur.consumeRecords.reduce((t, preGood) => {
            return t + preGood.unitPrice * preGood.num;
          }, 0);
        }, 0);
      }

      return this.$util.toYuan(sum);
    },
    getDetailTemplate (item) {
      let temp = '<div class="detail">';
      item.orderPaymentVos.forEach(order => {
        temp += `<div><div>订单号：${order.orderCode}</div>`;
        temp += `<div>${this.config.roomMoney && `<span>房费：${this.$util.toYuan(order.roomMoney)}</span>`} ${this.config.cashPledge && `<span>押金：${this.$util.toYuan(order.cashPledge)}</span>`}</div>`;
        temp += `<div>增加消费：`;
        order.consumeRecords.length === 0
          ? temp += '无</div>'
          : order.consumeRecords.forEach(item => {
            temp += `<span>${item.goodsName}：${this.$util.toYuan(item.unitPrice)} * ${item.num} = ${this.$util.toYuan(item.unitPrice * item.num)}</span>`;
          });
        temp += `<span>合计：${this.$util.toYuan(order.roomMoney + order.cashPledge + order.consumeRecords.reduce((p, c) => p + c.unitPrice * c.num, 0))}</span></div></div>`;
      });
      temp += `<div>总计：${this.formData.totalMoney}</div></div>`
      if (this.config.coupon) {
        if (this.config.coupon.purpose === couponsType.moneyOff) {
          temp += `<div>优惠券信息：满减券 满${this.$util.toYuan(this.config.coupon.fullAmount)}减${this.$util.toYuan(this.config.coupon.subtractAmount)}</div>`;
        } else if (this.config.coupon.purpose === couponsType.discount) {
          temp += `<div>优惠券信息：折扣券 ${this.config.coupon.discount}折</div>`;
        }
      }
      return temp;
    },
    submitForm () {
      this.$ajax.post({
        apiKey: 'paymentOrder',
        params: {
          ...this.formData,
          totalMoney: this.$util.toCent(this.formData.totalMoney)
        },
        config: {
          headers: { 'Content-Type': 'application/json;charset-UTF-8' }
        },
        loading: false
      }).then(() => {
        this.$message.success('支付成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`支付失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        userId: 0,
        // type: 0,
        totalMoney: ''
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.item = {};
      this.config = {};
      this.showDetail = false;
      this.detailTemplate = '';
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
    .form-wrapper {
      width: 100%;

      .form-item-wrapper {

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
