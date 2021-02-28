<template>
  <div class="modal-wrapper">
    <el-dialog :title="workStatus === workStatusMap.workOff ? '上班' : '下班'"
               :visible.sync="visible"
               width="30%"
               custom-class="form-dialog"
               @close="cancel"
               :close-on-click-modal="false"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="100"
                  label-position="left">
            <div class="form-item-wrapper">
              <FormItem v-if="workStatus === workStatusMap.workOff" label="上班金额" prop="startMoney">
                <i-input type="text" placeholder="上班金额" v-model="formData.startMoney" />
              </FormItem>
              <template v-if="workStatus === workStatusMap.workOn">
                <div class="info-wrapper">
                  <template v-if="paymentList.length > 0">
                    <div class="info-header">收入明细:</div>
                    <div class="info-content">
                      <div v-for="item in paymentList"
                           :key="item.type"
                           class="info-field">
                        <div class="field-label">{{item.type | getLabel}}:</div>
                        <div class="field-info">¥{{$util.toYuan(item.money)}}</div>
                      </div>
                    </div>
                  </template>
                  <template v-if="refundList.length > 0">
                    <div class="info-header">支出明细:</div>
                    <div class="info-content">
                      <div v-for="item in paymentList"
                           :key="item.type"
                           class="info-field">
                        <div class="field-label">{{item.type | getLabel}}:</div>
                        <div class="field-info">¥{{$util.toYuan(item.money)}}</div>
                      </div>
                    </div>
                  </template>
                </div>
                <FormItem label="下班金额" prop="endMoney">
                  <i-input type="text" placeholder="下班金额" v-model="formData.endMoney" />
                </FormItem>
              </template>
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
import { workStatusMap, statePayType, statePayTypeList } from '@/assets/enums';
import { mapGetters, mapActions } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo',
      'workStatus'
    ])
  },
  filters: {
    getLabel (val) {
      const match = statePayTypeList.find(item => item.value === val);
      return match.label || '-';
    }
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
      statePayType,
      workStatusMap,
      visible: false,
      isLoading: false,
      formData: {},
      formRule: {
        endMoney: [
          { required: true, message: '请输入下班金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        startMoney: [
          { required: true, message: '请输入上班金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ]
      },
      paymentList: [],
      refundList: []
    };
  },
  methods: {
    ...mapActions([
      'updateWorkStatus'
    ]),
    show () {
      this.formData.hotelUserId = this.userInfo.id;
      if (this.workStatus === workStatusMap.workOn) {
        this.getWorkDetail().then(data => {
          this.paymentList = data.paymentList || [];
          this.refundList = data.refundList || [];
          this.visible = true;
        }).catch(() => {
          this.$message.error('获取数据失败');
        });
      } else {
        this.visible = true;
      }
    },
    cancel () {
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
      const formData = { ...this.formData };
      if (this.formData.endMoney) {
        formData.endMoney = this.$util.toCent(this.formData.endMoney);
      }

      if (this.formData.startMoney) {
        formData.startMoney = this.$util.toCent(this.formData.startMoney);
      }
      this.$ajax.post({
        apiKey: this.workStatus === workStatusMap.workOff ? 'workStart' : 'workEnd',
        params: formData,
        loading: false
      }).then(() => {
        this.$message.success('提交成功');
        this.confirmFn && this.confirmFn();
        this.updateWorkStatus(
          this.workStatus === workStatusMap.workOff
            ? workStatusMap.workOn
            : workStatusMap.workOff
        );
        this.reset();
      }).catch(res => {
        this.$message.error(`提交失败${res.msg ? ': ' + res.msg : ''}`);
      });
    },
    getWorkDetail () {
      return new Promise((resolve, reject) => {
        this.$ajax.post({
          apiKey: 'workDetail',
          params: {
            hotelUserId: this.userInfo.id
          }
        }).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {};
      this.visible = false;
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.dialog-wrapper {
  @include flex_layout(row, center, flex-start);
  max-height: 350px;
  overflow-y: auto;
  .form-wrapper {
    width: 90%;
  }

  .info-wrapper {
    margin-bottom: 20px;
    width: 70%;
    .info-header {
      font-size: 16px;
      color: #333333;
    }
    .info-content {
      flex-wrap: wrap;
      .info-field {
        @include flex_layout(row, flex-start, center);
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
