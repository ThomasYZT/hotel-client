<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加客户' : '编辑客户'"
               :visible.sync="visible"
               width="35%"
               custom-class="form-dialog"
               @close="cancel"
               :close-on-click-modal="false"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="120"
                  label-position="left">
            <div class="form-item-wrapper">
              <FormItem label="品牌ID" prop="agentId">
                <i-input type="text" placeholder="品牌ID" v-model="formData.agentId" />
              </FormItem>
              <FormItem label="品牌名称" prop="name">
                <i-input type="text" placeholder="品牌名称" v-model="formData.name" />
              </FormItem>
              <FormItem label="描述" prop="remark">
                <i-input type="text" placeholder="描述" v-model="formData.remark" />
              </FormItem>
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
    return {
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        agentId: '',
        name: '',
        remark: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        agentId: [
          { required: true, message: '请选择品牌ID', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      if (type === 'edit') {
        this.formData = defaultsDeep({}, item, this.formData);
      }
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
        provinces: this.formData.area[0],
        city: this.formData.area[1],
        county: this.formData.area[2]
      };
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'customerAdd' : 'customerUpdate',
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
        agentId: '',
        name: '',
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
  }
}

</style>
