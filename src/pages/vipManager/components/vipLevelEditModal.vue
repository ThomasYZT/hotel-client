<template>
  <div class="board-wrapper">
    <page-board v-model="visible"
                @close="cancel">
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="140"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="block-form-item" label="等级名称" prop="name">
                  <i-input type="text" placeholder="等级名称" v-model="formData.name" />
                </FormItem>
                <FormItem class="block-form-item" label="序号" prop="sortNo">
                  <i-input type="text" placeholder="序号" v-model="formData.sortNo" />
                </FormItem>
                <FormItem class="block-form-item" label="优惠券" prop="couponsList">
                  <i-button type="primary" @click="checkCoupons">选择优惠券</i-button>
                  <div class="coupon-tag-wrapper">
                    <div class="coupon-tag"
                         v-for="item in formData.couponsList" :key="item.id">
                      <img class="del-icon"  alt=""
                           src="../../../assets/img/delete.png"
                           @click.stop="delCoupon(item)">
                      {{item.title}}
                    </div>
                  </div>
                </FormItem>
                <FormItem class="block-form-item" label="升级经验" prop="upgradeExperience">
                  <i-input type="text" placeholder="升级经验" v-model="formData.upgradeExperience" />
                </FormItem>
                <FormItem class="block-form-item" label="赠送金额" prop="giveMoney">
                  <i-input type="text" placeholder="赠送金额" v-model="formData.giveMoney" />
                </FormItem>
                <FormItem class="block-form-item" label="开卡金额" prop="openCardAmount">
                  <i-input type="text" placeholder="开卡金额" v-model="formData.openCardAmount" />
                </FormItem>
                <FormItem class="block-form-item" label="每消费多少钱" prop="consumptionMoney">
                  <i-input type="text" placeholder="每消费多少钱" v-model="formData.consumptionMoney" />
                </FormItem>
                <FormItem class="block-form-item" label="赠送经验上限" prop="giveExperienceMax">
                  <i-input type="text" placeholder="赠送经验上限" v-model="formData.giveExperienceMax" />
                </FormItem>
                <FormItem class="block-form-item" label="赠送积分上限" prop="giveIntegralMax">
                  <i-input type="text" placeholder="赠送积分上限" v-model="formData.giveIntegralMax" />
                </FormItem>
                <FormItem class="block-form-item" label="推荐奖励经验" prop="recommendExperience">
                  <i-input type="text" placeholder="推荐奖励经验" v-model="formData.recommendExperience" />
                </FormItem>
                <FormItem class="block-form-item" label="推荐奖励积分" prop="recommendIntegral">
                  <i-input type="text" placeholder="推荐奖励积分" v-model="formData.recommendIntegral" />
                </FormItem>
                <FormItem class="block-form-item" label="推荐奖励金额" prop="recommendMoney">
                  <i-input type="text" placeholder="推荐奖励金额" v-model="formData.recommendMoney" />
                </FormItem>
                <FormItem class="block-form-item" label="送多少经验" prop="sendExperience">
                  <i-input type="text" placeholder="送多少经验" v-model="formData.sendExperience" />
                </FormItem>
                <FormItem class="block-form-item" label="送多少积分" prop="sendIntegral">
                  <i-input type="text" placeholder="送多少积分" v-model="formData.sendIntegral" />
                </FormItem>
                <FormItem class="block-form-item">
                  <table-com :data="formData.priceList"
                             :has-page="false"
                             :config="tableConfig">
                    <template slot="col3"
                              slot-scope="{ item }">
                      <el-table-column :prop="item.prop"
                                       :label="item.label"
                                       :fixed="item.fixed"
                                       :min-width="item.minWidth">
                        <template slot-scope="{ row, $index }">
                          <FormItem :label-width="0"
                                    :prop="'priceList.' + $index + '.discountPrice'"
                                    :rules="discountPriceRule">
                            <i-input type="text" placeholder="折扣价格" v-model="row.discountPrice"></i-input>
                          </FormItem>
                        </template>
                      </el-table-column>
                    </template>
                  </table-com>
                </FormItem>
                <FormItem>
                  <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
                  <i-button @click="cancel">取 消</i-button>
                </FormItem>
              </div>
            </div>
          </i-form>
        </div>
      </div>
    </page-board>
    <couponsCheckModal ref="couponsCheckModal"></couponsCheckModal>
  </div>
</template>

