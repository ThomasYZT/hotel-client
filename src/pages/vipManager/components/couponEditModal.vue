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
                <FormItem class="block-form-item" label="图片" prop="attachList">
                  <img-uploader v-model="formData.attachList"></img-uploader>
                </FormItem>
                <FormItem class="block-form-item" label="状态" prop="state">
                  <i-radio-group v-model="formData.state">
                    <i-radio v-for="item in couponStatusList"
                             :key="item.value"
                             :label="item.value">{{item.label}}</i-radio>
                  </i-radio-group>
                </FormItem>
                <FormItem class="block-form-item" label="品牌名称" prop="brandName">
                  <i-input type="text" placeholder="品牌名称" v-model="formData.brandName" />
                </FormItem>
                <FormItem class="inline-form-item" label="卡券颜色" prop="cardColor">
                  <i-input type="text" placeholder="卡券颜色" v-model="formData.cardColor" />
                </FormItem>
                <FormItem class="inline-form-item" label="单人领券数量上限" prop="limitNumber">
                  <i-input type="text" placeholder="单人领券数量上限" v-model="formData.limitNumber" />
                </FormItem>
                <FormItem class="inline-form-item" label="会员等级" prop="levelId">
                  <i-select v-model="formData.levelId"
                            placeholder="请选择">
                    <i-option v-for="item in vipLevelList"
                              :value="item.id"
                              :key="item.id">
                      {{ item.name }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="酒店" prop="levelId">
                  <i-select v-model="formData.hotelList"
                            multiple
                            transfer
                            placeholder="请选择">
                    <i-option v-for="item in hotelList"
                              :value="item.id"
                              :key="item.id">
                      {{ item.name }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="投放数量" prop="castNumber">
                  <i-input type="text" placeholder="投放数量" v-model="formData.castNumber" />
                </FormItem>
                <FormItem class="inline-form-item" label="有效开始时间" prop="startTime">
                  <i-date-picker v-model="formData.startTime"
                                 :editable="false"
                                 transfer
                                 type="date"
                                 format="yyyy-MM-dd"
                                 style="width: 100%;"
                                 placeholder="有效开始时间"></i-date-picker>
                </FormItem>
                <FormItem class="inline-form-item" label="有效结束时间" prop="endTime">
                  <i-date-picker v-model="formData.endTime"
                                 :editable="false"
                                 transfer
                                 type="date"
                                 format="yyyy-MM-dd"
                                 style="width: 100%;"
                                 placeholder="有效结束时间"></i-date-picker>
                </FormItem>
                <FormItem class="inline-form-item" label="优惠券类型" prop="purpose">
                  <i-select v-model="formData.purpose"
                            placeholder="请选择">
                    <i-option v-for="item in couponsTypeList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
                </FormItem>
                <template v-if="formData.purpose === couponsType.moneyOff">
                  <FormItem class="inline-form-item" label="优惠金额(元)" prop="subtractAmount">
                    <i-input type="text" placeholder="优惠金额(元)" v-model="formData.subtractAmount" />
                  </FormItem>
                  <FormItem class="inline-form-item" label="最低消费" prop="fullAmount">
                    <i-input type="text" placeholder="最低消费" v-model="formData.fullAmount" />
                  </FormItem>
                </template>
                <template v-else-if="formData.purpose === couponsType.discount">
                  <FormItem class="inline-form-item" label="折扣" prop="discount">
                    <i-input type="text" placeholder="折扣" v-model="formData.discount" />
                  </FormItem>
                </template>
                <template v-else-if="formData.purpose === couponsType.exchange">
                  <FormItem class="block-form-item" label="兑换内容" prop="exchangeContent">
                    <i-input type="textarea" placeholder="兑换内容" v-model="formData.exchangeContent" />
                  </FormItem>
                </template>
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
import { couponsType, couponsTypeList, couponStatusList } from '../../../assets/enums';
import defaultsDeep from 'lodash/defaultsDeep';
import { mapGetters, mapActions } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
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
      couponsType,
      couponStatusList,
      couponsTypeList,
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        purpose: 0,
        attachList: []
      },
      vipLevelList: [],
      hotelList: [],
      confirmFn: null,
      cancelFn: null,
      formRule: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        exchangeContent: [
          { required: true, message: '请输入兑换内容', trigger: 'blur' }
        ],
        brandName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' }
        ],
        state: [
          { required: true, type: 'number', message: '请选择状态', trigger: 'blur' }
        ],
        cardColor: [
          { required: true, message: '请输入卡券颜色', trigger: 'blur' }
        ],
        subtractAmount: [
          { required: true, message: '请输入优惠金额', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        levelId: [
          { required: true, type: 'number', message: '请选择会员等级', trigger: 'blur' }
        ],
        startTime: [
          { required: true, type: 'date', message: '请输入有效开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, type: 'date', message: '请输入有效结束时间', trigger: 'blur' }
        ],
        castNumber: [
          { required: true, message: '请输入投放数量', trigger: 'blur' }
        ],
        purpose: [
          { required: true, type: 'number', message: '请选择优惠券类型', trigger: 'blur' }
        ],
        limitNumber: [
          { required: true, message: '请输入单人领券数量上限', trigger: 'blur' }
        ],
        fullAmount: [
          { required: true, message: '请输入最低消费', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        discount: [
          { required: true, message: '请输入折扣', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapActions([
      'getAttachInfo'
    ]),
    show ({ type = '', vipLevelList, item, confirmFn, cancelFn }) {
      if (!type || !vipLevelList || (type === 'edit' && !item)) return;
      this.type = type;
      Promise.all([
        this.getAllHotelList(item.brandId),
        this.getHotelInfo(item.id)
      ]).then(([hotelList, hotelInfo]) => {
        this.vipLevelList = vipLevelList;
        this.hotelList = hotelList;
        this.formData = defaultsDeep({}, {
          ...item,
          subtractAmount: this.$util.toYuan(item.subtractAmount),
          fullAmount: this.$util.toYuan(item.fullAmount),
          hotelList: hotelInfo.map(item => item.hotelId)
        }, this.formData);
        this.$util.valueToStr(this.formData, ['state', 'levelId', 'purpose']);
        if (confirmFn) {
          this.confirmFn = confirmFn;
        }

        if (cancelFn) {
          this.cancelFn = cancelFn;
        }

        if (type === 'add' || (type === 'edit' && !item.attachId)) {
          this.visible = true;
        } else {
          this.getAttachInfo(item.attachId).then(data => {
            this.formData.attachList = data;
            this.$nextTick(() => {
              this.visible = true;
            })
          });
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
        apiKey: this.type === 'add' ? 'couponAdd' : 'couponUpdate',
        params: {
          ...this.formData,
          startTime: this.$date(this.formData.startTime).format('YYYY-MM-DD'),
          endTime: this.$date(this.formData.endTime).format('YYYY-MM-DD'),
          subtractAmount: this.$util.toCent(this.formData.subtractAmount),
          fullAmount: this.$util.toCent(this.formData.fullAmount),
          hotelList: this.formData.hotelList.map(id => ({
            hotelId: id
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
      this.formData = {
        purpose: 0,
        attachList: []
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = '';
    },
    getHotelInfo (couponsId) {
      return new Promise((resolve, reject) => {
        if (this.type === 'add') return resolve([]);
        this.$ajax.get({
          apiKey: 'couponGetHotelInfo',
          params: {
            couponsId
          },
          loading: false
        }).then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    },
    getAllHotelList (brandId) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'hotelGetAllList',
          params: {
            brandId
          },
          loading: false
        }).then(data => {
          resolve(data || []);
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
        margin-right: 20px;

        &:last-child {
          margin: 0;
        }
      }
    }
  }
}
</style>
