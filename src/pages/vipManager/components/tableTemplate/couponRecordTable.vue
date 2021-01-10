<template>
  <table-com :data="tableData"
             :page-num.sync="pageNum"
             :page-size.sync="pageSize"
             :total-size="totalSize"
             :config="couponRecordTableConfig"
             :getList="getList">
    <template slot="col0"
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
    <template slot="col7"
              slot-scope="{ item }">
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       :fixed="item.fixed"
                       :min-width="item.minWidth">
        <template slot-scope="{ row }">
          <span>{{couponExpireStatusList.find(item => item.value === row.state) ?
            couponExpireStatusList.find(item => item.value === row.state).label : ''}}</span>
        </template>
      </el-table-column>
    </template>
  </table-com>
</template>

<script>
import { couponsTypeList, couponExpireStatusList } from '../../../../assets/enums/index';
import { couponRecordTableConfig } from './tableConfig';
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
      couponsTypeList,
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
