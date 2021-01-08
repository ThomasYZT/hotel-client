<template>
  <div style="height: 100%">
    <div class="operation-wrapper flex-box">
      <div class="filter-block right-box">
        <div class="filter-item">
          <div class="filter-label">时间范围：</div>
          <i-date-picker v-model="dateRange"
                         transfer
                         type="daterange"
                         placement="bottom-end"
                         placeholder="请选择时间范围"
                         style="width: 250px"/>
        </div>
        <i-button type="primary" @click="getList">查询</i-button>
      </div>
    </div>
    <table-com :data="tableData"
               :page-num.sync="pageNum"
               :page-size.sync="pageSize"
               :total-size="totalSize"
               :config="rechargeRecordTableConfig"
               :getList="getList">
      <template slot="col4"
                slot-scope="{ item }">
        <el-table-column :prop="item.prop"
                         :label="item.label"
                         :fixed="item.fixed"
                         :min-width="item.minWidth">
          <template slot-scope="{ row }">
            <span>{{$util.toYuan(row.baseAmount)}}</span>
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
            <span>{{$util.toYuan(row.giveAmount)}}</span>
          </template>
        </el-table-column>
      </template>
    </table-com>
  </div>
</template>

<script>
import { rechargeRecordTableConfig } from './tableConfig';
import { mapGetters } from 'vuex';
import { userType } from '../../../../assets/enums/index';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    typeId () {
      switch (this.userInfo.type) {
        case userType.agent:
          return this.userInfo.agentId;
        case userType.brand:
          return this.userInfo.brandId;
        case userType.hotel:
          return this.userInfo.hotelId;
        default:
          return '';
      }
    }
  },
  data () {
    return {
      rechargeRecordTableConfig,
      tableData: [],
      vipLevelList: [],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {},
      dateRange: [new Date(this.$date().add(-7, 'day')), new Date()]
    };
  },
  methods: {
    getList () {
      this.$ajax.post({
        apiKey: 'biGetTopUpRecordPageList',
        params: {
          type: this.userInfo.type,
          typeId: this.typeId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          start: this.dateRange[0] ? this.$date(this.dateRange[0]).format('YYYY-MM-DD') : '',
          end: this.dateRange[1] ? this.$date(this.dateRange[1]).format('YYYY-MM-DD') : '',
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
  height: calc(100% - 40px);
}
</style>
