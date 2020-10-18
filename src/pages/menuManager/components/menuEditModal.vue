<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加菜单信息' : '编辑菜单信息'"
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
                <FormItem class="block-form-item" label="菜单名称" prop="menuName">
                  <i-input type="text" placeholder="菜单名称" v-model="formData.menuName" />
                </FormItem>
                <FormItem class="block-form-item" label="菜单链接" prop="url">
                  <i-input class="block-form-item" type="text" placeholder="菜单链接" v-model="formData.url" />
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
  name: 'menuEditModal',
  props: {
    menuList: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      visible: false,
      isLoading: false,
      type: '',
      editItem: {},
      formData: {
        parentId: '',
        menuName: '',
        url: '',
        remark: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入菜单链接', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }
      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.formData = defaultsDeep({}, item, this.formData);
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
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'menuAdd' : 'menuUpdate',
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
        parentId: '',
        menuName: '',
        url: '',
        remark: ''
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.editItem = {};
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
