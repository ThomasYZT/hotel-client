<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加用户' : '编辑用户'"
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
                <FormItem class="inline-form-item" label="登录名" prop="userName">
                  <i-input type="text" placeholder="登录名" v-model.trim="formData.userName" />
                </FormItem>
                <FormItem class="inline-form-item" label="密码" prop="password">
                  <i-input type="password" placeholder="密码" v-model.trim="formData.password" />
                </FormItem>
                <FormItem class="inline-form-item" label="姓名" prop="name">
                  <i-input type="text" placeholder="姓名" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="inline-form-item" label="身份证" prop="cardNo">
                  <i-input type="text" placeholder="身份证" v-model.trim="formData.cardNo" />
                </FormItem>
                <FormItem class="inline-form-item" label="性别" prop="gender">
                  <i-radio-group v-model="formData.gender">
                    <i-radio label="男" value="1"></i-radio>
                    <i-radio label="女" value="2"></i-radio>
                  </i-radio-group>
                </FormItem>
                <FormItem class="inline-form-item" label="手机号" prop="mobile">
                  <i-input type="text" placeholder="手机号" v-model.trim="formData.mobile" />
                </FormItem>
                <FormItem class="inline-form-item" label="生日" prop="birthday">
                  <i-date-picker v-model="formData.birthday"
                                 :editable="false"
                                 transfer
                                 format="yyyy-MM-dd"
                                 placeholder="生日"></i-date-picker>
                </FormItem>
                <FormItem class="inline-form-item" label="职位" prop="position">
                  <i-input type="text" placeholder="职位" v-model.trim="formData.position" />
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
  data () {
    const validatePhoneNum = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isMobile(value) || this.$validator.isTelephone(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的联系电话'));
      }
    };
    const validateIdCard = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isIdCard(value)) {
        callback();
      } else {
        callback(new Error('请输入正确身份证号码'));
      }
    };

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
          { required: true, message: '请输入身份证', trigger: 'blur' },
          { validator: validateIdCard, trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
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
        ...this.formData,
        birthday: this.$date(this.formData.birthday).format('YYYY-MM-DD')
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
