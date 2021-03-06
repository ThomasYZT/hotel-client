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
                <FormItem class="inline-form-item" label="超时房费" prop="roomMoney">
                  {{$util.toYuan(formData.roomMoney) || 0}}
                </FormItem>
                <FormItem class="inline-form-item" label="消费金额">
                  {{consumeRecords.reduce((pre, cur) => pre + (cur.unitPrice * cur.num), 0)}}
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
  </div>
</template>

<script>
import { payTypeList, payTargetList } from '../../../assets/enums';
import defaultsDeep from 'lodash/defaultsDeep';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data () {
    return {
      payTypeList,
      payTargetList,
      visible: false,
      isLoading: false,
      confirmFn: null,
      cancelFn: null,
      item: {},
      orderInfo: {},
      consumeRecords: [],
      roomOverVo: {},
      formData: {
        userId: 0
      },
      formRule: {
        payType: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({
      item,
      orderInfo,
      consumeRecords,
      roomOverVo,
      confirmFn,
      cancelFn
    }) {
      if (!item || !orderInfo || !consumeRecords || !roomOverVo) {
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
      this.orderInfo = orderInfo;
      this.consumeRecords = consumeRecords;
      this.roomOverVo = roomOverVo;
      this.formData = defaultsDeep({}, {
        roomMoney: roomOverVo.price,
        orderCode: orderInfo.code,
        consumeRecords: consumeRecords
      }, item, this.formData);
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
    submitForm () {
      this.$ajax.post({
        apiKey: 'paymentCheckOut',
        params: {
          ...this.formData
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
        userId: 0
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.item = {};
      this.orderInfo = {};
      this.consumeRecords = [];
      this.roomOverVo = {};
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
