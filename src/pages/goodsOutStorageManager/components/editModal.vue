<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '新增出库' : '编辑出库'"
               :visible.sync="visible"
               :close-on-click-modal="false"
               custom-class="form-dialog"
               width="70%"
               center
               @close="cancel">
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  inline
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="120"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="inline-form-item" label="房号" prop="roomNumber">
                  <i-input type="text" placeholder="房号" v-model.trim="formData.roomNumber" />
                </FormItem>
                <FormItem class="inline-form-item" label="支付方式" prop="methodPayment">
                  <i-select v-model="formData.methodPayment"
                            placeholder="请选择">
                    <i-option v-for="item in payTypeList"
                              :value="item.value"
                              :key="item.value">
                      {{ item.label }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="block-form-item" label="备注" prop="remark">
                  <i-input type="textarea" placeholder="备注" v-model.trim="formData.remark" />
                </FormItem>
              </div>
            </div>
                <i-button type="primary" style="margin-bottom: 10px" @click="addItem">增加</i-button>
                <table-com :data="formData.list"
                          :has-page="false"
                          :config="tableConfig">
                  <template slot="col0"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                    :label="item.label"
                                    :fixed="item.fixed"
                                    :min-width="item.minWidth">
                      <template slot-scope="{ row, $index }">
                        <FormItem class="table-form-item"
                                  :label-width="0"
                                  :prop="'list.' + $index + '.goodId'"
                                  :rules="goodIdRule">
                          <i-select v-model="row.goodId" filterable transfer>
                            <i-option v-for="item in goodsList" :value="String(item.id)" :key="item.id">{{ item.name }}</i-option>
                          </i-select>
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col1"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                    :label="item.label"
                                    :fixed="item.fixed"
                                    :min-width="item.minWidth">
                      <template slot-scope="{ row, $index }">
                        <FormItem class="table-form-item"
                                  :label-width="0"
                                  :prop="'list.' + $index + '.unitPrice'"
                                  :rules="unitPriceRule">
                          <i-input type="text" placeholder="单价" v-model="row.unitPrice" @on-change="priceChange(row)"></i-input>
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col2"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                    :label="item.label"
                                    :fixed="item.fixed"
                                    :min-width="item.minWidth">
                      <template slot-scope="{ row, $index }">
                        <FormItem class="table-form-item"
                                  :label-width="0"
                                  :prop="'list.' + $index + '.number'"
                                  :rules="numberRule">
                          <i-input type="text" placeholder="数量" v-model.trim="row.number" @on-change="priceChange(row)" />
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col3"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                    :label="item.label"
                                    :fixed="item.fixed"
                                    :min-width="item.minWidth">
                      <template slot-scope="{ row, $index }">
                        <FormItem class="table-form-item"
                                  :label-width="0"
                                  :prop="'list.' + $index + '.totalPrice'">
                          <i-input disabled type="text" placeholder="总金额" v-model="row.totalPrice"></i-input>
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col4"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                    :label="item.label"
                                    :fixed="item.fixed"
                                    :min-width="item.minWidth">
                      <template slot-scope="{ row, $index }">
                        <i-button type="error" class="table-btn" style="margin-bottom: 20px" size="small" @click="delItem(row, $index)">删 除</i-button>
                      </template>
                    </el-table-column>
                  </template>
                </table-com>
          </i-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>
    <confirmModal ref="confirmModal"></confirmModal>
  </div>
</template>

<script>
import { payTypeList } from '../../../assets/enums';
import defaultsDeep from 'lodash/defaultsDeep';
import { mapGetters } from 'vuex';
import { all } from 'q';
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
      payTypeList,
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        roomNumber: '',
        methodPayment: '',
        remark: '',
        list: [{
          goodId: '',
          number: '',
          unitPrice: '',
          totalPrice: ''
        }]
      },
      goodsList: [],
      confirmFn: null,
      cancelFn: null,
       formRule: {
        methodPayment: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ]
      },
      goodIdRule: [
        { required: true, message: '请选择商品', trigger: 'change' }
      ],
      numberRule: [
        { required: true, message: '请输入数量', trigger: 'blur' },
        { validator: validateNumber, trigger: 'blur' }
      ],
      unitPriceRule: [
        { required: true, message: '请输入单价', trigger: 'blur' },
        { validator: validateMoney, trigger: 'blur' }
      ],
      totalPriceRule: [
        { required: true, message: '请输入总价', trigger: 'blur' },
        { validator: validateMoney, trigger: 'blur' }
      ],
      tableConfig: [
        {
          prop: 'goodId',
          label: '商品',
          width: '180px'
        },
        {
          prop: 'unitPrice',
          label: '单价',
          width: '100px'
        },
        {
          prop: 'number',
          label: '数量',
          width: '80px'
        },
        {
          prop: 'totalPrice',
          label: '总金额',
          width: '100px'
        },
        {
          prop: 'operate',
          label: '操作',
          width: '80px'
        }
      ]
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

        if (type === 'edit') {
          this.getDetail(item.id).then(data => {
            if (data && data.length > 0) {
              this.formData.list = data.map(item => {
                item.totalPrice = parseInt(item.totalPrice)/100;
                item.unitPrice = parseInt(item.unitPrice)/100;
                this.$util.valueToStr(item);
                return item;
              });
            }
            this.visible = true;
          }).catch(() => {
            this.$message.error('获取出库商品信息失败');
          });
        } else {
          this.visible = true;
        }
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
            pageSize: 1000
          },
          loading: false
        }).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    getPrice (rowData,item) {
      alert(111)
      console.log(item)
      rowData.unitPrice = item.unitPrice;
    },
    priceChange (rowData) {
      rowData.totalPrice = parseFloat((rowData.unitPrice * rowData.number).toFixed(2));
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
        ...this.formData,
        list: this.formData.list.map(item => ({
          ...item,
          unitPrice: this.$util.toCent(item.unitPrice),
          totalPrice: this.$util.toCent(item.totalPrice)
        }))
      };

      this.$ajax.post({
        apiKey: this.type === 'add' ? 'goodsOutStorageAdd' : 'goodsOutStorageUpdate',
        params: formData,
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
        roomNumber: '',
        methodPayment: '',
        remark: '',
        list: [{
          goodId: '',
          number: '',
          unitPrice: '',
          totalPrice: ''
        }]
      };
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = '';
    },
    addItem () {
      this.formData.list.push({
        goodId: '',
        unitPrice: '',
        number: '',
        totalPrice: ''
      });
    },
    delItem (row, index) {
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否确认删除`,
        confirm: () => {
          this.formData.list.splice(index, 1);
        }
      });
    },
    getDetail (storageId) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'goodsOutStorageGetDetail',
          params: {
            outId: storageId
          }
        }).then(data => {
          resolve(data);
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
  @include flex_layout(row, center, flex-start);
  height: 500px;
  .form-wrapper {
    height: 100%;
    width: 100%;

    /deep/ .ivu-form {
      height: 100%;

      .table-wrapper {
        height: 330px;
      }
    }

    .table-form-item {
      margin-bottom: 20px;
    }
  }
}

</style>
