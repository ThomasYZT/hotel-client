<template>
  <div class="modal-wrapper">
    <el-dialog title="店长口令设置"
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
                <FormItem class="block-form-item" label="口令" prop="managerPwd">
                  <i-input type="password" placeholder="口令" v-model.trim="formData.managerPwd" />
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
import {Encrypt,Decrypt} from '../../../assets/plugins/secret';
import defaultsDeep from 'lodash/defaultsDeep';
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        id: '',
        managerPwd: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        managerPwd: [
          { required: true, message: '请输入口令', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || !item) return;
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }
      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.formData = defaultsDeep({}, item, this.formData);
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
        id: this.formData.id,
        managerPwd: Encrypt(this.formData.managerPwd)
      };
      this.$ajax.post({
        apiKey: 'hotelUpdateManagerPwd',
        params: formData,
        loading: false
      }).then(() => {
        this.$message.success('口令设置成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`口令设置失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        id: '',
        managerPwd: ''
      };
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
        max-height: 400px;
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
