<template>
  <div class="modal-wrapper">
    <el-dialog title="会员注册"
               :visible.sync="visible"
               width="50%"
               :close-on-click-modal="false"
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
                <FormItem class="inline-form-item" label="姓名" prop="name">
                  <i-input type="text" placeholder="姓名" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="inline-form-item" label="性别" prop="sex">
                  <i-radio-group v-model="formData.sex">
                    <i-radio v-for="item in genderList"
                             :key="item.value"
                             :label="item.value">{{item.label}}</i-radio>
                  </i-radio-group>
                </FormItem>
                <FormItem class="inline-form-item" label="身份证" prop="idCard">
                  <i-input type="text" placeholder="身份证" v-model.trim="formData.idCard" />
                </FormItem>

                <FormItem class="inline-form-item" label="手机号" prop="phone">
                  <i-input type="text" placeholder="手机号" v-model.trim="formData.phone" />
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
import { genderList } from '../../../assets/enums';
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
      genderList,
      visible: false,
      isLoading: false,
      formData: {
        hotelId: '',
        idCard: '',
        sex: 1,
        phone: '',
        name: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        idCard: [
          { required: true, message: '请输入身份证', trigger: 'blur' },
          { validator: validateIdCard, trigger: 'blur' }
        ],
        sex: [
          { required: true, type: 'number', message: '请选择性别', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ item, confirmFn, cancelFn }) {
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }
      this.formData.hotelId = item;
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
      const formData = {
        ...this.formData
      };
      this.$ajax.post({
        apiKey:'vipInfoAddPc',
        params: formData,
        loading: false
      }).then(() => {
        this.$message.success("注册成功");
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`注册失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        idCard: '',
        sex: 1,
        phone: '',
        name: ''
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
