<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '新增入库' : '编辑入口信息'"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="40%"
               center
               @close="cancel">
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="80"
                  label-position="left">
            <div class="form-item-wrapper">
              <FormItem label="商品" prop="goodsId">
                <i-select v-model="formData.goodsId">
                  <i-option v-for="item in goodsList" :value="String(item.id)" :key="item.id">{{ item.name }}</i-option>
                </i-select>
              </FormItem>
              <FormItem label="数量" prop="storageCount">
                <i-input type="text" placeholder="数量" v-model.trim="formData.storageCount" />
              </FormItem>
              <FormItem label="单价" prop="unitPrice">
                <i-input type="text" placeholder="单价" v-model.trim="formData.unitPrice" />
              </FormItem>
              <FormItem label="总价" prop="totalPrice">
                <i-input type="text" placeholder="总价" v-model.trim="formData.totalPrice" />
              </FormItem>
              <FormItem label="描述" prop="remark">
                <i-input type="text" placeholder="描述" v-model.trim="formData.remark" />
              </FormItem>
            </div>
          </i-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button class="dialog-cancel-btn" @click="cancel">取 消</i-button>
        <i-button class="dialog-confirm-btn" type="primary" @click="confirm">确 定</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultsDeep from 'lodash/defaultsDeep';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
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

    const validateMoney = (rule, value, callback) => {
      if (!value) callback();
      this.$validator.validateMoney(value).then(() => {
        callback();
      }).catch(err => {
        callback(err);
      });
    };
    return {
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        goodsId: '',
        storageCount: '',
        unitPrice: '',
        totalPrice: '',
        remark: ''
      },
      goodsList: [],
      confirmFn: null,
      cancelFn: null,
      formRule: {
        goodsId: [
          { required: true, message: '请选择商品', trigger: 'blur' }
        ],
        storageCount: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '请输入单价', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ],
        totalPrice: [
          { required: true, message: '请输入总价', trigger: 'blur' },
          { validator: validateMoney, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || !item) return;

      this.getGoodsList(item).then(data => {
        this.goodsList = data.data || [];
        this.formData = defaultsDeep({}, item, this.formData);
        this.$util.valueToStr(this.formData);

        if (confirmFn) {
          this.confirmFn = confirmFn;
        }

        if (cancelFn) {
          this.cancelFn = cancelFn;
        }
        this.type = type;
        this.visible = true;
      }).catch(err => {
        this.$message.error(`获取商品列表失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    getGoodsList (item) {
      return new Promise((resolve, reject) => {
        this.$ajax.post({
          apiKey: 'goodPageList',
          params: {
            hotelId: item.hotelId,
            pageNum: 1,
            pageSize: 100000
          },
          loading: false
        }).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
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
        apiKey: this.type === 'add' ? 'stockAdd' : 'stockUpdate',
        params: {
          hotelId: this.formData.hotelId,
          storageOperator: this.userInfo.id,
          list: [this.formData]
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
        goodsId: '',
        storageCount: '',
        unitPrice: '',
        totalPrice: '',
        remark: ''
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = '';
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.dialog-wrapper {
  @include flex_layout(row, center, center);
  .form-wrapper {
    width: 70%;
  }
}

</style>
