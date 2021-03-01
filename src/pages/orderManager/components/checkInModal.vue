<template>
  <div class="modal-wrapper">
    <el-dialog title="登记入住"
               v-show="showModal"
               :visible.sync="visible"
               :close-on-click-modal="false"
               :show-close="canCloseModal"
               width="50%"
               custom-class="form-dialog"
               @close="cancel"
               center>
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
        <template v-if="modalState === modalStatus.orderPreview">
          <!-- 协议客户信息 -->
          <div v-if="agreementUserList && agreementUserList.length > 0" class="border-form-wrapper">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <div class="block-form-item">
                  <div class="info-label" style="width: 150px">是否为协议客户:</div>
                  <div class="info-content">
                    <i-checkbox v-model="agreementInfo.isAgreementCustomer" @on-change="customerTypeChange"></i-checkbox>
                  </div>
                </div>
                <div class="block-form-item" v-if="agreementInfo.isAgreementCustomer">
                  <div class="info-label" style="width: 150px">协议客户:</div>
                  <div class="info-content">
                    <i-select v-model="agreementInfo.agreementId"
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
                  </div>
                </div>
                <div class="block-form-item"
                     v-if="!agreementInfo.isAgreementCustomer && vipCouponList && vipCouponList.length > 0">
                  <div class="info-label" style="width: 150px">优惠券:</div>
                  <div class="info-content">
                    <i-select v-model="couponsInfo.couponsId"
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
                  </div>
                </div>
              </div>
            </div>
            <i-divider />
          </div>
          <!-- 订单列表 -->
          <template v-if="!isResetReserveListForm">
            <div v-for="(formData, formIndex) in reserveListFormData"
                 :key="formData.id"
                 class="form-wrapper border-form-wrapper">
              <i-form ref="Form"
                      inline
                      :disabled="isLoading"
                      :model="formData"
                      :rules="reserveFromRule"
                      :label-width="90"
                      label-position="right">
                <div class="form-item-wrapper check-board">
                  <div class="check-block">
                    <i-checkbox v-model="checkList[formIndex]"></i-checkbox>
                  </div>
                  <div class="form-item-block">
                    <div class="inline-info-item">
                      <div class="info-label">订单编号:</div>
                      <div class="info-content">{{formData.code}}</div>
                    </div>
                    <div class="inline-info-item">
                      <div class="info-label">预定方式:</div>
                      <div class="info-content">{{orderTypeList.find(item => item.value === formData.orderType).label}}</div>
                    </div>
                    <div class="inline-info-item">
                      <div class="info-label">房间类型:</div>
                      <div class="info-content">{{formData.roomType}}</div>
                    </div>
                    <div class="inline-info-item">
                      <div class="info-label">房号:</div>
                      <div class="info-content">{{formData.roomNumber}}</div>
                    </div>
                    <div class="inline-info-item">
                      <div class="info-label">类型:</div>
                      <div class="info-content">{{ordainRoomTypeList.find(item => item.value === formData.type).label}}</div>
                    </div>
                    <div class="inline-info-item">
                      <div class="info-label">联系电话:</div>
                      <div class="info-content">{{formData.mobile}}</div>
                    </div>
                    <FormItem class="inline-form-item" label="房价" prop="price">
                      <i-input type="text"
                               style="width: 60%"
                               placeholder="房价"
                               :disabled="!canModifyRoomPrice"
                               v-model.trim="formData.price" />
                      <i-button type="primary" size="small" style="margin-left: 10px"
                                :disabled="canModifyRoomPrice"
                                @click="pwdAuth(formIndex)">修改</i-button>
                      <i-button type="primary" size="small" style="margin-left: 10px"
                                :disabled="!canModifyRoomPrice"
                                @click="priceRestore(formIndex)">恢复</i-button>
                    </FormItem>
                    <FormItem class="inline-form-item" label="押金" prop="cashPledge">
                      <i-input type="text"
                               placeholder="押金"
                               v-model.trim="formData.cashPledge"/>
                    </FormItem>
                    <div class="form-item-block table-block">
                      <i-button type="primary" style="margin-bottom: 10px" size="small" @click="addGood(formIndex)">添加</i-button>
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
                                          @on-change="onGoodChange($event, formIndex,  $index)">
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
                                <i-input-number :disabled="row.goodsId === undefined || [-1, -2].includes(row.goodsId)"
                                                style="width: 100%;" type="text" placeholder="商品数量" v-model="row.num" />
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
                                <i-button type="error" class="table-btn" size="small" @click="delGood(formIndex, $index)">删除</i-button>
                              </div>
                            </template>
                          </el-table-column>
                        </template>
                      </table-com>
                    </div>
                  </div>
                </div>
              </i-form>
            </div>
          </template>
        </template>
        <!-- 登记入住 -->
        <template v-if="modalState === modalStatus.checkin">
          <div v-for="(formData, formIndex) in checkinListFormData"
               :key="formData.id"
               class="form-wrapper border-form-wrapper">
            <i-form ref="Form"
                    inline
                    :disabled="isLoading"
                    :model="formData"
                    :label-width="100"
                    label-position="right">
              <div class="form-item-wrapper">
                <div class="form-item-block">
                  <div class="inline-info-item">
                    <div class="info-label">订单编号:</div>
                    <div class="info-content">{{formData.orderCode}}</div>
                  </div>
                  <div class="inline-info-item">
                    <div class="info-label">入住人数:</div>
                    <div class="info-content">{{formData.num}}</div>
                  </div>
                  <div class="form-item-block table-block">
                    <i-button type="primary" style="margin-bottom: 10px" size="small" @click="addUser(formIndex)">添加</i-button>
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
                                       @on-search="getUserByPhone(row.phone, $index, formIndex)" />
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
                                       @on-search="getByIdCard(row.idCard, $index, formIndex)" />
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
                      <template slot="col4"
                                slot-scope="{ item }">
                        <el-table-column :prop="item.prop"
                                         :label="item.label"
                                         :min-width="item.minWidth">
                          <template slot-scope="{ row, $index }">
                            <div class="operate-block">
                              <i-button :disabled="$index + 1 <= formData.num" type="error" size="small" @click="delUser(formIndex, $index)">删除</i-button>
                            </div>
                          </template>
                        </el-table-column>
                      </template>
                    </table-com>
                  </div>
                </div>
              </div>
            </i-form>
          </div>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button v-if="canCloseModal" style="margin-right: 10px" type="primary" @click="payValidate">支 付</i-button>
        <i-button v-if="modalState === modalStatus.checkin" style="margin-right: 10px" type="primary" @click="checkinConfirm">登记入住</i-button>
        <i-button v-if="modalState === modalStatus.query" @click="cancel">取 消</i-button>
      </span>
    </el-dialog>

    <payModal ref="payModal"></payModal>
    <pwdModal ref="pwdModal"></pwdModal>
  </div>
