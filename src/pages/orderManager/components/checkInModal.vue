<template>
  <div class="modal-wrapper">
    <el-dialog title="登记入住"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="45%"
               custom-class="form-dialog"
               @close="cancel"
               center>
      <div class=""></div>
      <div class="dialog-wrapper">
        <!-- 查询订单 -->
        <transition name="fade">
          <div v-if="modalState === modalStatus.query"
               class="form-wrapper query-form">
            <i-form ref="Form"
                    inline
                    :disabled="isLoading"
                    :model="queryFromData"
                    :rules="queryRule"
                    :label-width="80"
                    label-position="right">
              <FormItem class="block-form-item" label="电话号码" prop="mobile">
                <i-input style="width: 200px;" type="text" placeholder="请输入电话号码" v-model.trim="queryFromData.mobile" @on-enter="getByMobile" />
              </FormItem>
            </i-form>
          </div>
        </transition>

        <!-- 订单信息 -->
        <transition name="fade">
          <div v-if="modalState === modalStatus.orderPreview" class="form-wrapper">
            <i-form ref="Form"
                    inline
                    :disabled="isLoading || isReserved"
                    :model="reserveFromData"
                    :rules="reserveFromRule"
                    :label-width="90"
                    label-position="right">
              <div class="form-item-wrapper">
                <div class="form-item-block">
                  <FormItem class="inline-form-item" label="预定方式" prop="orderType" >
                    <i-select v-model="reserveFromData.orderType"
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
                    <i-input :disabled="true" type="text" placeholder="房间类型" v-model.trim="reserveFromData.roomType" />
                  </FormItem>
                  <FormItem class="inline-form-item" label="房号" prop="roomNumber">
                    <i-input :disabled="true" type="text" placeholder="房号" v-model.trim="reserveFromData.roomNumber" />
                  </FormItem>
                  <FormItem class="inline-form-item" label="联系电话" prop="mobile">
                    <i-input type="text" placeholder="联系电话" v-model.trim="reserveFromData.mobile" />
                  </FormItem>
                  <FormItem class="inline-form-item" label="客户姓名" prop="customer">
                    <i-input type="text" placeholder="客户姓名" v-model.trim="reserveFromData.customer" />
                  </FormItem>
                  <FormItem class="inline-form-item" label="类型" prop="type" >
                    <i-select v-model="reserveFromData.type"
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
        </transition>

        <transition name="fade">
          <div v-if="modalState === modalStatus.checkin" class="form-wrapper">
            <i-form ref="Form"
                    inline
                    :disabled="isLoading"
                    :model="checkinFormData"
                    :rules="checkinFormRule"
                    :label-width="100"
                    label-position="right">
              <div class="form-item-wrapper">
                <div class="form-item-block">
                  <FormItem class="inline-form-item" label="订单编号" prop="code">
                    <i-input :disabled="true" type="text" placeholder="订单编号" v-model.trim="checkinFormData.code" />
                  </FormItem>
                  <FormItem class="inline-form-item" label="姓名" prop="name">
                    <i-input :disabled="true" type="text" placeholder="姓名" v-model.trim="checkinFormData.name" />
                  </FormItem>
                  <FormItem class="inline-form-item" label="手机号码" prop="phone">
                    <i-input :disabled="true" type="text" placeholder="手机号码" v-model.trim="checkinFormData.phone" />
                  </FormItem>
                  <FormItem class="inline-form-item" label="身份证号码" prop="idCard">
                    <i-input type="text" placeholder="身份证号码" v-model.trim="checkinFormData.idCard" />
                  </FormItem>
                  <FormItem class="inline-form-item" label="性别" prop="sex">
                    <i-radio-group v-model="checkinFormData.sex">
                      <i-radio v-for="item in genderList"
                               :key="item.value"
                               :label="item.value">{{item.label}}</i-radio>
                    </i-radio-group>
                  </FormItem>
                  <FormItem class="inline-form-item" label="入住人数" prop="num">
                    <i-input type="text" placeholder="入住人数" v-model.trim="checkinFormData.num" />
                  </FormItem>
                </div>
              </div>
            </i-form>
          </div>
        </transition>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button v-if="modalState === modalStatus.orderPreview" style="margin-right: 10px" type="primary" @click="payConfirm">支 付</i-button>
        <i-button v-if="modalState === modalStatus.checkin" style="margin-right: 10px" type="primary" @click="checkinConfirm">登记入住</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>

    <payModal ref="payModal"></payModal>
  </div>
</template>

