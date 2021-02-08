<template>
  <div class="modal-wrapper">
    <el-dialog title="高级查询"
               :visible.sync="visible"
               width="50%"
               custom-class="form-dialog"
               @close="cancel"
               :close-on-click-modal="false"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  inline
                  :model="formData"
                  :label-width="120"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="inline-form-item" label="房单号" prop="code">
                  <i-input type="text" placeholder="房单号" v-model.trim="formData.code" />
                </FormItem>
                <FormItem class="inline-form-item" label="房号" prop="roomNumber">
                  <i-input type="text" placeholder="房号" v-model.trim="formData.roomNumber" />
                </FormItem>
                <FormItem class="inline-form-item" label="房间类型" prop="roomType">
                  <i-select v-model="formData.roomType" clearable
                            placeholder="请选择">
                    <i-option v-for="item in roomTypeList"
                              :value="item.id"
                              :key="item.id">
                      {{ item.typeName }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="价格" prop="price">
                  <i-input type="text" placeholder="价格" v-model.trim="formData.price" />
                </FormItem>
                <FormItem class="inline-form-item" label="预定人" prop="customer">
                  <i-input type="text" placeholder="预定人" v-model.trim="formData.customer" />
                </FormItem>
                <FormItem class="inline-form-item" label="预定人手机" prop="mobile">
                  <i-input type="text" placeholder="预定人手机" v-model.trim="formData.mobile" />
                </FormItem>
                <FormItem class="inline-form-item" label="入住人" prop="name">
                  <i-input type="text" placeholder="入住人" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="inline-form-item" label="入住人手机" prop="phone">
                  <i-input type="text" placeholder="入住人手机" v-model.trim="formData.phone" />
                </FormItem>
                <FormItem class="inline-form-item" label="来源" prop="orderType">
                  <i-select v-model="formData.orderType" clearable
                            placeholder="请选择来源">
                    <i-option v-for="item in orderTypeList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="block-form-item" label="入住日期" prop="stayDate">
                  <i-date-picker type="daterange" split-panels placeholder="入住日期" v-model="stayDate" @on-change="stayDateChange"></i-date-picker>
                </FormItem>
                <FormItem class="block-form-item" label="离店日期" prop="latestTfDate">
                  <i-date-picker type="daterange" split-panels placeholder="离店日期" v-model="latestTfDate" @on-change="latestTfDateChange"></i-date-picker>
                </FormItem>
              </div>
            </div>
          </i-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button style="margin-right: 10px" type="primary" @click="confirm">查 询</i-button>
        <i-button style="margin-right: 10px" @click="reset">重 置</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultsDeep from 'lodash/defaultsDeep';
import { orderTypeList } from '../../../assets/enums';
export default {
  data () {
    return {
      orderTypeList,
      latestTfDate: '',
      stayDate: '',
      visible: false,
      formData: {
        code: '',
        roomNumber: '',
        roomType: '',
        price: '',
        customer: '',
        mobile: '',
        name: '',
        phone: '',
        orderType: '',
        stayStartTime: '',
        stayEndTime: '',
        latestTfStartTime: '',
        latestTfEndTime: ''
      },
      hotelId: '',
      roomTypeList: [],
      confirmFn: null,
      cancelFn: null
    };
  },
  methods: {
    show ({ hotelId,confirmFn, cancelFn }) {
        this.hotelId = hotelId;

      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.visible = true;
      this.getAllRoomType();
    },
    cancel () {
      this.cancelFn && this.cancelFn();
      this.visible = false;
    },
    confirm () {
      this.$emit('handleGetHighSearch', this.formData) // 赋值给 主页
      this.cancelFn && this.cancelFn();
      this.visible = false;
    },
    stayDateChange (val) {
      this.formData.stayStartTime = val[0] || '';
      this.formData.stayEndTime = val[1] || '';
    },
    latestTfDateChange (val) {
      this.formData.latestTfStartTime = val[0] || '';
      this.formData.latestTfEndTime = val[1] || '';
    },
    getAllRoomType () {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'roomTypeGetAllList',
          params: {
            hotelId: this.hotelId
          },
          loading: false
        }).then(data => {
          this.roomTypeList = data;
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.latestTfDate = '';
      this.stayDate = '';
      this.formData = {
        code: '',
        roomNumber: '',
        roomType: '',
        price: '',
        customer: '',
        mobile: '',
        name: '',
        phone: '',
        orderType: '',
        stayStartTime: '',
        stayEndTime: '',
        latestTfStartTime: '',
        latestTfEndTime: ''
      };
      this.confirmFn = null;
      this.cancelFn = null;
      // this.visible = false;
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
        max-height: 450px;
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
}

</style>
