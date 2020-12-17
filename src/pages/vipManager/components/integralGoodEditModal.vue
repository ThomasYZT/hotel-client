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
                <FormItem class="block-form-item" label="标题" prop="title">
                  <i-input type="text" placeholder="标题" v-model="formData.title" />
                </FormItem>
                <FormItem class="block-form-item" label="商品状态" prop="state">
                  <i-radio-group v-model="formData.state">
                    <i-radio v-for="item in integralGoodStatusList"
                             :key="item.value"
                             :label="item.value">{{item.label}}</i-radio>
                  </i-radio-group>
                </FormItem>
                <FormItem class="inline-form-item" label="优惠券" prop="couponsId">
                  <i-select v-model="formData.couponsId"
                            placeholder="请选择">
                    <i-option v-for="item in couponList"
                              :value="item.id"
                              :key="item.id">
                      {{ item.title }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="block-form-item" label="兑换所需积分" prop="integralNumber">
                  <i-input type="text" placeholder="兑换所需积分" v-model="formData.integralNumber" />
                </FormItem>
                <FormItem class="block-form-item" label="使用条件" prop="conditions">
                  <i-input type="text" placeholder="使用条件" v-model="formData.conditions" />
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
  </div>
</template>

<script>
import { integralGoodStatusList } from '../../../assets/enums/index';
import defaultsDeep from 'lodash/defaultsDeep';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data () {
    return {
      integralGoodStatusList,
      visible: false,
      isLoading: false,
      type: '',
      formData: {},
      couponList: [],
      confirmFn: null,
      cancelFn: null,
      formRule: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        state: [
          { required: true, type: 'number', message: '请选择商品状态', trigger: 'blur' }
        ],
        couponsId: [
          { required: true, type: 'number', message: '请选择优惠券', trigger: 'blur' }
        ],
        integralNumber: [
          { required: true, message: '请选择兑换所需积分', trigger: 'blur' }
        ],
        conditions: [
          { required: true, message: '请输入使用条件', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      this.type = type;
      this.getAllCouponList(item.brandId).then((couponList) => {
        this.couponList = couponList;
        this.formData = defaultsDeep({}, item, this.formData);
        this.$util.valueToStr(this.formData, ['state', 'couponsId']);
        if (confirmFn) {
          this.confirmFn = confirmFn;
        }

        if (cancelFn) {
          this.cancelFn = cancelFn;
        }

        this.visible = true;
      }).catch(() => {
        this.$message.error(`获取数据失败`);
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
        apiKey: this.type === 'add' ? 'integralMallAdd' : 'integralMallUpdate',
        params: {
          ...this.formData
        },
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
      this.formData = {};
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = '';
    },
    getAllCouponList (brandId) {
      return new Promise((resolve, reject) => {
        this.$ajax.post({
          apiKey: 'couponPageList',
          params: {
            brandId,
            pageNum: 1,
            pageSize: 99999
          }
        }).then(data => {
          resolve(data.data || []);
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
}
</style>
