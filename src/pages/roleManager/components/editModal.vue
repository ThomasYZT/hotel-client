<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加角色' : '编辑角色'"
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
              <FormItem v-if="type === 'add'" label="代理商" prop="agentId">
                <i-select v-model="formData.agentId">
                  <i-option v-for="item in agentList" :value="item.id" :key="item.id">{{ item.agentName }}</i-option>
                </i-select>
              </FormItem>
              <FormItem label="角色名称" prop="roleName">
                <i-input type="text" placeholder="角色名称" v-model="formData.roleName" />
              </FormItem>
              <FormItem label="描述" prop="remark">
                <i-input type="text" placeholder="描述" v-model="formData.remark" />
              </FormItem>
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
      editItem: {},
      agentList: [],
      formData: {
        agentId: '',
        roleName: '',
        remark: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        agentId: [
          { required: true, message: '请选择代理商', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
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
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'roleAdd' : 'roleUpdate',
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
        agentId: '',
        roleName: '',
        remark: ''
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.editItem = {};
      this.isLoading = false;
      this.type = '';
    },
    getAgentList () {
      this.$ajax.get({
        apiKey: 'agentGetAllList',
        loading: false
      }).then(data => {
        this.agentList = data;
        this.agentList.forEach(item => {
          item.id = String(item.id);
        });
      }).catch(err => {
        this.$message.error(`获取代理商列表失败${err.msg ? ': ' + err.msg : ''}`);
      });
    }
  },
  created () {
    this.getAgentList();
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.dialog-wrapper {
  @include flex_layout(row, center, center);
  .form-wrapper {
    width: 70%;
  }
}

</style>