</template>

<script>
import { orderTypeList, ordainRoomTypeList, genderList, genderMap, isRoomPriceChange, couponsTypeList, couponsType } from '../../../assets/enums';
import { goodsTableConfig, userTableConfig } from './tableConfig';
import payModal from '../components/payModal';
import pwdModal from '../components/managerPwdModal';
import defaultsDeep from 'lodash/defaultsDeep';
const modalStatus = {
  query: 'query',
  orderPreview: 'orderPreview',
  checkin: 'checkin'
};
export default {
  components: {
    payModal,
    pwdModal
  },
  filters: {
    couponType (val) {
      return couponsTypeList.find(item => item.value === val).label;
    }
  },
  computed: {
    canCloseModal () {
      return this.modalState === modalStatus.orderPreview;
    }
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

    const isNumber = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isNumber(value)) {
        callback();
      } else {
        callback(new Error('请输入数字'));
      }
    };
    return {
      couponsType,
      isRoomPriceChange,
      goodsTableConfig,
      userTableConfig,
      modalStatus,
      orderTypeList,
      ordainRoomTypeList,
      genderList,
      visible: false,
      showModal: true,
      isLoading: false,
      item: {},
      goodsList: [],
      modalState: modalStatus.query,
      reserveListFormData: [],
      reserveListFormDataOrigin: [],
      vipCouponList: [],
      agreementUserList: [],
      checkList: [],
      queryFromData: {
        mobile: ''
      },
      checkinListFormData: {
        sex: genderMap.male
      },
      confirmFn: null,
      cancelFn: null,
      canModifyRoomPrice: false,
      isResetReserveListForm: false,
      agreementInfo: {
        isAgreementCustomer: false,
        agreementId: ''
      },
      couponsInfo: {
        couponsId: 0
      },
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
      },
      requireStringRule: { required: true, message: `请输入`, trigger: 'blur' },
      requireNumberRule: { required: true, type: 'number', message: `请输入`, trigger: 'blur' }
    };
  },
  methods: {
    show ({ item, phone = '', confirmFn, cancelFn }) {
      if (!item) return;
      this.item = { ...item, userId: 0 };
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.getAgreementUserByHotelId(item.hotelId);
      this.getGoodsList(item.hotelId).then(data => {
        this.goodsList = [
          {
            id: -1,
            name: '赔偿',
            unitPrice: 0
          },
          {
            id: -2,
            name: '其他杂费',
            unitPrice: 0
          }
        ].concat(data);
        this.visible = true;
        this.$nextTick(() => {
          if (phone) {
            this.queryFromData.mobile = phone;
            this.getByMobile();
          }
        });
      }).catch(err => {
        this.reset();
        this.$message.error(`获取商品列表失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    getByMobile () {
      this.$refs.Form.validate(valid => {
        if (!valid) return;
        this.$ajax.get({
          apiKey: 'orderGetByMobile',
          params: {
            hotelId: this.item.hotelId,
            mobile: this.queryFromData.mobile
          }
        }).then(data => {
          const { orderList, vipCouponList } = data || {};
          if (orderList?.length > 0) {
            this.modalState = modalStatus.orderPreview;
            this.reserveListFormData = orderList.map(formData => ({
              ...formData,
              isChange: isRoomPriceChange.no,
              price: this.$util.toYuan(formData.price),
              originPrice: this.$util.toYuan(formData.price),
              cashPledge: this.$util.toYuan(formData.cashPledge),
              consumeRecords: []
            }));
            this.reserveListFormDataOrigin = defaultsDeep([], this.reserveListFormData);
            this.vipCouponList = vipCouponList || [];
          } else {
            return Promise.reject({ msg: '该手机号无预定信息' });
          }
        }).catch(err => {
          this.$message.error(`查询失败${err.msg ? ': ' + err.msg : ''}`);
        });
      });
    },
    couponSelected (couponsId) {
      if (!couponsId) return;
      const coupon = this.vipCouponList.find(item => item.couponsId === couponsId);
      if (coupon.purpose === couponsType.moneyOff) {
        const total = this.reserveListFormData.reduce((pre, cur) => pre + this.$util.toCent(cur.price), 0);
        if (total < coupon.fullAmount) {
          this.$message.warning('不满足条件，无法使用该优惠券');
          this.couponsInfo.couponsId = 0;
        }
      }
    },
    resetReserveListFormData () {
      this.reserveListFormData = this.reserveListFormDataOrigin;
      this.agreementInfo.agreementId = '';
      this.isResetReserveListForm = true;
      this.$nextTick(() => {
        this.couponsInfo.couponsId = 0;
        this.isResetReserveListForm = false;
      });
    },
    customerTypeChange (val) {
      if (!val) {
        this.resetReserveListFormData();
      }
    },
    onAgreementChange (agreementId) {
      if (!agreementId) return;
      this.getAgreementPriceList({
        agreementId,
        hotelId: this.item.hotelId,
        roomTypeIdList: this.reserveListFormData.map(item => item.roomTypeId).join(',')
      });
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
    getAgreementPriceList ({ agreementId, hotelId, roomTypeIdList }) {
      this.$ajax.post({
        apiKey: 'roomTypeGetAgreementPriceList',
        params: {
          agreementId,
          hotelId,
          roomTypeIdList
        }
      }).then(res => {
        const agreementRoomList = res || [];
        this.reserveListFormData.forEach(item => {
          const matchRoom = agreementRoomList.find(agreementRoom => agreementRoom.roomTypeId === item.roomTypeId);
          Object.assign(item, {
            ...matchRoom,
            isPriceRoom: matchRoom.isActivity,
            price: this.$util.toYuan(matchRoom.price),
            originPrice: this.$util.toYuan(matchRoom.price),
            cashPledge: this.$util.toYuan(matchRoom.cashPledge)
          });
        });
      }).catch(() => {
        this.$message.error('获取协议房信息失败');
      });
    },
    addGood (formIndex) {
      this.reserveListFormData[formIndex].consumeRecords.push({});
    },
    delGood (formIndex, index) {
      this.reserveListFormData[formIndex].consumeRecords.splice(index, 1);
    },
    onGoodChange (goodId, formIndex, $index) {
      if (goodId === null || goodId === undefined) return;
      Object.assign(this.reserveListFormData[formIndex].consumeRecords[$index], this.getGoodParams(goodId));
    },
    getGoodParams (goodId) {
      const goodItem = this.goodsList.find(item => item.id === goodId);
      return {
        goodsId: goodItem.id,
        goodsName: goodItem.name,
        unitPrice: goodItem.unitPrice,
        num: 1,
        orderCode: this.reserveListFormData[0].code
      };
    },
    payValidate () {
      if (this.checkList.filter(item => !!item).length === 0) {
        this.$message.warning('请选择订单');
        return;
      }
      this.payment();
    },
    payment () {
      this.showModal = false;
      const coupon = this.vipCouponList.find(item => item.couponsId === this.couponsInfo.couponsId);
      const item = {
        ...this.item,
        orderPaymentVos: this.reserveListFormData
          .filter((item, index) => !!this.checkList[index])
          .map(item => ({
            orderCode: item.code,
            cashPledge: this.$util.toCent(item.cashPledge),
            roomMoney: this.$util.toCent(item.price),
            consumeRecords: item.consumeRecords
          }))
      };
      this.$refs.payModal.show({
        item,
        showDetail: true,
        config: { cashPledge: true, roomMoney: true, consume: false, coupon: coupon },
        confirmFn: () => {
          this.showModal = true;
          this.modalState = modalStatus.checkin;
          this.checkinListFormData = this.reserveListFormData
            .filter((item, index) => !!this.checkList[index])
            .map(item => ({
              num: item.customerNum,
              orderCode: item.code,
              hotelId: this.item.hotelId,
              couponsId: this.couponsInfo.couponsId,
              customers: [...new Array(2)].map(() => ({}))
            }));
        },
        cancelFn: () => {
          this.showModal = true;
        }
      });
    },
    addUser (formIndex) {
      this.checkinListFormData[formIndex].customers.push({});
    },
    delUser (formIndex, index) {
      this.checkinListFormData[formIndex].customers.splice(index, 1);
    },
    getUserByPhone (phone, $index, formIndex) {
      if (!phone) return;
      this.$ajax.get({
        apiKey: 'customerGetByPhone',
        params: {
          phone
        }
      }).then(res => {
        if (res) {
          this.$set(this.checkinListFormData[formIndex].customers[$index], 'idCard', res.idCard);
          this.$set(this.checkinListFormData[formIndex].customers[$index], 'name', res.name);
          this.$set(this.checkinListFormData[formIndex].customers[$index], 'sex', res.sex);
        } else {
          return Promise.reject(new Error());
        }
      }).catch(() => {
        this.$message.error('查询不到此用户，请手动填写信息');
      });
    },
    getByIdCard (idCard, $index, formIndex) {
      if (!idCard) return;
      this.$ajax.get({
        apiKey: 'vipUserGetByIdCard',
        params: {
          idCard
        }
      }).then(res => {
        if (res) {
          this.$set(this.checkinListFormData[formIndex].customers[$index], 'phone', res.phone);
          this.$set(this.checkinListFormData[formIndex].customers[$index], 'name', res.name);
          this.$set(this.checkinListFormData[formIndex].customers[$index], 'sex', res.sex);
        } else {
          return Promise.reject(new Error());
        }
      }).catch(() => {
        this.$message.error('查询不到此用户，请手动填写信息');
      });
    },
    checkinConfirm () {
      let valid = true;
      this.$refs.Form.forEach(form => {
        form.validate(val => {
          if (!val) {
            valid = false;
          }
        });
      });

      if (valid) {
        this.checkin();
      }
    },
    checkin () {
      this.$ajax.post({
        apiKey: 'orderCheckin',
        params: {
          checkinVos: this.checkinListFormData,
          couponsId: this.couponsInfo.couponsId,
          hotelId: this.item.hotelId
        },
        config: {
          headers: { 'Content-Type': 'application/json;charset-UTF-8' }
        },
        loading: false
      }).then(() => {
        this.$message.success('登记入住成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`登记入住失败${err.msg ? ': ' + err.msg : ''}`);
      });
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
    pwdAuth (formIndex) {
      this.$refs.pwdModal.show({
        hotelId: this.item.hotelId,
        successHandler: () => {
          this.canModifyRoomPrice = true;
          this.$set(this.reserveListFormData[formIndex], 'isChange', isRoomPriceChange.yes);
        }
      });
    },
    priceRestore (formIndex) {
      this.$set(this.reserveListFormData[formIndex], 'price', this.reserveListFormData[formIndex].originPrice);
      this.$set(this.reserveListFormData[formIndex], 'isChange', isRoomPriceChange.no);
    },
    cancel () {
      if (![modalStatus.orderPreview, modalStatus.query].includes(this.modalState)) return;
      this.cancelFn && this.cancelFn();
      this.reset();
    },
    reset () {
      if (this.$refs.Form.length) {
        this.$refs.Form.forEach(item => item.resetFields());
      } else {
        this.$refs.Form.resetFields();
      }
      this.item = {};
      this.modalState = modalStatus.query;
      this.canModifyRoomPrice = false;
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;

      this.showModal = true;
      this.goodsList = [];
      this.reserveListFormData = [];
      this.reserveListFormDataOrigin = [];
      this.vipCouponList = [];
      this.agreementUserList = [];
      this.checkList = [];
      this.queryFromData = {
        mobile: ''
      };
      this.checkinListFormData = {
        sex: genderMap.male
      };
      this.isResetReserveListForm = false;
      this.agreementInfo = {
        isAgreementCustomer: false,
        agreementId: ''
      };
      this.couponsInfo = {
        couponsId: 0
      };
    }
  }
};
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/scss/base";
  /deep/ .el-dialog__body {
    max-height: 400px;
    overflow-y: auto;
  }
  .dialog-wrapper {
    padding: 0 20px 0;

    .form-wrapper {
      width: 100%;

      &.border-form-wrapper {
        &:not(:last-child) {
          border-bottom: 1px solid $lightGray;
        }
      }

      &.query-form {
        @include flex_layout(row, center, center);
        min-height: 150px;

        /deep/ .ivu-form-item {
          margin-bottom: 0;
        }
      }

      .form-item-wrapper {
        &.check-board {
          @include flex_layout(row, flex-start, flex-start)
        }
        .check-block {
          @include flex_set(0, 1, auto);
          margin-top: 10px;
          width: 50px;
          height: 100%;
        }
        .form-item-block {
          @include flex_set(0, 1, auto);
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

      .table-block {
        margin-top: 20px;
        height: 200px;

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
