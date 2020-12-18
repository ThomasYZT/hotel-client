<template>
  <div class="modal-wrapper">
    <el-dialog :title="this.title"
               :visible.sync="visible"
               width="50%"
               custom-class="form-dialog"
               @close="cancel"
               :close-on-click-modal="false"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  inline
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="120"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="block-form-item" label="数量" prop="number">
                  <i-input type="text" placeholder="数量" v-model.trim="formData.number" />
                </FormItem>
                <FormItem class="inline-form-item" label="支付方式" prop="methodPayment">
                  <i-select v-model="formData.methodPayment"
                            placeholder="请选择">
                    <i-option v-for="item in payTypeList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
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
import { payTypeList } from '../../../assets/enums';
import defaultsDeep from 'lodash/defaultsDeep';
import { mapActions } from 'vuex';
export default {
  data () {
    const validateNumber = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isNumber(value)) {
        callback();
      } else {
        callback(new Error('请输入数字'));
      }
    };
    return {
      payTypeList,
      visible: false,
      isLoading: false,
      title: '商品出库',
      type: '',
      formData: {
        number: '',
        methodPayment: null,
        id: 0,
        hotelId: 0
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        number: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ],
        methodPayment: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ item, confirmFn, cancelFn }) {
      this.formData = defaultsDeep({}, item, this.formData);
      this.$util.valueToStr(this.formData, ['number', 'warnCount']);
      this.title = '商品出库('+ item.name +')'
    
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
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
        apiKey: 'goodOutStorage',
        params: this.formData,
        loading: false
      }).then(() => {
        this.$message.success('出库成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`${'出库'}失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        number: '',
        methodPayment: null,
        id: 0,
        hotelId: 0
      };
      this.title = '商品出库';
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = '1';
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
        max-height: 200px;
        overflow-y: auto;
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
