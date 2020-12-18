<template>
  <table-com :data="tableData"
             :page-num.sync="pageNum"
             :page-size.sync="pageSize"
             :total-size="totalSize"
             :config="experienceRecordTableConfig"
             :getList="getList">
    <template slot="col0"
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
    <template slot="col1"
              slot-scope="{ item }">
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       :fixed="item.fixed"
                       :min-width="item.minWidth">
        <template slot-scope="{ row }">
          <span>{{expSourceList.find(item => item.value === row.source) ?
            expSourceList.find(item => item.value === row.source).label : ''}}</span>
        </template>
      </el-table-column>
    </template>
  </table-com>
</template>

<script>
import { recordTypeList, expSourceList } from '../../../../assets/enums/index';
import { experienceRecordTableConfig } from './tableConfig';
export default {
  data () {
    return {
      expSourceList,
      recordTypeList,
      experienceRecordTableConfig,
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
        apiKey: 'vipInfoExperienceRecord',
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
