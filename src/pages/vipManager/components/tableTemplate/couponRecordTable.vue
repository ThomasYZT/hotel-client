<template>
  <table-com :data="tableData"
             :page-num.sync="pageNum"
             :page-size.sync="pageSize"
             :total-size="totalSize"
             :config="couponRecordTableConfig"
             :getList="getList">
    <template slot="col2"
              slot-scope="{ item }">
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       :fixed="item.fixed"
                       :min-width="item.minWidth">
        <template slot-scope="{ row }">
          <span>{{couponExpireStatusList.find(item => item.value === row.source) ?
            couponExpireStatusList.find(item => item.value === row.source).label : ''}}</span>
        </template>
      </el-table-column>
    </template>
  </table-com>
</template>

<script>
import { couponExpireStatusList } from '../../../../assets/enums/index';
import { couponRecordTableConfig } from './tableConfig';
export default {
  data () {
    return {
      couponExpireStatusList,
      couponRecordTableConfig,
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
      this.$ajax.get({
        apiKey: 'vipInfoCouponsRecord',
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
.table-wrapper {
  height: 400px;
}
</style>
