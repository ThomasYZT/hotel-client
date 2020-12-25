<template>
  <div class="modal-wrapper">
    <el-dialog title="增加消费"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="50%"
               custom-class="form-dialog"
               @close="cancel"
               center>
      <div class="dialog-wrapper">
        <div class="info-wrapper">
          <div class="info-content">
            <div class="info-field">
              <div class="field-label">订单编号:</div>
              <div class="field-info">{{orderDetail.code}}</div>
            </div>
            <div class="info-field">
              <div class="field-label">房号:</div>
              <div class="field-info">{{orderDetail.roomNumber}}</div>
            </div>
          </div>
        </div>
        <!-- 订单信息 -->
        <div class="form-wrapper">
          <i-form ref="Form"
                  inline
                  :disabled="isLoading"
                  :model="formData"
                  :label-width="90"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block table-block">
                <i-button type="primary" style="margin-bottom: 10px" size="small" @click="addGood">添加</i-button>
                <table-com class="good-table"
                           :data="formData.consumeRecords"
                           :has-page="false"
                           :config="goodsTableConfig">
                  <template slot="col0"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label">
                      <template slot-scope="{ row, $index }">
                        <FormItem :label-width="0"
                                  :prop="'consumeRecords.' + $index + '.goodsName'">
                          <i-select v-model="row.goodsId"
                                    transfer
                                    placeholder="请选择商品"
                                    @on-change="onGoodChange($event, formIndex,  $index)">
                            <i-option v-for="item in goodsList"
                                      :value="item.id"
                                      :key="item.id">
                              {{ item.name }}
                            </i-option>
                          </i-select>
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col1"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label">
                      <template slot-scope="{ row }">
                        <span>{{row.unitPrice}}</span>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col2"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label">
                      <template slot-scope="{ row, $index }">
                        <FormItem :label-width="0"
                                  :prop="'consumeRecords.' + $index + '.num'">
                          <i-input-number :disabled="row.goodsId === undefined" style="width: 100%;" type="text" placeholder="商品数量" v-model="row.num" />
                        </FormItem>
                      </template>
                    </el-table-column>
                  </template>
                  <template slot="col3"
                            slot-scope="{ item }">
                    <el-table-column :prop="item.prop"
                                     :label="item.label">
                      <template slot-scope="{ row, $index }">
                        <div class="operate-block">
                          <i-button type="error" class="table-btn" size="small" @click="delGood(formIndex, $index)">删除</i-button>
                        </div>
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
        <i-button style="margin-right: 10px" type="primary" @click="confirm">确定</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { genderList, consumeTimeType } from '../../../assets/enums';
import { goodsTableConfig } from './tableConfig';
export default {
  data () {
    return {
      goodsTableConfig,
      genderList,
      visible: false,
      isLoading: false,
      item: {},
      goodsList: [],
      formData: {},
      orderDetail: {},
      confirmFn: null,
      cancelFn: null
    };
  },
  methods: {
    show ({ item, activeRoom, confirmFn, cancelFn }) {
      if (!item || !activeRoom) return;

      Promise.all([
        this.getOrderByRoom(activeRoom.id),
        this.getGoodsList(item.hotelId)
      ]).then(([orderDetail, goodsList]) => {
        this.item = { ...item, userId: 0 };
        this.goodsList = goodsList;
        this.orderDetail = orderDetail;

        if (confirmFn) {
          this.confirmFn = confirmFn;
        }

        if (cancelFn) {
          this.cancelFn = cancelFn;
        }
        this.visible = true;
      }).catch(() => {
        this.reset();
        this.$message.error('获取数据失败');
      });
    },
    addGood () {
      this.formData.consumeRecords.push({});
    },
    delGood (formIndex, index) {
      this.formData.consumeRecords.splice(index, 1);
    },
    onGoodChange (goodId, formIndex, $index) {
      if (goodId === null || goodId === undefined) return;
      Object.assign(this.formData.consumeRecords[$index], this.getGoodParams(goodId));
    },
    getGoodParams (goodId) {
      const goodItem = this.goodsList.find(item => item.id === goodId);
      return {
        goodsId: goodItem.id,
        goodsName: goodItem.name,
        unitPrice: goodItem.unitPrice,
        num: 1,
        orderCode: this.orderDetail.code,
        type: consumeTimeType.after
      };
    },
    getOrderByRoom (roomId) {
      return new Promise((resolve, reject) => {
        this.$ajax.post({
          apiKey: 'orderStayRoom',
          params: {
            roomId
          }
        }).then(res => {
          resolve(res || {});
        }).catch(err => {
          reject(err);
        });
      });
    },
    getGoodsList (hotelId) {
      return new Promise((resolve, reject) => {
        this.$ajax.post({
          apiKey: 'goodPageList',
          params: {
            hotelId,
            pageNum: 1,
            pageSize: 99999
          }
        }).then(data => {
          data = (data.data || []).filter(item => item.status === 1);
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    confirm () {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.addConsume();
        }
      });
    },
    addConsume () {
      this.$ajax.post({
        apiKey: 'consumeAdd',
        params: this.formData,
        config: {
          headers: { 'Content-Type': 'application/json;charset-UTF-8' }
        }
      }).then(res => {
        this.$message.success('增加消费成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`增加消费失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    cancel () {
      this.cancelFn && this.cancelFn();
      this.reset();
    },
    reset () {
      this.$refs.Form.forEach(item => item.resetFields());
      this.item = {};
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
/deep/ .el-dialog__body {
  max-height: 400px;
  overflow-y: auto;
}
.dialog-wrapper {
  padding: 0 20px 0;

  .info-wrapper {
    margin-bottom: 20px;
    .info-header {
      font-size: 18px;
      font-weight: bold;
    }
    .info-content {
      @include flex_layout(row, center, flex-start);
      flex-wrap: wrap;
      .info-field {
        @include flex_layout(row, flex-start, center);
        @include flex_set(1, 0, 50%);
        padding: 5px 5px;
        margin-bottom: 5px;
        font-size: 14px;
        color: #333333;
        .field-label {
          @include flex_set(0, 1, auto);
          margin-right: 20px;
        }
        .field-info {

        }
      }
    }
  }

  .form-wrapper {
    width: 100%;

    .form-item-wrapper {
      .form-item-block {
        @include flex_set(0, 1, auto);
        font-size: 13px;
        color: #333333;

        &:last-child {
          margin: 0;
        }
      }
    }

    .table-block {
      margin-top: 20px;
      height: 200px;

      .good-table {
        height: calc(100% - 34px);
      }
      /deep/ .ivu-form-item {
        width: 100%;
      }
    }
  }
}
</style>
