<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加黑名单' : '编辑黑名单'"
               :visible.sync="visible"
               width="50%"
               custom-class="form-dialog"
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
                  <i-input type="text" placeholder="手机号" clearable @on-clear="clear" search @on-search="getByPhone" v-model.trim="formData.phone" @on-blur="getByPhone" />
                </FormItem>
                <FormItem class="form-item-block" label="姓名" prop="name">
                  <i-input readonly type="text" placeholder="姓名" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="form-item-block" label="性别" prop="sex">
                  <i-input readonly type="text" placeholder="性别" v-model.trim="formData.sex" />
                </FormItem>
                <FormItem class="block-form-item" label="身份证号" prop="idCard">
                  <i-input readonly type="text" placeholder="身份证号" v-model.trim="formData.idCard" />
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
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        phone: '',
        remark: ''
      },
      customerInfo: {},
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
      if(type === 'edit'){
        if (item.sex === 1) {
            item.sex  = '男'
        } else if (item.sex === 2) {
            item.sex  = '女'
        } else {
            item.sex  = '未知'
        }
      }
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
            console.log(data.sex)
            if (data.sex === 1) {
                data.sex  = '男'
            } else if (data.sex === 2) {
                data.sex  = '女'
            } else {
                data.sex  = '未知'
            }
            this.formData = defaultsDeep({}, this.formData, data);
            this.formData.customerId = this.formData.id;
            delete this.formData.id;
            this.customerInfo = data;
          } else {
            this.$message.error(`未查询到该客户信息，请检查手机号码`);
            this.customerInfo = null;
          }
        }).catch(err => {
          this.$message.error(`获取客户信息失败${err.msg ? ': ' + err.msg : ''}`);
        }).finally(() => {
          this.isLoading = false;
        });
    },
    clear () {
      this.formData = {
        name: '',
        sex: '',
        idCard: '',
        remark: ''
      };
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
        ...this.formData
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
      this.formData = {
        phone: '',
        name: '',
        sex: '',
        idCard: '',
        remark: ''
      };
      this.customerInfo = {};
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
