<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加活动促销' : '编辑活动促销'"
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
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="120"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="block-form-item" label="活动名称" prop="name">
                  <i-input type="text" placeholder="活动名称" v-model.trim="formData.name" />
                </FormItem>
                <FormItem class="inline-form-item" label="活动开始时间" prop="startTime">
                  <i-date-picker v-model="formData.startTime"
                                 :editable="false"
                                 transfer
                                 type="date"
                                 format="yyyy-MM-dd"
                                 style="width: 100%;"
                                 placeholder="活动开始时间"></i-date-picker>
                </FormItem>
                <FormItem class="inline-form-item" label="活动结束时间" prop="endTime">
                  <i-date-picker v-model="formData.endTime"
                                 :editable="false"
                                 transfer
                                 type="date"
                                 format="yyyy-MM-dd"
                                 style="width: 100%;"
                                 placeholder="活动结束时间"></i-date-picker>
                </FormItem>
                <FormItem class="block-form-item" label="备注" prop="remark">
                  <i-input type="textarea" placeholder="备注" v-model.trim="formData.remark" />
                </FormItem>
              </div>
              <div class="form-item-block">
                <table-com :data="formData.priceList"
                           :has-page="false"
                           :config="tableConfig">
                  <template slot="col1"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label"
                                     :fixed="item.fixed"
                                     :min-width="item.minWidth">
                      <template slot-scope="{ row }">
                        <span>{{$util.toYuan(row.originalPrice)}}</span>
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
                        <FormItem :label-width="0"
                                  :prop="'priceList.' + $index + '.discountPrice'"
                                  :rules="discountPriceRule">
                          <i-input type="text" placeholder="活动价格" v-model="row.discountPrice"></i-input>
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                </table-com>
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
import { mapActions } from 'vuex';
export default {
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
      visible: false,
      isLoading: false,
      type: '',
      formData: {
        name: '',
        startTime: '',
        endTime: '',
        remark: '',
        priceList: []
      },
      confirmFn: null,
      cancelFn: null,
      formRule: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        startTime: [
          { required: true, type: 'date', message: '请输入活动开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, type: 'date', message: '请输入活动结束时间', trigger: 'blur' }
        ]
      },
      discountPriceRule: [
        { required: true, message: `请输入活动价格`, trigger: 'blur' },
        { validator: validateMoney, trigger: 'blur' }
      ],
      tableConfig: [
        {
          prop: 'typeName',
          label: '房间类型名称'
        },
        {
          prop: 'originalPrice',
          label: '价格'
        },
        {
          prop: 'discountPrice',
          label: '活动价格'
        }
      ]
    };
  },
  methods: {
    show ({ type = '', item, confirmFn, cancelFn }) {
      if (!type || !item) return;
      this.type = type;
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }
      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.formData = defaultsDeep({}, item, this.formData);
      if (type === 'add') {
        this.getAllRoomType(item).then((data) => {
          this.formData.priceList = data.map(item => {
            return {
              ...item,
              originalPrice: item.price,
              discountPrice: this.$util.toYuan(item.price)
            };
          });
          this.visible = true;
        }).catch(err => {
          this.$message.error(`获取所有房间类型失败${err.msg ? ': ' + err.msg : ''}`);
          this.reset();
        });
      } else {
        this.getByPromotionalId(item).then(data => {
          this.formData.priceList = data.map(item => {
            return {
              ...item,
              id: item.roomTypeId,
              originalPrice: item.originalPrice,
              discountPrice: this.$util.toYuan(item.discountPrice)
            };
          });
          this.visible = true;
        }).catch(() => {
          this.$message.error('获取活动价格失败');
          this.reset();
        });
      }
    },
    getAllRoomType (item) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'roomTypeGetAllList',
          params: {
            hotelId: item.hotelId
          }
        }).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    getByPromotionalId (item) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'promotionalPriceGet',
          params: {
            promotionalId: item.id
          }
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
      const formData = {
        ...this.formData,
        startTime: this.$date(this.formData.startTime).format('YYYY-MM-DD'),
         endTime: this.$date(this.formData.endTime).format('YYYY-MM-DD'),
        priceList: this.formData.priceList.map(item => ({
          ...item,
          roomTypeId: item.id,
          originalPrice: item.originalPrice,
          discountPrice: this.$util.toCent(item.discountPrice)
        }))
      };
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'promotionalAdd' : 'promotionalUpdate',
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
        name: '',
        startTime: '',
        endTime: '',
        remark: '',
        priceList: []
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
        max-height: 400px;
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
