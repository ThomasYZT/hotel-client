<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加用户' : '编辑用户'"
               :visible.sync="visible"
               width="50%"
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
              <div class="form-item-block">
                <FormItem label="生日" prop="birthday">
                  <i-input type="text" placeholder="生日" v-model="formData.birthday" />
                </FormItem>
                <FormItem label="身份证" prop="cardNo">
                  <i-input type="text" placeholder="身份证" v-model="formData.cardNo" />
                </FormItem>
                <FormItem label="性别" prop="gender">
                  <i-input type="text" placeholder="性别" v-model="formData.gender" />
                </FormItem>
                <FormItem label="手机号" prop="mobile">
                  <i-input type="text" placeholder="手机号" v-model="formData.mobile" />
                </FormItem>
                <FormItem label="姓名" prop="name">
                  <i-input type="text" placeholder="姓名" v-model="formData.name" />
                </FormItem>
              </div>
              <div class="form-item-block">
                <FormItem label="密码" prop="password">
                  <i-input type="text" placeholder="密码" v-model="formData.password" />
                </FormItem>
                <FormItem label="职位" prop="position">
                  <i-input type="text" placeholder="职位" v-model="formData.position" />
                </FormItem>
                <FormItem label="登录名" prop="userName">
                  <i-input type="text" placeholder="登录名" v-model="formData.userName" />
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
        birthday: '',
        cardNo: '',
        gender: '',
        mobile: '',
        name: '',
        password: '',
        position: '',
        userName: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        cardNo: [
          { required: true, message: '请输入身份证', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: false, message: '请输入密码', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      this.formData = defaultsDeep({}, item, this.formData);
      if (type === 'edit') {
        delete this.formData.updateTime;
        delete this.formData.createTime;
        this.$util.valueToStr(this.formData);
        this.formRule.password.required = true;
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
        ...this.formData
      };
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'userAdd' : 'userUpdate',
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
        birthday: '',
        cardNo: '',
        gender: '',
        mobile: '',
        name: '',
        password: '',
        position: '',
        userName: ''
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
