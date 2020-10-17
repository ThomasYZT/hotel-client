<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '新增行李寄存信息' : '编辑行李寄存信息'"
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
                <FormItem class="form-item-block" label="身份证号" prop="idCard">
                  <i-input readonly type="text" placeholder="身份证号" v-model.trim="formData.idCard" />
                </FormItem>
                <FormItem class="form-item-block" label="寄存类型" prop="idCard">
                  <i-input type="text" placeholder="寄存类型" v-model.trim="formData.idCard" />
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
import { storageStatusList } from '../../../assets/enums';
export default {
  data () {
    return {
      storageStatusList,
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
          { required: true, message: '请选择寄存类型', trigger: 'blur' }
        ],
        consignTime: [
          { required: true, type: 'date', message: '请选择寄存时间', trigger: 'blur' }
        ],
        retrieveTime: [
          { required: true, type: 'date', message: '请选择取出时间', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        vipId: [
          { required: true, message: '请输入会员ID', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      this.formData = defaultsDeep({}, item, this.formData);
      this.$util.valueToStr(this.formData);
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
        ...this.formData,
        consignTime: this.$date(this.formData.consignTime).format('YYYY-MM-DD HH:mm:ss'),
        retrieveTime: this.$date(this.formData.retrieveTime).format('YYYY-MM-DD HH:mm:ss')
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
