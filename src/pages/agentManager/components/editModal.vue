<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加代理商信息' : '编辑代理商信息'"
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
                <FormItem class="inline-form-item" label="代理商名称" prop="name">
                  <i-input type="text" placeholder="代理商名称" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="inline-form-item" label="联系人名称" prop="contactName">
                  <i-input type="text" placeholder="联系人名称" v-model.trim="formData.contactName" />
                </FormItem>
                <FormItem class="inline-form-item" label="联系电话" prop="phone">
                  <i-input type="text" placeholder="联系电话" v-model.trim="formData.phone" />
                </FormItem>
                <FormItem class="inline-form-item" label="邮箱" prop="email">
                  <i-input type="text" placeholder="邮箱" v-model.trim="formData.email" />
                </FormItem>
                <FormItem class="block-form-item" label="地区" prop="area">
                  <areaSelector ref="areaSelector" v-model="formData.area" style="width:100%;"></areaSelector>
                </FormItem>
                <FormItem class="block-form-item" label="地址" prop="address">
                  <i-input type="text" placeholder="地址" v-model.trim="formData.address" />
                </FormItem>
                <FormItem class="inline-form-item" label="小程序ID" prop="appId">
                  <i-input type="text" placeholder="小程序ID" v-model.trim="formData.appId" />
                </FormItem>
                <FormItem class="inline-form-item" label="小程序密钥" prop="secret">
                  <i-input type="text" placeholder="secret" v-model.trim="formData.secret" />
                </FormItem>
                <FormItem class="inline-form-item" label="支付商户号" prop="mchId">
                  <i-input type="text" placeholder="支付商户号" v-model.trim="formData.mchId" />
                </FormItem>
                <FormItem class="inline-form-item" label="支付密钥" prop="roleName">
                  <i-input type="text" placeholder="支付密钥" v-model.trim="formData.companyKey" />
                </FormItem>
                <FormItem class="block-form-item" label="描述" prop="remark">
                  <i-input type="textarea" placeholder="描述" v-model.trim="formData.remark" />
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
import areaSelector from '../../../components/areaSelector';
import defaultsDeep from 'lodash/defaultsDeep';
export default {
  components: {
    areaSelector
  },
  data () {
    // 校验邮箱
    const validateEmail = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isEmail(value)) {
        callback();
      } else {
        callback(new Error('请输入正确邮箱地址'));
      }
    };

    const validatePhoneNum = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isMobile(value) || this.$validator.isTelephone(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的联系电话'));
      }
    };
    return {
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        name: '',
        contactName: '',
        phone: '',
        area: [],
        address: '',
        email: '',
        appId: '',
        secret: '',
        mchId: '',
        companyKey: '',
        remark: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        name: [
          { required: true, message: '请输入代理商名称', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        area: [
          { required: true, type: 'array', min: 3, message: '请选择区域', trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (type === 'edit') {
        this.formData = defaultsDeep({}, item, this.formData);
        setTimeout(() => {
          this.$refs.areaSelector.setDefault([this.formData.provinces, this.formData.city, this.formData.county]);
        }, 300);
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
        apiKey: this.type === 'add' ? 'agentAdd' : 'agentUpdate',
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
        name: '',
        contactName: '',
        phone: '',
        area: [],
        address: '',
        email: '',
        appId: '',
        secret: '',
        mchId: '',
        companyKey: '',
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
        max-height: 420px;
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
