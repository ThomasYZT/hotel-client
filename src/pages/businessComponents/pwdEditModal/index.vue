<template>
  <div class="modal-wrapper">
    <el-dialog title="修改密码"
               :visible.sync="visible"
               width="30%"
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
                  :label-width="100"
                  label-position="left">
            <div class="form-item-wrapper">
              <FormItem label="旧密码" prop="oldPassword">
                <i-input type="text" placeholder="旧密码" v-model="formData.oldPassword" />
              </FormItem>
              <FormItem label="新密码" prop="password">
                <i-input type="text" placeholder="新密码" v-model="formData.password" />
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
        oldPassword: '',
        password: ''
      },
      formRule: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show () {
      this.formData.id = this.userInfo.id;
      this.visible = true;
    },
    cancel () {
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
        apiKey: 'userModifyPassword',
        params: this.formData,
        loading: false
      }).then(() => {
        this.$message.success('修改成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(res => {
        this.$message.error(`修改失败${res.msg ? ': ' + res.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        oldPassword: '',
        password: ''
      };
      this.visible = false;
      this.isLoading = false;
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
