<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加酒店' : '编辑酒店'"
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
                <FormItem label="酒店名称" prop="name">
                  <i-input type="text" placeholder="品牌" v-model.trim="formData.name" />
                </FormItem>
                <FormItem label="酒店地址" prop="address">
                  <i-input type="text" placeholder="酒店地址" v-model.trim="formData.address" />
                </FormItem>
                <FormItem label="房间数量" prop="roomCount">
                  <i-input type="text" placeholder="房间数量" v-model.trim="formData.roomCount" />
                </FormItem>
                <FormItem label="预定房间电话" prop="reservePhone">
                  <i-input type="text" placeholder="预定房间电话" v-model.trim="formData.reservePhone" />
                </FormItem>
                <FormItem label="酒店电话" prop="hotelPhone">
                  <i-input type="text" placeholder="酒店电话" v-model.trim="formData.hotelPhone" />
                </FormItem>
              </div>
              <div class="form-item-block">
                <FormItem label="联系人名称" prop="contactName">
                  <i-input type="text" placeholder="联系人名称" v-model.trim="formData.contactName" />
                </FormItem>
                <FormItem label="联系电话" prop="mobilePhone">
                  <i-input type="text" placeholder="联系电话" v-model.trim="formData.mobilePhone" />
                </FormItem>
                <FormItem label="开业年份" prop="openYear">
                  <i-date-picker v-model="formData.openYear"
                                 :editable="false"
                                 transfer
                                 format="yyyy-MM-dd"
                                 placeholder="开业年份"></i-date-picker>
                </FormItem>
                <FormItem label="酒店简介" prop="introduce">
                  <i-input type="text" placeholder="酒店简介" v-model.trim="formData.introduce" />
                </FormItem>
                <FormItem label="X坐标" prop="baiduX">
                  <i-input placeholder="X坐标" v-model.trim="formData.baiduX" />
                </FormItem>
                <FormItem label="Y坐标" prop="baiduY">
                  <i-input placeholder="Y坐标" v-model.trim="formData.baiduY" />
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
    const validateNumber = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isNumber(value)) {
        callback();
      } else {
        callback(new Error('请输入数字'));
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
        hotelPhone: '',
        reservePhone: '',
        contactName: '',
        mobilePhone: '',
        address: '',
        roomCount: '',
        openYear: '',
        introduce: '',
        baiduX: '',
        baiduY: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        name: [
          { required: true, message: '请输入酒店名称', trigger: 'blur' }
        ],
        hotelPhone: [
          { required: true, message: '请输入酒店电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        reservePhone: [
          { required: true, message: '请输入房间预定电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入酒店地址', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人名称', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        roomCount: [
          { validator: validateNumber, trigger: 'blur' }
        ],
        baiduX: [
          { required: true, message: '请输入X坐标', trigger: 'blur' }
        ],
        baiduY: [
          { required: true, message: '请输入Y坐标', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      this.formData = defaultsDeep({}, item, this.formData);
      this.$util.valueToStr(this.formData);

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
        openYear: this.$date(this.formData.openYear).format('YYYY-MM-DD HH:mm:ss')
      };
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'hotelAdd' : 'hotelUpdate',
        params: formData,
        loading: false,
        config: {
          headers: { 'Content-Type': 'application/json;charset-UTF-8' }
        }
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
        address: '',
        roomCount: '',
        reservePhone: '',
        hotelPhone: '',
        contactName: '',
        mobilePhone: '',
        openYear: '',
        introduce: '',
        baiduX: 0,
        baiduY: 0
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
