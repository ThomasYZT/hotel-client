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
                  :label-width="120"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="block-form-item" label="酒店名称" prop="name">
                  <i-input type="text" placeholder="酒店名称" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="inline-form-item" label="预定房间电话" prop="reservePhone">
                  <i-input type="text" placeholder="预定房间电话" v-model.trim="formData.reservePhone" />
                </FormItem>
                <FormItem class="inline-form-item" label="酒店电话" prop="hotelPhone">
                  <i-input type="text" placeholder="酒店电话" v-model.trim="formData.hotelPhone" />
                </FormItem>
                <FormItem class="inline-form-item" label="联系人名称" prop="contactName">
                  <i-input type="text" placeholder="联系人名称" v-model.trim="formData.contactName" />
                </FormItem>
                <FormItem class="inline-form-item" label="联系电话" prop="mobilePhone">
                  <i-input type="text" placeholder="联系电话" v-model.trim="formData.mobilePhone" />
                </FormItem>
                <FormItem class="inline-form-item" label="房间数量" prop="roomCount">
                  <i-input type="text" placeholder="房间数量" v-model.trim="formData.roomCount" />
                </FormItem>
                <FormItem class="inline-form-item" label="开业年份" prop="openYear">
                  <i-input type="text" placeholder="开业年份" v-model.trim="formData.openYear" />
                </FormItem>
                <FormItem class="block-form-item" label="图片" prop="attachList">
                  <img-uploader v-model="formData.attachList"></img-uploader>
                </FormItem>
                <FormItem class="block-form-item" label="酒店标签" prop="labelList">
                  <i-button type="primary" @click="checkLabel">选择酒店标签</i-button>
                  <div class="coupon-tag-wrapper">
                    <div class="coupon-tag"
                         v-for="item in formData.labelList" :key="item.id">
                      <img class="del-icon"  alt=""
                           src="../../../assets/img/delete.png"
                           @click.stop="delLabel(item)">
                      {{item.labelName}}
                    </div>
                  </div>
                </FormItem>
                <FormItem class="inline-form-item" label="X坐标" prop="baiduX">
                  <i-input type="text" placeholder="X坐标" v-model.trim="formData.baiduX" />
                </FormItem>
                <FormItem class="inline-form-item" label="Y坐标" prop="baiduY">
                  <i-input type="text" placeholder="Y坐标" v-model.trim="formData.baiduY" />
                </FormItem>
                <FormItem class="block-form-item" label="位置搜索">
                  <div class="map-wrapper">
                    <place-search @change="positionChange"></place-search>
                  </div>
                </FormItem>
                <FormItem class="block-form-item" label="酒店地址" prop="address">
                  <i-input type="text" placeholder="酒店地址" v-model.trim="formData.address" />
                </FormItem>
                <FormItem class="block-form-item" label="酒店简介" prop="introduce">
                  <i-input type="textarea" placeholder="酒店简介" v-model.trim="formData.introduce" />
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
    <labelCheckModel ref="labelCheckModel"></labelCheckModel>
  </div>
</template>

<script>
import PlaceSearch from '../../../components/PlaceSearch';
import defaultsDeep from 'lodash/defaultsDeep';
import { mapActions } from 'vuex';
import labelCheckModel from '../components/labelCheckModel';
export default {
  components: {
    PlaceSearch,
    labelCheckModel
  },
  data () {
    const validateNumber = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isNumber(value)) {
        callback();
      } else {
        callback(new Error('请输入数字'));
      }
    };

    const validatePhoneNum = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isMobile(value) || this.$validator.isTelephone(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的联系电话'));
      }
    };
    return {
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        name: '',
        hotelPhone: '',
        reservePhone: '',
        contactName: '',
        mobilePhone: '',
        address: '',
        roomCount: '',
        openYear: '',
        introduce: '',
        baiduX: '0',
        baiduY: '0',
        attachList: [],
        labelList: []
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        name: [
          { required: true, message: '请输入酒店名称', trigger: 'blur' }
        ],
        hotelPhone: [
          { required: true, message: '请输入酒店电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        reservePhone: [
          { required: true, message: '请输入房间预定电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入酒店地址', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '请输入联系人名称', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhoneNum, trigger: 'blur' }
        ],
        roomCount: [
          { validator: validateNumber, trigger: 'blur' }
        ],
        openYear: [
          { validator: validateNumber, trigger: 'blur' }
        ],
        baiduX: [
          { required: true, message: '请输入X坐标', trigger: 'blur' }
        ],
        baiduY: [
          { required: true, message: '请输入Y坐标', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapActions([
      'getAttachInfo'
    ]),
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || (type === 'edit' && !item)) return;
      // this.formData = defaultsDeep({}, item, this.formData);
      // this.$util.valueToStr(this.formData);
      this.type = type;
      this.getHotelLabel(item.id).then(labelList => {
        this.formData = defaultsDeep({}, {
          ...item,
          labelList
        }, this.formData);
        this.$util.valueToStr(this.formData);

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
            this.visible = true;
          });
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
      const formData = {
        ...this.formData
      };
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'hotelAdd' : 'hotelUpdate',
        params: {
          ...this.formData,
          labelList: this.formData.labelList.map(item => ({
            labelId: item.id
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
    positionChange ({ x, y }) {
      this.formData.baiduX = x;
      this.formData.baiduY = y;
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
        introduce: '',
        baiduX: '',
        baiduY: '',
        attachList: []
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = '';
    },
    checkLabel () {
      this.$refs.labelCheckModel.show({
        checkedList: this.formData.labelList,
        confirmFn: (checkedList) => {
          this.formData.labelList = checkedList;
        },
        cancelFn: () => {}
      });
    },
    delLabel (item) {
      this.formData.labelList = this.formData.labelList.filter(coupon => {
        return coupon.id !== item.id;
      });
    },
    getHotelLabel (hotelId) {
      return new Promise((resolve, reject) => {
        if (this.type === 'add') return resolve([]);
        this.$ajax.get({
          apiKey: 'hotelGetByhotelLabel',
          params: {
            hotelId
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

  .map-wrapper {
    height: 300px;
    width: 80%;
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
