<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加黑名单' : '编辑黑名单'"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="50%"
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
                  :label-width="120"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="block-form-item" label="手机号" prop="phone">
                  <i-input type="text" placeholder="手机号" clearable @on-clear="clear" search @on-enter="getByPhone" v-model.trim="formData.phone" />
                </FormItem>
                <FormItem class="inline-form-item" label="姓名" prop="name">
                  <i-input disabled type="text" placeholder="姓名" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="inline-form-item" label="性别" prop="sex">
                  <i-radio-group v-model="formData.sex">
                    <i-radio v-for="item in genderList"
                             disabled
                             :key="item.value"
                             :label="item.value">{{item.label}}</i-radio>
                  </i-radio-group>
                </FormItem>
                <FormItem class="block-form-item" label="身份证号" prop="idCard">
                  <i-input disabled type="text" placeholder="身份证号" v-model.trim="formData.idCard" />
                </FormItem>
                <FormItem class="block-form-item" label="描述" prop="remark">
                  <i-input type="textarea" placeholder="描述" v-model="formData.remark" />
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
import { genderList } from '../../../assets/enums';
import defaultsDeep from 'lodash/defaultsDeep';
export default {
  data () {
    const validatePhoneNum = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isMobile(value) || this.$validator.isTelephone(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的联系电话'));
      }
    };
    return {
      genderList,
      visible: false,
      isLoading: false,
      type: '',
      formData: {},
      confirmFn: null,
      cancelFn: null,
      formRule: {
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      this.formData = defaultsDeep({}, item, this.formData);

      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.type = type;
      this.visible = true;
    },
    getByPhone () {
      this.isLoading = true;
      this.$ajax.get({
        apiKey: 'customerGetByPhone',
        params: {
          phone: this.formData.phone
        },
        loading: false
      }).then(data => {
        if (data && Object.keys(data).length > 0) {
          this.formData = defaultsDeep({}, this.formData, data);
          this.formData.customerId = this.formData.id;
          delete this.formData.id;
        } else {
          this.$message.error(`未查询到该客户信息，请检查手机号码`);
        }
      }).catch(err => {
        this.$message.error(`获取客户信息失败${err.msg ? ': ' + err.msg : ''}`);
      }).finally(() => {
        this.isLoading = false;
      });
    },
    clear () {
      this.formData = {};
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
      const formData = {
        ...this.formData,
        remark: this.formData.remark
      };
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'blacklistAdd' : 'blacklistUpdate',
        params: formData,
        loading: false
      }).then(() => {
        this.$message.success(this.type === 'add' ? '添加成功' : '编辑成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`${this.type === 'add' ? '添加' : '编辑'}失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {};
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = '';
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
