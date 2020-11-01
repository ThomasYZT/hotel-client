<template>
  <div class="modal-wrapper">
    <el-dialog title="添加工具"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="25%"
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
                  :label-width="60"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="block-form-item" label="工具" prop="toolId">
                  <i-select v-model="formData.toolId"
                            placeholder="请选择">
                    <i-option v-for="item in allFunctionList"
                              :value="item.id"
                              :key="item.id" :disabled="item.disabled">
                      {{ item.name }}
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
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data () {
    return {
      visible: false,
      isLoading: false,
      formData: {
        toolId: ''
      },
      allFunctionList: [],
      funcList: [],
      confirmFn: null,
      cancelFn: null,
      formRule: {
        toolId: [
          { required: true, type: 'number', message: '请选择工具', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ funcList, confirmFn, cancelFn }) {
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }
      if (cancelFn) {
        this.cancelFn = cancelFn;
      }

      this.funcList = funcList;
      this.getAllTools().then(data => {
        this.allFunctionList = (data || []).map(item => {
          return {
            ...item,
            disabled: funcList.find(tool => tool.id === item.id)
          };
        });
        this.visible = true;
      }).catch(err => {
        this.$message.error(`获取工具失败${err.msg ? ': ' + err.msg : ''}`);
      });
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
        apiKey: 'userAddTool',
        params: {
          hotelUserId: this.userInfo.id,
          ...this.formData
        },
        loading: false
      }).then(() => {
        this.$message.success('添加成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`添加失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        toolId: ''
      };
      this.funcList = [];
      this.allFunctionList = [];
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
    },
    getAllTools () {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'toolAll'
        }).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
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