<script>
import payModal from '../components/payModal';
import { orderTypeList, ordainRoomTypeList, genderList, orderStatus, genderMap } from '../../../assets/enums';
import defaultsDeep from 'lodash/defaultsDeep';
const modalStatus = {
  query: 'query',
  orderPreview: 'orderPreview',
  checkin: 'checkin'
};
export default {
  components: {
    payModal
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
    const validateIdCard = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isIdCard(value)) {
        callback();
      } else {
        callback(new Error('请输入正确身份证号码'));
      }
    };

    const isNumber = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isNumber(value)) {
        callback();
      } else {
        callback(new Error('请输入数字'));
      }
    };
    return {
      modalStatus,
      orderTypeList,
      ordainRoomTypeList,
      genderList,
      visible: false,
      isLoading: false,
      item: {},
      roomInfo: {},
      modalState: modalStatus.query,
      isReserved: false,
      queryFromData: {
        mobile: ''
      },
      reserveFromData: {
        userId: 0
      },
      checkinFormData: {
        sex: genderMap.male
      },
      confirmFn: null,
      cancelFn: null,
      reserveFromRule: {
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
      },
      queryRule: {
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ]
      },
      checkinFormRule: {
        idCard: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' }
        ],
        sex: [
          { required: true, type: 'number', message: '请选择性别', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入入住人数', trigger: 'blur' },
          { validator: isNumber, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ item, activeRoom = {}, confirmFn, cancelFn }) {
      if (!item) return;
      this.item = item;
      this.roomInfo = activeRoom;
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.visible = true;
    },
    getByMobile () {
      this.$ajax.get({
        apiKey: 'orderGetByMobile',
        params: {
          mobile: this.queryFromData.mobile
        }
      }).then(data => {
        if (data) {
          if (data.status === orderStatus.payed) {
            this.modalState = modalStatus.checkin;
          } else {
            this.modalState = modalStatus.orderPreview;
          }
          this.isReserved = true;
          this.item.code = data.code;
          this.reserveFromData = defaultsDeep({}, data, this.reserveFromData);
          this.checkinFormData = defaultsDeep({}, this.item, {
            phone: this.reserveFromData.mobile,
            name: this.reserveFromData.customer
          }, this.checkinFormData);
        } else {
          return Promise.reject(new Error());
        }
      }).catch(err => {
        this.isReserved = false;
        if (Object.keys(this.roomInfo).length > 0) {
          this.modalState = modalStatus.orderPreview;
          this.reserveFromData = defaultsDeep({}, {
            roomNumber: this.roomInfo.roomNumber,
            roomTypeId: this.roomInfo.roomTypeId,
            roomType: this.roomInfo.roomTypeName,
            roomId: this.roomInfo.id,
            mobile: this.queryFromData.mobile
          }, this.item, this.reserveFromData);
        } else {
          this.$message.error(`查询失败${err.msg ? ': ' + err.msg : ''}`);
        }
      });
    },
    payConfirm () {
      if (this.isReserved) {
        this.payment();
      } else {
        this.$refs.Form.validate(valid => {
          if (valid) {
            this.reservation();
          }
        });
      }
    },
    payment () {
      this.visible = false;
      this.$refs.payModal.show({
        item: this.$util.removeProp({
          orderCode: this.item.code,
          ...this.item
        }, ['orderType', 'code']),
        confirmFn: () => {
          this.visible = true;
          this.modalState = modalStatus.checkin;
          this.checkinFormData = defaultsDeep({}, this.item, this.checkinFormData);
        },
        cancelFn: () => {
          this.visible = false;
        }
      });
    },
    reservation () {
      this.$ajax.post({
        apiKey: 'orderSubmit',
        params: this.reserveFromData,
        loading: false
      }).then(data => {
        this.item.code = data;
        this.payment();
      }).catch(err => {
        this.$message.error(`预定失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    checkinConfirm () {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.checkin();
        }
      });
    },
    checkin () {
      this.$ajax.post({
        apiKey: 'orderCheckin',
        params: this.checkinFormData,
      }).then(() => {
        this.$message.success('登记入住成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`登记入住失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    cancel () {
      this.cancelFn && this.cancelFn();
      this.reset();
    },
    reset () {
      this.$refs.Form.resetFields();
      this.reserveFromData = {
        userId: 0
      };
      this.item = {};
      this.roomInfo = {};
      this.modalState = modalStatus.query;
      this.isReserved = false;
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

      &.query-form {
        @include flex_layout(row, center, center);
        min-height: 150px;

        /deep/ .ivu-form-item {
          margin-bottom: 0;
        }
      }

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
