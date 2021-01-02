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
                <FormItem class="block-form-item" label="充值金额" prop="topUpMoney">
                  <i-input type="text" placeholder="充值金额" v-model="formData.topUpMoney" />
                </FormItem>
                <FormItem class="block-form-item" label="赠送金额" prop="giveMoney">
                  <i-input type="text" placeholder="赠送金额" v-model="formData.giveMoney" />
                </FormItem>
                <FormItem class="block-form-item" label="赠送积分" prop="giveIntegral">
                  <i-input type="text" placeholder="赠送积分" v-model="formData.giveIntegral" />
                </FormItem>
                <FormItem class="block-form-item" label="赠送经验" prop="giveExperience">
                  <i-input type="text" placeholder="赠送经验" v-model="formData.giveExperience" />
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
                <FormItem class="block-form-item" label="状态" prop="status">
                  <i-radio-group v-model="formData.status">
                    <i-radio v-for="item in vipChargeConfigStatusList"
                             :key="item.value"
                             :label="item.value">{{item.label}}</i-radio>
                  </i-radio-group>
                </FormItem>
                <FormItem class="block-form-item" label="备注" prop="remark">
                  <i-input type="textarea" placeholder="备注" v-model="formData.remark" />
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
      formData: {},
      vipLevelList: [],
      confirmFn: null,
      cancelFn: null,
      formRule: {
        giveIntegral: [
          { required: true, message: '请输入赠送积分', trigger: 'blur' }
        ],
        giveExperience: [
          { required: true, message: '请输入赠送经验', trigger: 'blur' }
        ],
        giveMoney: [
          { required: true, message: '请输入赠送金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        topUpMoney: [
          { required: true, message: '请输入充值金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        status: [
          { required: true, type: 'number', message: '请选择状态', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', vipLevelList, item, confirmFn, cancelFn }) {
      if (!type || !vipLevelList || (type === 'edit' && !item)) return;
      this.type = type;
      this.item = item;
      this.getChargeCoupons(item.id).then(couponsList => {
        this.vipLevelList = vipLevelList;
        this.formData = defaultsDeep({}, {
          ...item,
          giveMoney: this.$util.toYuan(item.giveMoney),
          topUpMoney: this.$util.toYuan(item.topUpMoney),
          couponsList
        }, this.formData);
        this.$util.valueToStr(this.formData, ['status']);
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
        apiKey: this.type === 'add' ? 'vipChargeAdd' : 'vipChargeUpdate',
        params: {
          ...this.formData,
          giveMoney: this.$util.toCent(this.formData.giveMoney),
          topUpMoney: this.$util.toCent(this.formData.topUpMoney),
          couponsList: this.formData.couponsList.map(item => ({
            couponsId: item.id
          }))
        },
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
      this.formData = {};
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
    getChargeCoupons (vipTopUpId) {
      return new Promise((resolve, reject) => {
        if (this.type === 'add') return resolve([]);
        this.$ajax.get({
          apiKey: 'vipChargeGetCoupons',
          params: {
            vipTopUpId
          }
        }).then(res => {
          resolve(res);
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
