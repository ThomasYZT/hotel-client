<template>
  <div class="modal-wrapper">
    <el-dialog title="预定&&入住"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="65%"
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
                  :label-width="150"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="inline-form-item" label="预定方式" prop="orderType">
                  <i-select v-model="formData.orderType"
                            placeholder="请选择">
                    <i-option v-for="item in orderTypeList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="支付方式" prop="payType">
                  <i-select v-model="formData.payType"
                            placeholder="请选择">
                    <i-option v-for="item in payTypeList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="联系电话" prop="mobile">
                  <i-input type="text" placeholder="联系电话" v-model.trim="formData.mobile" @on-blur="queryCoupons" />
                </FormItem>
                <FormItem class="inline-form-item" label="客户姓名" prop="customer">
                  <i-input type="text" placeholder="客户姓名" v-model.trim="formData.customer" />
                </FormItem>
                <FormItem class="inline-form-item" label="预计住店开始时间" prop="startTime">
                  <i-date-picker v-model="formData.startTime"
                                 :editable="false"
                                 :options="dateOptions"
                                 transfer
                                 type="datetime"
                                 format="yyyy-MM-dd"
                                 style="width: 100%;"
                                 placeholder="预计住店开始时间"></i-date-picker>
                </FormItem>
                <FormItem class="inline-form-item" label="预计住店结束时间" prop="endTime">
                  <i-date-picker v-model="formData.endTime"
                                 :editable="false"
                                 :options="dateOptions"
                                 transfer
                                 type="datetime"
                                 format="yyyy-MM-dd"
                                 style="width: 100%;"
                                 placeholder="预计住店结束时间"></i-date-picker>
                </FormItem>
                <FormItem class="inline-form-item" label="类型" prop="type">
                  <i-select v-model="formData.type"
                            transfer
                            placeholder="类型">
                    <i-option v-for="item in ordainRoomTypeList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="订单模式" prop="model">
                  <i-radio-group v-model="formData.model"
                                 @on-change="orderModelChange">
                    <i-radio v-for="item in orderModalList"
                             :key="item.value"
                             :label="item.value">
                      {{item.label}}
                    </i-radio>
                  </i-radio-group>
                </FormItem>
                <FormItem v-if="formData.model === orderModal.agreement"
                          class="inline-form-item" label="协议客户" prop="otherId">
                  <i-select v-model="formData.otherId"
                            style="width: 300px"
                            transfer
                            placeholder="请选择协议客户"
                            @on-change="onAgreementChange">
                    <i-option v-for="item in agreementUserList"
                              :value="item.id"
                              :key="item.id">
                      {{ item.name }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem v-if="formData.model === orderModal.vip && vipCouponList.length > 0"
                          class="inline-form-item" label="优惠券" prop="otherId">
                  <i-select v-model="formData.otherId"
                            style="width: 300px"
                            transfer
                            placeholder="选择优惠券"
                            @on-change="couponSelected">
                    <i-option v-for="item in vipCouponList"
                              :value="item.couponsId"
                              :label="item.title"
                              :key="item.couponsId">
                      <div class="option-content">
                        <div class="option-block">{{item.title}}</div>
                        <div class="option-block">{{item.purpose | couponType}}</div>
                        <template v-if="item.purpose === couponsType.moneyOff">
                          <div class="option-block">最低消费：{{$util.toYuan(item.fullAmount)}}</div>
                          <div class="option-block">优惠金额：{{$util.toYuan(item.subtractAmount)}}</div>
                        </template>
                        <div v-else class="option-block">折扣：{{item.discount}}</div>
                      </div>
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="房间类型" prop="roomTypeId">
                  <span>{{formData.roomTypeName}}</span>
                </FormItem>
                <FormItem class="inline-form-item" label="房号" prop="roomNumber">
                  <span>{{formData.roomNumber}}</span>
                </FormItem>
                <FormItem class="inline-form-item" label="入住人数" prop="num">
                  <i-input-number type="text" placeholder="入住人数"
                                  v-model.trim="formData.num"
                                  @on-change="roomUserNumChange" />
                </FormItem>
                <FormItem class="inline-form-item" label="房价" prop="price">
                  <i-input type="text" placeholder="房价"
                           style="width: 60%"
                           :disabled="!canModifyRoomPrice"
                           v-model.trim="formData.price" />
                  <i-button type="primary" size="small" style="margin-left: 10px"
                            :disabled="canModifyRoomPrice"
                            @click="pwdAuth">修改</i-button>
                  <i-button type="primary" size="small" style="margin-left: 10px"
                            :disabled="!canModifyRoomPrice"
                            @click="priceRestore">恢复</i-button>
                </FormItem>
                <FormItem  class="inline-form-item" label="押金" prop="cashPledge">
                  <i-input type="text" placeholder="押金" v-model.trim="formData.cashPledge" />
                </FormItem>
                <FormItem class="block-form-item" label="备注" prop="remark">
                  <i-input type="textarea" :autosize="{minRows: 2,maxRows: 2}" placeholder="备注" v-model.trim="formData.remark" />
                </FormItem>
              </div>

              <div class="form-item-block table-block">
                <table-com class="good-table"
                           :data="formData.customers"
                           :has-page="false"
                           :config="userTableConfig">
                  <template slot="col0"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label"
                                     :min-width="item.minWidth">
                      <template slot-scope="{ row, $index }">
                        <FormItem :label-width="0"
                                  :prop="'customers.' + $index + '.phone'"
                                  :rules="requireStringRule">
                          <i-input type="text"
                                   search enter-button
                                   placeholder="手机号码"
                                   v-model.trim="row.phone"
                                   @on-search="getUserByPhone(row.phone, $index)" />
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col1"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label"
                                     :min-width="item.minWidth">
                      <template slot-scope="{ row, $index }">
                        <FormItem :label-width="0"
                                  :prop="'customers.' + $index + '.idCard'"
                                  :rules="requireStringRule">
                          <i-input type="text"
                                   search enter-button
                                   placeholder="请输入身份证号码"
                                   v-model.trim="row.idCard"
                                   @on-search="getByIdCard(row.idCard, $index)" />
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col2"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label">
                      <template slot-scope="{ row, $index }">
                        <FormItem :label-width="0"
                                  :prop="'customers.' + $index + '.name'"
                                  :rules="requireStringRule">
                          <i-input type="text" placeholder="请输入姓名" v-model.trim="row.name" />
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col3"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label">
                      <template slot-scope="{ row, $index }">
                        <div class="operate-block">
                          <FormItem :label-width="0"
                                    :prop="'customers.' + $index + '.sex'"
                                    :rules="requireNumberRule">
                            <i-select v-model="row.sex"
                                      transfer
                                      placeholder="请选择性别">
                              <i-option v-for="item in genderList"
                                        :value="item.value"
                                        :key="item.value">
                                {{ item.label }}
                              </i-option>
                            </i-select>
                          </FormItem>
                        </div>
                      </template>
                    </el-table-column>
                  </template>
                </table-com>
              </div>

              <div class="form-item-block table-block">
                <i-button type="primary" style="margin-bottom: 10px" size="small" @click="addGood">添加</i-button>
                <table-com class="good-table"
                           :data="formData.consumeRecords"
                           :has-page="false"
                           :config="goodsTableConfig">
                  <template slot="col0"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label">
                      <template slot-scope="{ row, $index }">
                        <FormItem :label-width="0"
                                  :prop="'consumeRecords.' + $index + '.goodsName'">
                          <i-select v-model="row.goodsId"
                                    transfer
                                    placeholder="请选择商品"
                                    @on-change="onGoodChange($event,  $index)">
                            <i-option v-for="item in goodsList"
                                      :value="item.id"
                                      :key="item.id">
                              {{ item.name }}
                            </i-option>
                          </i-select>
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col1"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label">
                      <template slot-scope="{ row }">
                        <span>{{row.unitPrice}}</span>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col2"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label">
                      <template slot-scope="{ row, $index }">
                        <FormItem :label-width="0"
                                  :prop="'consumeRecords.' + $index + '.num'">
                          <i-input-number :disabled="row.goodsId === undefined" style="width: 100%;" type="text" placeholder="商品数量" v-model="row.num" />
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col3"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label">
                      <template slot-scope="{ row, $index }">
                        <div class="operate-block">
                          <i-button type="error" class="table-btn" size="small" @click="delGood($index)">删除</i-button>
                        </div>
                      </template>
                    </el-table-column>
                  </template>
                </table-com>
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

    <pwdModal ref="pwdModal"></pwdModal>
  </div>
</template>

<script>
import {
  orderTypeList,
  ordainRoomTypeList,
  orderModalList,
  couponsType,
  orderModal,
  genderList,
  isRoomPriceChange, couponsTypeList, payTypeList
} from '../../../assets/enums';
import pwdModal from '../components/managerPwdModal';
import { tableConfig, userTableConfig, goodsTableConfig } from './tableConfig';
import defaultsDeep from 'lodash/defaultsDeep';
import { mapGetters } from 'vuex';
export default {
  components: {
    pwdModal
  },
  filters: {
    couponType (val) {
      return couponsTypeList.find(item => item.value === val).label;
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data (vm) {
    const validatePhoneNum = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isMobile(value) || this.$validator.isTelephone(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的联系电话'));
      }
    };

    const dateCompare = (rule, value, callback) => {
      if (vm.formData.startTime && vm.formData.endTime) {
        if (vm.formData.startTime <= vm.formData.endTime) {
          callback();
        } else {
          callback(new Error('结束日期必须大于开始日日期'));
        }
      } else {
        callback();
      }
    };
    return {
      payTypeList,
      genderList,
      couponsType,
      userTableConfig: userTableConfig.slice(0, 4),
      goodsTableConfig,
      orderModal,
      orderModalList,
      tableConfig,
      orderTypeList,
      ordainRoomTypeList,
      visible: false,
      isLoading: false,
      isRoomListSelect: false,
      canModifyRoomPrice: false,
      roomListMap: {},
      item: {},
      vipCouponList: [],
      agreementUserList: [],
      originFormData: {},
      goodsList: [],
      confirmFn: null,
      cancelFn: null,
      formData: {
        userId: 0,
        startTime: new Date(),
        endTime: new Date(this.$date().add(1, 'day')),
        otherId: '',
        model: orderModal.normal,
        customers: [],
        consumeRecords: []
      },
      dateOptions: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      formRule: {
        orderType: [
          { required: true, type: 'number', message: '请选择预定方式', trigger: 'blur' }
        ],
        startTime: [
          { required: true, type: 'date', message: '请选择预计住店开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, type: 'date', message: '请选择预计住店结束时间', trigger: ['change', 'blur'] },
          { validator: dateCompare, trigger: 'blur' }
        ],
        type: [
          { required: true, type: 'number', message: '请选择类型', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        customer: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        payType: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ]
      },
      requireStringRule: { required: true, message: `请输入`, trigger: 'blur' },
      requireNumberRule: { required: true, type: 'number', message: `请输入`, trigger: 'blur' }
    };
  },
  methods: {
    show ({ item, activeRoom = {}, confirmFn, cancelFn }) {
      if (!item) return;
      this.getAgreementUserByHotelId(item.hotelId);
      this.getGoodsList(item.hotelId).then(data => {
        this.goodsList = data;
        this.item = item;
        this.formData = defaultsDeep({}, {
          ...activeRoom,
          roomId: activeRoom.id,
          roomType: activeRoom.roomTypeName,
          price: this.$util.toYuan(activeRoom.price),
          orginalPrice: this.$util.toYuan(activeRoom.price),
          cashPledge: this.$util.toYuan(activeRoom.cashPledge)
        }, this.formData);

        for (let i = 0; i < this.formData.num; i++) {
          this.formData.customers.push({});
        }

        this.originFormData = defaultsDeep({}, this.formData);
        if (confirmFn) {
          this.confirmFn = confirmFn;
        }

        if (cancelFn) {
          this.cancelFn = cancelFn;
        }
        this.visible = true;
      }).catch(err => {
        this.reset();
        this.$message.error(`获取商品列表失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    queryCoupons () {
      this.$ajax.get({
        apiKey: 'couponGetByPhone',
        params: {
          hotelId: this.item.hotelId,
          phone: this.formData.mobile
        }
      }).then(res => {
        this.vipCouponList = res || [];
      }).catch(() => {
        this.vipCouponList = [];
        this.$message.error('获取优惠券失败');
      });
    },
    couponSelected (couponsId) {
      if (!couponsId) return;
      const coupon = this.vipCouponList.find(item => item.couponsId === couponsId);
      if (coupon.purpose === couponsType.moneyOff) {
        const total = Number(this.$util.toCent(this.formData.price));
        if (total < coupon.fullAmount) {
          this.$message.warning('不满足条件，无法使用该优惠券');
          this.$nextTick(() => {
            this.formData.otherId = '';
          });
        }
      }
    },
    orderModelChange (val) {
      this.formData.otherId = '';
      this.formData = defaultsDeep({}, this.originFormData);
      this.formData.model = val;
    },
    getAgreementUserByHotelId (hotelId) {
      this.$ajax.get({
        apiKey: 'agreementGetByHotelId',
        params: {
          hotelId
        },
        loading: false
      }).then(res => {
        this.agreementUserList = res || [];
      }).catch(() => {
        this.$message.error('获取协议用户失败');
      });
    },
    onAgreementChange (agreementId) {
      if (!agreementId) return;
      this.getAgreementPriceList({
        agreementId,
        hotelId: this.item.hotelId,
        roomTypeIdList: this.formData.roomTypeId
      });
    },
    getAgreementPriceList ({ agreementId, hotelId, roomTypeIdList }) {
      this.$ajax.post({
        apiKey: 'roomTypeGetAgreementPriceList',
        params: {
          agreementId,
          hotelId,
          roomTypeIdList
        }
      }).then(res => {
        const agreementRoom = res?.[0] || {};
        Object.assign(this.formData, {
          ...agreementRoom,
          isPriceRoom: agreementRoom.isActivity,
          price: this.$util.toYuan(agreementRoom.price),
          orginalPrice: this.$util.toYuan(agreementRoom.originalPrice),
          cashPledge: this.$util.toYuan(agreementRoom.cashPledge)
        });
      }).catch(() => {
        this.$message.error('获取协议房信息失败');
      });
    },
    roomUserNumChange (val) {
      const gap = val - this.formData.customers.length;
      if (gap > 0) {
        this.formData.customers.push({});
      } else {
        this.formData.customers.splice(this.formData.customers.length + gap, -gap);
      }
    },
    getGoodsList (hotelId) {
      return new Promise((resolve, reject) => {
        this.$ajax.post({
          apiKey: 'goodPageList',
          params: {
            hotelId,
            pageNum: 1,
            pageSize: 99999
          }
        }).then(data => {
          data = (data.data || []).filter(item => item.status === 1);
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    addGood () {
      this.formData.consumeRecords.push({});
    },
    delGood (index) {
      this.formData.consumeRecords.splice(index, 1);
    },
    onGoodChange (goodId, $index) {
      if (goodId === null || goodId === undefined) return;
      Object.assign(this.formData.consumeRecords[$index], this.getGoodParams(goodId));
    },
    getGoodParams (goodId) {
      const goodItem = this.goodsList.find(item => item.id === goodId);
      return {
        goodsId: goodItem.id,
        goodsName: goodItem.name,
        unitPrice: goodItem.unitPrice,
        num: 1,
        orderCode: this.formData.code
      };
    },
    getUserByPhone (phone, $index) {
      if (!phone) return;
      this.$ajax.get({
        apiKey: 'customerGetByPhone',
        params: {
          phone
        }
      }).then(res => {
        if (res) {
          this.$set(this.formData.customers[$index], 'idCard', res.idCard);
          this.$set(this.formData.customers[$index], 'name', res.name);
          this.$set(this.formData.customers[$index], 'sex', res.sex);
        } else {
          return Promise.reject(new Error());
        }
      }).catch(() => {
        this.$message.error('查询不到此用户，请手动填写信息');
      });
    },
    getByIdCard (idCard, $index) {
      if (!idCard) return;
      this.$ajax.get({
        apiKey: 'vipUserGetByIdCard',
        params: {
          idCard
        }
      }).then(res => {
        if (res) {
          this.$set(this.formData.customers[$index], 'phone', res.phone);
          this.$set(this.formData.customers[$index], 'name', res.name);
          this.$set(this.formData.customers[$index], 'sex', res.sex);
        } else {
          return Promise.reject(new Error());
        }
      }).catch(() => {
        this.$message.error('查询不到此用户，请手动填写信息');
      });
    },
    pwdAuth () {
      this.$refs.pwdModal.show({
        hotelId: this.item.hotelId,
        successHandler: () => {
          this.canModifyRoomPrice = true;
          this.$set(this.formData, 'isChange', isRoomPriceChange.yes);
        }
      });
    },
    priceRestore () {
      this.$set(this.formData, 'price', this.formData.orginalPrice);
      this.$set(this.formData, 'isChange', isRoomPriceChange.no);
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
      this.reserveAndCheckIn();
    },
    reserveAndCheckIn () {
      this.isLoading = true;
      const formData = defaultsDeep({}, this.formData);

      this.$ajax.post({
        apiKey: 'orderSubmitCheckin',
        params: {
          ...formData,
          startTime: this.$date(this.formData.startTime).format('YYYY-MM-DD'),
          endTime: this.$date(this.formData.endTime).format('YYYY-MM-DD'),
          price: this.$util.toCent(this.formData.price),
          orginalPrice: this.$util.toCent(this.formData.price),
          cashPledge: this.$util.toCent(this.formData.cashPledge)
        },
        config: {
          headers: { 'Content-Type': 'application/json;charset-UTF-8' }
        }
      }).then(res => {
        if (res === 1) {
          this.$message.success('预定入住成功');
          this.confirmFn && this.confirmFn();
          this.reset();
        } else {
          this.isLoading = false;
          this.$message.error(`预定入住失败${res.msg ? ': ' + res.msg : ''}`);
        }
      }).catch(err => {
        this.isLoading = false;
        this.$message.error(`预定入住失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        userId: 0
      };

      this.visible = false;
      this.isLoading = false;
      this.isRoomListSelect = false;
      this.canModifyRoomPrice = false;
      this.roomListMap = {};
      this.item = {};
      this.vipCouponList = [];
      this.agreementUserList = [];
      this.originFormData = {};
      this.goodsList = [];
      this.confirmFn = null;
      this.cancelFn = null;
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
/deep/ .el-dialog__body {
  padding: 25px 0 30px;
  overflow-y: auto;
}
.dialog-wrapper {
  @include flex_layout(row, center, flex-start);
  padding: 0 25px 0;
  max-height: 450px;
  .form-wrapper {
    width: 100%;

    .form-item-wrapper {

      .form-item-block {
        margin-right: 20px;
        font-size: 13px;
        color: #333333;

        .form-item-block-title {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .result-block {
          width: 50%;
          display: inline-block;
          padding: 20px 50px;

          .success {
            color: $normalGreen;
          }

          .error {
            color: red;
          }
        }

        &:last-child {
          margin: 0;
        }
      }
    }

    .table-block {
      min-height: 200px;

      .good-table {
        height: calc(100% - 34px);
      }

      /deep/ .ivu-form-item {
        width: 100%;
      }
    }
  }
}

.option-content {
  @include flex_layout(row, flex-start, center);
  .option-block {
    margin-right: 10px;
    background-color: $lightGray;
    border-radius: 5px;
    padding: 5px 10px;
  }
}

</style>
