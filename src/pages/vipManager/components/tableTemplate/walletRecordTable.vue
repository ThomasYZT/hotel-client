<template>
  <table-com :data="tableData"
             :page-num.sync="pageNum"
             :page-size.sync="pageSize"
             :total-size="totalSize"
             :config="walletRecordTableConfig"
             :getList="getList">
    <template slot="col1"
              slot-scope="{ item }">
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       :fixed="item.fixed"
                       :min-width="item.minWidth">
        <template slot-scope="{ row }">
          <span>{{recordTypeList.find(item => item.value === row.type) ?
            recordTypeList.find(item => item.value === row.type).label : ''}}</span>
        </template>
      </el-table-column>
    </template>
    <template slot="col2"
              slot-scope="{ item }">
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       :fixed="item.fixed"
                       :min-width="item.minWidth">
        <template slot-scope="{ row }">
          <span>{{walletSourceList.find(item => item.value === row.source) ?
            walletSourceList.find(item => item.value === row.source).label : ''}}</span>
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
          <span>{{$util.toYuan(row.orderAmount)}}</span>
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
          <span>{{$util.toYuan(row.activityDiscount)}}</span>
        </template>
      </el-table-column>
    </template>
    <template slot="col5"
              slot-scope="{ item }">
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       :fixed="item.fixed"
                       :min-width="item.minWidth">
        <template slot-scope="{ row }">
          <span>{{$util.toYuan(row.cardDiscount)}}</span>
        </template>
      </el-table-column>
    </template>
  </table-com>
</template>

<script>
import { recordTypeList, walletSourceList } from '../../../../assets/enums/index';
import { walletRecordTableConfig } from './tableConfig';
export default {
  data () {
    return {
      walletSourceList,
      recordTypeList,
      walletRecordTableConfig,
      tableData: [],
      vipLevelList: [],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {}
    };
  },
  methods: {
    getList () {
      this.$ajax.post({
        apiKey: 'vipInfoWalletRecord',
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          ...this.filterParams
        }
      }).then(data => {
        this.tableData = data.data || [];
        this.totalSize = data.totalSize || 0;
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .table-wrapper {
  height: 500px;
}
</style>
