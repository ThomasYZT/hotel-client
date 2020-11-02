<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '新增钟点房规则' : '编辑钟点房规则'"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="50%"
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
                  :label-width="130"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="inline-form-item" label="房间类型" prop="roomTypeId">
                  <i-select v-model="formData.roomTypeId"
                            placeholder="请选择">
                    <i-option v-for="item in roomTypeList"
                              :value="item.id"
                              :key="item.id">
                      {{ item.typeName }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="类型" prop="type">
                  <i-radio-group v-model="formData.type">
                    <i-radio v-for="item in hourRoomChargeTypeList"
                             :key="item.value"
                             :label="item.value">{{item.label}}</i-radio>
                  </i-radio-group>
                </FormItem>
                <FormItem class="inline-form-item" label="缓冲时长" prop="bufferTime">
                  <i-input type="text" placeholder="请输入分钟数" v-model.trim="formData.bufferTime" />
                </FormItem>
                <FormItem class="inline-form-item" label="起步时长" prop="duration">
                  <i-input type="text" placeholder="请输入分钟数" v-model.trim="formData.duration" />
                </FormItem>
                <FormItem class="inline-form-item" label="起步价" prop="initialPrice">
                  <i-input type="text" placeholder="请输入起步价" v-model.trim="formData.initialPrice" />
                </FormItem>
                <FormItem class="inline-form-item" label="加收费用" prop="chargePrice">
                  <i-input type="text" placeholder="请输入加收费用" v-model.trim="formData.chargePrice" />
                </FormItem>
                <FormItem class="inline-form-item" label="加收费最大时长" prop="maxDuration">
                  <i-input type="text" placeholder="请输入分钟数" v-model.trim="formData.maxDuration" />
                </FormItem>
                <FormItem class="inline-form-item" label="加收费时长" prop="perDuration">
                  <i-input type="text" placeholder="请输入分钟数" v-model.trim="formData.perDuration" />
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
import defaultsDeep from 'lodash/defaultsDeep';
import { hourRoomChargeTypeList } from '../../../assets/enums';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data () {
    const isBothNumber = (rule, value, callback) => {
      if (!value) callback();
      if (this.$validator.isMobile(value) || this.$validator.isBothNumber(value)) {
        callback();
      } else {
        callback(new Error('请输入整数'));
      }
    };
    const validateMoney = (rule, value, callback) => {
      if (!value) callback();
      this.$validator.validateMoney(value).then(() => {
        callback();
      }).catch(err => {
        callback(err);
      });
    };
    return {
      hourRoomChargeTypeList,
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        type: 0
      },
      confirmFn: null,
      cancelFn: null,
      roomTypeList: [],
      formRule: {
        roomTypeId: [
          { required: true, type: 'number', message: '请选择房间类型', trigger: 'blur' }
        ],
        type: [
          { required: true, type: 'number', message: '请选择类型', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '请输入起步时长', trigger: 'blur' },
          { validator: isBothNumber, trigger: 'blur' }
        ],
        initialPrice: [
          { required: true, message: '请输入起步价', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        bufferTime: [
          { required: true, message: '请输入缓冲时长', trigger: 'blur' },
          { validator: isBothNumber, trigger: 'blur' }
        ],
        chargePrice: [
          { required: true, message: '请输入加收费用', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        maxDuration: [
          { required: true, message: '请输入加收费最大时长', trigger: 'blur' },
          { validator: isBothNumber, trigger: 'blur' }
        ],
        perDuration: [
          { required: true, message: '请输入加收费时长', trigger: 'blur' },
          { validator: isBothNumber, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || !item) return;
      this.formData = defaultsDeep({}, item, this.formData);
      if (type === 'edit') {
        this.formData.initialPrice = parseFloat((this.formData.initialPrice / 100).toFixed(2));
        this.formData.chargePrice = parseFloat((this.formData.chargePrice / 100).toFixed(2));
      }
      this.$util.valueToStr(this.formData, ['type', 'roomTypeId']);

      this.type = type;
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }

      this.getAllRoomType(item.hotelId).then(data => {
        this.roomTypeList = data;
        this.visible = true;
      }).catch(() => {
        this.reset();
        this.$message.error('获取房间类型失败');
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
        apiKey: this.type === 'add' ? 'hoursRoomRuleAdd' : 'hoursRoomRuleUpdate',
        params: {
          ...this.formData,
          initialPrice: Number(this.formData.initialPrice) * 100,
          chargePrice: Number(this.formData.chargePrice) * 100
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
    getAllRoomType (hotelId) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'roomTypeGetAllList',
          params: {
            hotelId
          },
          loading: false
        }).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        type: 0
      };
      this.roomTypeList = [];
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = 'add';
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
