<template>
  <table-com :data="tableData"
             :page-num.sync="pageNum"
             :page-size.sync="pageSize"
             :total-size="totalSize"
             :config="levelRecordTableConfig"
             :getList="getList">
  </table-com>
</template>

<script>
import { levelRecordTableConfig } from './tableConfig';
export default {
  props: {
    vipInfo: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      levelRecordTableConfig,
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
        apiKey: 'vipInfoLeaveRecord',
        params: {
          vipUserId: this.vipInfo.id,
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
