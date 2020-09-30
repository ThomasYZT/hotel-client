<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加代理商' : '编辑代理商'"
               :visible.sync="visible"
               width="50%"
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
              <div class="form-item-block">
                <FormItem label="代理商名称" prop="name">
                  <i-input type="text" placeholder="代理商名称" v-model="formData.name" />
                </FormItem>
                <FormItem label="联系人名称" prop="contactName">
                  <i-input type="text" placeholder="联系人名称" v-model="formData.contactName" />
                </FormItem>
                <FormItem label="联系电话" prop="phone">
                  <i-input type="text" placeholder="联系电话" v-model="formData.phone" />
                </FormItem>
                <FormItem label="地区" prop="area">
                  <areaSelector ref="areaSelector" v-model="formData.area"></areaSelector>
                </FormItem>
                <FormItem label="地址" prop="address">
                  <i-input type="text" placeholder="地址" v-model="formData.address" />
                </FormItem>
              </div>
              <div class="form-item-block">
                <FormItem label="邮箱" prop="email">
                  <i-input type="text" placeholder="邮箱" v-model="formData.email" />
                </FormItem>
                <FormItem label="小程序ID" prop="appId">
                  <i-input type="text" placeholder="小程序ID" v-model="formData.appId" />
                </FormItem>
                <FormItem label="小程序密钥" prop="secret">
                  <i-input type="text" placeholder="secret" v-model="formData.secret" />
                </FormItem>
                <FormItem label="微信支付商户号" prop="mchId">
                  <i-input type="text" placeholder="微信支付商户号" v-model="formData.mchId" />
                </FormItem>
                <FormItem label="商户平台支付密钥" prop="roleName">
                  <i-input type="text" placeholder="商户平台支付密钥" v-model="formData.companyKey" />
                </FormItem>
                <FormItem label="描述" prop="remark">
                  <i-input type="text" placeholder="描述" v-model="formData.remark" />
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
import areaSelector from '../../../components/areaSelector';
import defaultsDeep from 'lodash/defaultsDeep';
export default {
  components: {
    areaSelector
  },
  data () {
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
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        area: [
          { required: true, type: 'array', min: 3, message: '请选择区域', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!item) return;
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
