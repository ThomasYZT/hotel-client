<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加酒店信息' : '编辑酒店信息'"
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
                <FormItem class="block-form-item" label="酒店名称" prop="name">
                  <i-input type="text" placeholder="酒店名称" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="inline-form-item" label="预定房间电话" prop="reservePhone">
                  <i-input type="text" placeholder="预定房间电话" v-model.trim="formData.reservePhone" />
                </FormItem>
                <FormItem class="inline-form-item" label="酒店电话" prop="hotelPhone">
                  <i-input type="text" placeholder="酒店电话" v-model.trim="formData.hotelPhone" />
                </FormItem>
                <FormItem class="inline-form-item" label="联系人名称" prop="contactName">
                  <i-input type="text" placeholder="联系人名称" v-model.trim="formData.contactName" />
                </FormItem>
                <FormItem class="inline-form-item" label="联系电话" prop="mobilePhone">
                  <i-input type="text" placeholder="联系电话" v-model.trim="formData.mobilePhone" />
                </FormItem>
                <FormItem class="inline-form-item" label="房间数量" prop="roomCount">
                  <i-input type="text" placeholder="房间数量" v-model.trim="formData.roomCount" />
                </FormItem>
                <FormItem class="inline-form-item" label="开业年份" prop="openYear">
                  <i-input type="text" placeholder="开业年份" v-model.trim="formData.openYear" />
                </FormItem>
                <!--<FormItem class="inline-form-item" label="X坐标" prop="baiduX">
                  <i-input type="text" placeholder="X坐标" v-model.trim="formData.baiduX" />
                </FormItem>
                <FormItem class="inline-form-item" label="Y坐标" prop="baiduY">
                  <i-input type="text" placeholder="Y坐标" v-model.trim="formData.baiduY" />
                </FormItem>-->
                <FormItem class="no-label block-form-item">
                  <div class="map-wrapper">
                    <place-search></place-search>
                  </div>
                  <i-button @click="showMapModal">获取坐标</i-button>
                </FormItem>
                <FormItem class="block-form-item" label="酒店地址" prop="address">
                  <i-input type="text" placeholder="酒店地址" v-model.trim="formData.address" />
                </FormItem>
                <FormItem class="block-form-item" label="酒店简介" prop="introduce">
                  <i-input type="textarea" placeholder="酒店简介" v-model.trim="formData.introduce" />
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
import PlaceSearch from '../../../components/PlaceSearch';
import defaultsDeep from 'lodash/defaultsDeep';
export default {
  components: {
    PlaceSearch
  },
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
        baiduX: '0',
        baiduY: '0'
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
        openYear: [
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
        ...this.formData
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
    showMapModal () {

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
        baiduX: '',
        baiduY: ''
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
        max-height: 430px;
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

  .map-wrapper {
    height: 300px;
    width: 80%;
  }
}
.no-label {
  /deep/.ivu-form-item-content {
    margin-left: 0 !important;
  }
}

</style>
