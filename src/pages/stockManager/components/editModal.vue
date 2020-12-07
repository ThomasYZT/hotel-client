<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '新增入库' : '编辑入口信息'"
               :visible.sync="visible"
               :close-on-click-modal="false"
               custom-class="form-dialog"
               width="70%"
               center
               @close="cancel">
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :label-width="80"
                  label-position="left">
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
                              :prop="'list.' + $index + '.goodsId'"
                              :rules="goodsIdRule">
                      <i-select v-model="row.goodsId" filterable transfer>
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
                              :prop="'list.' + $index + '.storageCount'"
                              :rules="storageCountRule">
                      <i-input type="text" placeholder="数量" v-model.trim="row.storageCount" @on-change="priceChange(row)" />
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
                              :prop="'list.' + $index + '.unitPrice'"
                              :rules="unitPriceRule">
                      <i-input type="text" placeholder="单价" v-model="row.unitPrice" @on-change="priceChange(row)"></i-input>
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
                      <i-input disabled type="text" placeholder="总价" v-model="row.totalPrice"></i-input>
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
                    <FormItem class="table-form-item"
                              :label-width="0"
                              :prop="'list.' + $index + '.remark'">
                      <i-input type="text" placeholder="描述" v-model="row.remark"></i-input>
                    </FormItem>
                  </template>
                </el-table-column>
              </template>
              <template slot="col5"
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
        list: [{
          goodsId: '',
          storageCount: '',
          unitPrice: '',
          totalPrice: '',
          remark: ''
        }]
      },
      goodsList: [],
      confirmFn: null,
      cancelFn: null,
      goodsIdRule: [
        { required: true, message: '请选择商品', trigger: 'change' }
      ],
      storageCountRule: [
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
          prop: 'goodsId',
          label: '商品'
        },
        {
          prop: 'storageCount',
          label: '数量'
        },
        {
          prop: 'unitPrice',
          label: '单价'
        },
        {
          prop: 'totalPrice',
          label: '总价'
        },
        {
          prop: 'remark',
          label: '描述'
        },
        {
          prop: 'operate',
          label: '操作'
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
        this.$util.removeProp(this.formData, [
          'storageOperator',
          'status',
          'storageOperatorName',
          'storageTime',
          'withdrawOperator',
          'withdrawOperatorName',
          'withdrawTime']);

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
                this.$util.valueToStr(item);
                return item;
              });
            }
            this.visible = true;
          }).catch(() => {
            this.$message.error('获取入库商品信息失败');
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
    priceChange (rowData) {
      rowData.totalPrice = parseFloat((rowData.unitPrice * rowData.storageCount).toFixed(2));
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
          ...this.formData,
          storageOperator: this.userInfo.id
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
        list: [{
          goodsId: '',
          storageCount: '',
          unitPrice: '',
          totalPrice: '',
          remark: ''
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
        goodsId: '',
        storageCount: '',
        unitPrice: '',
        totalPrice: '',
        remark: ''
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
          apiKey: 'stockGetDetail',
          params: {
            storageId
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
  height: 400px;
  .form-wrapper {
    height: 100%;
    width: 100%;

    /deep/ .ivu-form {
      height: 100%;

      .table-wrapper {
        height: calc(100% - 40px);
      }
    }

    .table-form-item {
      margin-bottom: 20px;
    }
  }
}

</style>
