<template>
  <div class="modal-wrapper">
    <el-dialog title="修改房间状态"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="30%"
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
                <FormItem class="block-form-item" label="房间状态" prop="status">
                  <i-select v-model="formData.status"
                            placeholder="请选择">
                    <i-option v-for="item in roowStatusOptionList"
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
import { roowStatusList, roomStatus } from '../../../assets/enums';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data () {
    return {
      roowStatusOptionList: [],
      visible: false,
      isLoading: false,
      confirmFn: null,
      cancelFn: null,
      formData: {},
      formRule: {
        status: [
          { required: true, type: 'number', message: '请选择房间状态', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ item, confirmFn, cancelFn }) {
      if (!item) return;
      this.generateStatusList(item.status);
      this.formData.status = item.status;
      this.formData.id = item.id;
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
        apiKey: 'roomUpdateStatus',
        params: {
          ...this.formData
        },
        loading: false
      }).then(() => {
        this.$message.success('修改成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`修改失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    generateStatusList (status) {
      switch (status) {
        case roomStatus.outClearing:
          this.roowStatusOptionList = roowStatusList.filter(item => [roomStatus.error, roomStatus.clean].includes(item.value));
          break;
        case roomStatus.clean:
          this.roowStatusOptionList = roowStatusList.filter(item => item.value === roomStatus.error);
          break;
        case roomStatus.error:
          this.roowStatusOptionList = roowStatusList.filter(item => item.value === roomStatus.clean);
          break;
      }
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {};
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
