<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加标签信息' : '编辑标签信息'"
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
                <FormItem class="block-form-item" label="标签名称" prop="labelName">
                  <i-input-number style="width: 100%;" type="text" placeholder="标签名称" v-model.trim="formData.labelName" />
                </FormItem>
                <FormItem class="block-form-item" label="是否置顶" prop="isTop">
                  <i-switch size="large" :true-value="'1'" :false-value="'0'" v-model="formData.isTop">
                    <span slot="open">置顶</span>
                    <span slot="close">不置顶</span>
                  </i-switch>
                </FormItem>
                <FormItem class="block-form-item" label="备注" prop="remark">
                  <i-input type="textarea" placeholder="备注" v-model.trim="formData.remark" />
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
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      visible: false,
      isLoading: false,
      type: '',
      editItem: {},
      formData: {
        labelName: '',
        isTop: '1',
        remark: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      this.formData = defaultsDeep({}, item, this.formData);
      this.$util.valueToStr(this.formData);
      this.type = type;

      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
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
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'labelAdd' : 'labelUpdate',
        params: this.formData,
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
        labelName: '',
        isTop: '1',
        remark: ''
      };
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
