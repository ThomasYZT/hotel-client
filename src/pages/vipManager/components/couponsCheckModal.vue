<template>
  <div class="modal-wrapper">
    <el-dialog title="选择优惠券"
               :visible.sync="visible"
               :close-on-click-modal="false"
               custom-class="form-dialog"
               width="70%"
               center
               @close="cancel">
      <div class="dialog-wrapper">
        <div class="data-box">
          <div class="operation-wrapper flex-box">
            <div class="filter-block right-box">
              <div class="filter-item">
                <div class="filter-label">优惠券类型：</div>
                <i-select v-model="filterParams.purpose" style="width: 100%;" @on-clear="getList">
                  <i-option v-for="item in couponsTypeList"
                            :value="item.value"
                            :key="item.value">
                    {{ item.label }}
                  </i-option>
                </i-select>
              </div>
              <div class="filter-item">
                <div class="filter-label">标题：</div>
                <i-input v-model="filterParams.title" placeholder="标题" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <i-button class="short-width-btn" shape="circle" type="primary" @click="getList">查询</i-button>
            </div>
          </div>
          <table-com ref="Table"
                     :data="tableData"
                     :has-page="false"
                     :config="couponCheckTableConfig"
                     :getList="getList"
                     @selectChange="onSelectChange">
            <template slot="col0"
                      slot-scope="{ item }">
              <el-table-column type="selection"
                               :min-width="item.minWidth">
              </el-table-column>
            </template>
            <template slot="col2"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{couponsTypeList.find(item => item.value === row.purpose) ?
                    couponsTypeList.find(item => item.value === row.purpose).label : ''}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col3"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{$util.toYuan(row.fullAmount)}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col4"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{$util.toYuan(row.subtractAmount)}}</span>
                </template>
              </el-table-column>
            </template>
          </table-com>
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
import { couponsTypeList } from '../../../assets/enums';
import { couponCheckTableConfig } from './tableConfig';
export default {
  data () {
    return {
      couponsTypeList,
      couponCheckTableConfig,
      tableData: [],
      checkedList: [],
      brandId: '',
      filterParams: {
        purpose: '',
        title: ''
      },
      visible: false,
      confirmFn: null,
      cancelFn: null
    };
  },
  methods: {
    show ({ brandId, checkedList = [], confirmFn, cancelFn }) {
      if (brandId === undefined || brandId === null) return;
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.brandId = brandId;
      this.checkedList = checkedList;
      this.visible = true;
      this.getList();
    },
    cancel () {
      this.cancelFn && this.cancelFn();
      this.reset();
    },
    confirm () {
      this.confirmFn && this.confirmFn(this.checkedList);
      this.reset();
    },
    reset () {
      this.tableData = [];
      this.brandId = '';
      this.filterParams = {
        purpose: '',
        title: ''
      };
      this.visible = false;
      this.confirmFn = null;
      this.cancelFn = null;
    },
    getList () {
      this.$ajax.post({
        apiKey: 'couponPageList',
        params: {
          brandId: this.brandId,
          pageNum: 1,
          pageSize: 99999,
          ...this.filterParams
        }
      }).then(data => {
        this.tableData = data.data || [];
        this.totalSize = data.totalSize || 0;
        this.$refs.Table.toggleRowSelections(this.tableData.filter(row => {
          return !!this.checkedList.find(checked => checked.id === row.id);
        }));
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    onSelectChange (selection) {
      selection.forEach(item => {
        if (!this.checkedList.find(checked => checked.id === item.id)) {
          this.checkedList.push(item);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.dialog-wrapper {
  height: 400px;

  /deep/ .table-wrapper{
    height: calc(100% - 40px);
  }
}
</style>
