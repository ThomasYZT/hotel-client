<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加酒店' : '编辑酒店'"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="50%"
               @close="cancel"
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
                <FormItem label="品牌" prop="name">
                  <i-input type="text" placeholder="品牌" v-model="formData.brandId" />
                </FormItem>
                <FormItem label="酒店名称" prop="name">
                  <i-input type="text" placeholder="酒店名称" v-model="formData.name" />
                </FormItem>
                <FormItem label="酒店电话" prop="hotelPhone">
                  <i-input type="text" placeholder="酒店电话" v-model="formData.hotelPhone" />
                </FormItem>
                <FormItem label="预定房间电话" prop="reservePhone">
                  <i-input type="text" placeholder="预定房间电话" v-model="formData.reservePhone" />
                </FormItem>
                <FormItem label="酒店地址" prop="address">
                  <i-input type="text" placeholder="酒店地址" v-model="formData.address" />
                </FormItem>
              </div>
              <div class="form-item-block">
                <FormItem label="联系人名称" prop="contactName">
                  <i-input type="text" placeholder="联系人名称" v-model="formData.contactName" />
                </FormItem>
                <FormItem label="联系电话" prop="mobilePhone">
                  <i-input type="text" placeholder="联系电话" v-model="formData.mobilePhone" />
                </FormItem>
                <FormItem label="房间数量" prop="roomCount">
                  <i-input type="text" placeholder="房间数量" v-model="formData.roomCount" />
                </FormItem>
                <FormItem label="开业年份" prop="openYear">
                  <i-input type="text" placeholder="开业年份" v-model="formData.openYear" />
                </FormItem>
                <FormItem label="酒店简介" prop="introduce">
                  <i-input type="text" placeholder="酒店简介" v-model="formData.introduce" />
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
        brandId: '',
        name: '',
        hotelPhone: '',
        reservePhone: '',
        contactName: '',
        mobilePhone: '',
        address: '',
        roomCount: '',
        openYear: '',
        introduce: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        brandId: [
          { required: true, message: '请输入代理商名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入联系人名称', trigger: 'blur' }
        ],
        hotelPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        reservePhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
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
        apiKey: this.type === 'add' ? 'hotelAdd' : 'hotelUpdate',
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
        address: '',
        roomCount: '',
        reservePhone: '',
        hotelPhone: '',
        contactName: '',
        mobilePhone: '',
        openYear: '',
        introduce: ''
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
