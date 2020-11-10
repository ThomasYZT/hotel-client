<template>
  <div class="modal-wrapper">
    <el-dialog title="酒店预定"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="45%"
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
                  :label-width="90"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="inline-form-item" label="预定方式" prop="orderType" >
                  <i-select v-model="formData.orderType"
                            placeholder="请选择"
                            :disabled="true">
                    <i-option v-for="item in orderTypeList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="房间类型" prop="roomType">
                  <i-input :disabled="true" type="text" placeholder="房间类型" v-model.trim="formData.roomType" />
                </FormItem>
                <FormItem class="inline-form-item" label="房号" prop="roomNumber">
                  <i-input :disabled="true" type="text" placeholder="房号" v-model.trim="formData.roomNumber" />
                </FormItem>
                <FormItem class="inline-form-item" label="联系电话" prop="mobile">
                  <i-input type="text" placeholder="联系电话" v-model.trim="formData.mobile" />
                </FormItem>
                <FormItem class="inline-form-item" label="客户姓名" prop="customer">
                  <i-input type="text" placeholder="客户姓名" v-model.trim="formData.customer" />
                </FormItem>
                <FormItem class="inline-form-item" label="类型" prop="type" >
                  <i-select v-model="formData.type"
                            placeholder="请选择">
                    <i-option v-for="item in ordainRoomTypeList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
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
import { orderTypeList, ordainRoomTypeList } from '../../../assets/enums';
import defaultsDeep from 'lodash/defaultsDeep';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data () {
    const validatePhoneNum = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isMobile(value) || this.$validator.isTelephone(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的联系电话'));
      }
    };
    return {
      orderTypeList,
      ordainRoomTypeList,
      visible: false,
      isLoading: false,
      formData: {
        userId: 0,
        type: '',
        mobile: '',
        customer: ''
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        type: [
          { required: true, type: 'number', message: '请选择类型', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        customer: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ item, activeRoom, confirmFn, cancelFn }) {
      if (!item) return;
      this.formData = defaultsDeep({}, item, {
        roomNumber: activeRoom.roomNumber,
        roomTypeId: activeRoom.roomTypeId,
        roomType: activeRoom.roomTypeName,
        roomId: activeRoom.id
      }, this.formData);
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

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
      this.$ajax.post({
        apiKey: 'orderSubmit',
        params: this.formData,
        loading: false
      }).then(() => {
        this.$message.success('预定成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`预定失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        userId: 0,
        type: '',
        mobile: '',
        customer: ''
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
