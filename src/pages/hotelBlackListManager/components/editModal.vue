<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加黑名单' : '编辑黑名单'"
               :visible.sync="visible"
               width="30%"
               center
               @close="cancel">
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="120"
                  label-position="left">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem label="手机号" prop="phone">
                  <i-input type="text" placeholder="手机号" v-model="formData.phone" @on-blur="getByPhone" />
                </FormItem>
                <template v-if="Object.keys(customerInfo).length > 0 || type !== 'add'">
                  <FormItem label="姓名" prop="name">
                    <i-input :disabled="type === 'add'" type="text" placeholder="姓名" v-model="formData.name" />
                  </FormItem>
                  <FormItem label="性别" prop="sex">
                    <i-input :disabled="type === 'add'" type="text" placeholder="性别" v-model="formData.sex" />
                  </FormItem>
                  <FormItem label="身份证号" prop="idCard">
                    <i-input :disabled="type === 'add'" type="text" placeholder="身份证号" v-model="formData.idCard" />
                  </FormItem>
                  <FormItem label="描述" prop="remark">
                    <i-input type="text" placeholder="描述" v-model="formData.remark" />
                  </FormItem>
                </template>
              </div>
            </div>
          </i-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button class="dialog-cancel-btn" @click="cancel">取 消</i-button>
        <i-button class="dialog-confirm-btn" type="primary" @click="confirm">确 定</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultsDeep from 'lodash/defaultsDeep';
export default {
  data () {
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
          { required: true, message: '请输入电话号码', trigger: 'blur' }
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
      if (this.formData.phone && this.type === 'add') {
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
            this.customerInfo = data;
          } else {
            this.$message.error(`未查询到该客户信息，请检查手机号码`);
          }
        }).catch(err => {
          this.$message.error(`获取客户信息失败${err.msg ? ': ' + err.msg : ''}`);
        }).finally(() => {
          this.isLoading = false;
        });
      }
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
.dialog-wrapper {
  @include flex_layout(row, center, flex-start);
  max-height: 350px;
  overflow-y: auto;
  .form-wrapper {
    width: 90%;

    .form-item-wrapper {
      @include flex_layout(row, space-between, flex-start);

      .form-item-block {
        margin-right: 20px;

        &:last-child {
          margin: 0;
        }
      }
    }
  }
}

</style>
