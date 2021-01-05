<template>
  <table-com :data="tableData"
             :page-num.sync="pageNum"
             :page-size.sync="pageSize"
             :total-size="totalSize"
             :config="consumeRecordTableConfig"
             :getList="getList">
    <template slot="col1"
              slot-scope="{ item }">
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       :fixed="item.fixed"
                       :min-width="item.minWidth">
        <template slot-scope="{ row }">
          <span>{{consumeSourceList.find(item => item.value === row.source) ?
            consumeSourceList.find(item => item.value === row.source).label : ''}}</span>
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
          <span>{{$util.toYuan(row.orderAmount)}}</span>
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
          <span>{{$util.toYuan(row.activityDiscount)}}</span>
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
          <span>{{$util.toYuan(row.cardDiscount)}}</span>
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
          <span>{{$util.toYuan(row.memberDiscount)}}</span>
        </template>
      </el-table-column>
    </template>
    <template slot="col6"
              slot-scope="{ item }">
      <el-table-column :prop="item.prop"
                       :label="item.label"
                       :fixed="item.fixed"
                       :min-width="item.minWidth">
        <template slot-scope="{ row }">
          <span>{{$util.toYuan(row.receiptAmount)}}</span>
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
          <span>{{paymentStatusList.find(item => item.value === row.paymentStatus) ?
            paymentStatusList.find(item => item.value === row.paymentStatus).label : ''}}</span>
        </template>
      </el-table-column>
    </template>
  </table-com>
</template>

<script>
import { consumeSourceList, paymentStatusList } from '../../../../assets/enums/index';
import { consumeRecordTableConfig } from './tableConfig';
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
      paymentStatusList,
      consumeSourceList,
      consumeRecordTableConfig,
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
        apiKey: 'vipInfoConsumeRecord',
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
