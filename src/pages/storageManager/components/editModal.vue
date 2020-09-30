<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '新增行李寄存' : '编辑寄存信息'"
               :visible.sync="visible"
               width="40%"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="80"
                  label-position="left">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem label="寄存类型" prop="consignType">
                  <i-input type="text" placeholder="寄存类型" v-model="formData.consignType" />
                </FormItem>
                <FormItem label="寄存时间" prop="consignTime">
                  <i-input type="text" placeholder="寄存时间" v-model="formData.consignTime" />
                </FormItem>
                <FormItem label="取出时间" prop="retrieveTime">
                  <i-input type="text" placeholder="取出时间" v-model="formData.retrieveTime" />
                </FormItem>
              </div>
              <div class="form-item-block">
                <FormItem label="状态" prop="status">
                  <i-input type="text" placeholder="状态" v-model="formData.status" />
                </FormItem>
                <FormItem label="会员ID" prop="vipId">
                  <i-input type="text" placeholder="会员ID" v-model="formData.vipId" />
                </FormItem>
                <FormItem label="描述" prop="remark">
                  <i-input type="text" placeholder="描述" v-model="formData.remark" />
                </FormItem>
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
        consignType: '',
        consignTime: '',
        retrieveTime: '',
        status: '',
        vipId: '',
        remark: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        consignType: [
          { required: true, message: '请输入代理商名称', trigger: 'blur' }
        ],
        consignTime: [
          { required: true, message: '请输入联系人名称', trigger: 'blur' }
        ],
        retrieveTime: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        vipId: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
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
        apiKey: this.type === 'add' ? 'storageAdd' : 'storageUpdate',
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
        consignType: '',
        consignTime: '',
        retrieveTime: '',
        status: '',
        vipId: '',
        remark: ''
      };
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