<script>
import { couponsTypeList, vipChargeConfigStatusList } from '../../../assets/enums';
import couponsCheckModal from '../components/couponsCheckModal';
import defaultsDeep from 'lodash/defaultsDeep';
export default {
  components: {
    couponsCheckModal
  },
  data () {
    const validateMoney = (rule, value, callback) => {
      if (!value) callback();
      this.$validator.validateMoney(value).then(() => {
        callback();
      }).catch(err => {
        callback(err);
      });
    };
    return {
      couponsTypeList,
      vipChargeConfigStatusList,
      visible: false,
      isLoading: false,
      type: '',
      item: {},
      formData: {
        priceList: []
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        name: [
          { required: true, message: '请输入等级名称', trigger: 'blur' }
        ],
        sortNo: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ],
        upgradeExperience: [
          { required: true, message: '请输入升级经验', trigger: 'blur' }
        ],
        giveMoney: [
          { required: true, message: '请输入赠送金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        openCardAmount: [
          { required: true, message: '请输入开卡金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        consumptionMoney: [
          { required: true, message: '请输入每消费多少钱', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        giveExperienceMax: [
          { required: true, message: '请输入赠送经验上限', trigger: 'blur' }
        ],
        giveIntegralMax: [
          { required: true, message: '请输入赠送积分上限', trigger: 'blur' }
        ],
        recommendExperience: [
          { required: true, message: '请输入推荐奖励经验', trigger: 'blur' }
        ],
        recommendIntegral: [
          { required: true, message: '请输入推荐奖励积分', trigger: 'blur' }
        ],
        recommendMoney: [
          { required: true, message: '请输入推荐奖励金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        sendExperience: [
          { required: true, message: '请输入送多少经验', trigger: 'blur' }
        ],
        sendIntegral: [
          { required: true, message: '请输入送多少积分', trigger: 'blur' }
        ]
      },
      discountPriceRule: [
        { required: true, message: `请输入折扣价格`, trigger: 'blur' },
        { validator: validateMoney, trigger: 'blur' }
      ],
      tableConfig: [
        {
          prop: 'hotelName',
          label: '酒店名称'
        },
        {
          prop: 'typeName',
          label: '房间类型名称'
        },
        {
          prop: 'originalPrice',
          label: '原始价格'
        },
        {
          prop: 'discountPrice',
          label: '折扣价格'
        }
      ]
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      this.type = type;
      this.item = item;
      Promise.all([
        this.getChargeCoupons(item.id),
        this.getPriceList(type === 'add' ? item.brandId : item.id, type)
      ]).then(([couponsList, priceList]) => {
        this.formData = defaultsDeep({}, {
          ...item,
          couponsList,
          priceList,
          giveMoney: this.$util.toYuan(item.giveMoney),
          openCardAmount: this.$util.toYuan(item.openCardAmount),
          consumptionMoney: this.$util.toYuan(item.consumptionMoney),
          recommendMoney: this.$util.toYuan(item.recommendMoney)
        }, this.formData);

        this.$util.valueToStr(this.formData);
        if (confirmFn) {
          this.confirmFn = confirmFn;
        }

        if (cancelFn) {
          this.cancelFn = cancelFn;
        }
        this.visible = true;
      }).catch(() => {
        this.$message.error('获取数据失败');
        this.reset();
      });
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
        apiKey: this.type === 'add' ? 'vipLevelAdd' : 'vipLevelUpdate',
        loading: false,
        params: {
          ...this.formData,
          giveMoney: this.$util.toCent(this.formData.giveMoney),
          openCardAmount: this.$util.toCent(this.formData.openCardAmount),
          consumptionMoney: this.$util.toCent(this.formData.consumptionMoney),
          recommendMoney: this.$util.toCent(this.formData.recommendMoney),
          couponsList: this.formData.couponsList.map(item => ({
            couponsId: item.id
          })),
          priceList: this.formData.priceList.map(item => ({
            ...item,
            originalPrice: this.$util.toCent(item.originalPrice),
            discountPrice: this.$util.toCent(item.discountPrice)
          }))
        },
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
        priceList: []
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = '';
    },
    checkCoupons () {
      this.$refs.couponsCheckModal.show({
        brandId: this.item.brandId,
        checkedList: this.formData.couponsList,
        confirmFn: (checkedList) => {
          this.formData.couponsList = checkedList;
        },
        cancelFn: () => {}
      });
    },
    delCoupon (item) {
      this.formData.couponsList = this.formData.couponsList.filter(coupon => {
        return coupon.id !== item.id;
      });
    },
    getChargeCoupons (vipLevelId) {
      return new Promise((resolve, reject) => {
        if (this.type === 'add') return resolve([]);
        this.$ajax.get({
          apiKey: 'vipLevelGetCoupons',
          params: {
            vipLevelId
          }
        }).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },
    getPriceList (id, type) {
      const params = type === 'add' ? { brandId: id } : { vipLevelId: id };
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: type === 'add' ? 'vipLevelRoomTypeList' : 'vipLevelPriceList',
          params
        }).then(data => {
          resolve(data.map(item => ({
            ...item,
            originalPrice: this.$util.toYuan(item.originalPrice),
            discountPrice: this.$util.toYuan(item.discountPrice)
          })));
        }).catch(err => {
          reject(err);
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.dialog-wrapper {
  @include flex_layout(row, flex-start, flex-start);
  .form-wrapper {
    width: 60%;

    .form-item-wrapper {
      @include flex_layout(row, space-between, flex-start);

      .form-item-block {
        width: 100%;
        margin-right: 20px;

        &:last-child {
          margin: 0;
        }
      }

      .table-item-block {
        margin-left: 20px;
      }
    }
  }
  .coupon-tag-wrapper {
    @include flex_layout(row, flex-start, center);
    margin-top: 10px;
    .coupon-tag {
      position: relative;
      margin-right: 10px;
      padding: 2px 10px;
      border-radius: 5px;
      border: 1px solid #EFEFEF;

      &:hover {
        .del-icon {
          display: block;
        }
      }
      .del-icon {
        position: absolute;
        display: none;
        width: 15px;
        height: 15px;
        right: -5px;
        top: -5px;
        transition: all .1s;
        cursor: pointer;
      }
    }
  }
}
</style>
