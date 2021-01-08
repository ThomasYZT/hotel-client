<template>
  <div style="height: 100%">
    <div class="operation-wrapper flex-box">
      <div class="filter-block right-box">
        <div class="filter-item">
          <div class="filter-label">订单编号：</div>
          <i-input v-model="filterParams.orderCode" placeholder="订单编号" clearable></i-input>
        </div>
        <div class="filter-item">
          <div class="filter-label">支付方式：</div>
          <i-select v-model="filterParams.payType"
                    transfer
                    placeholder="请选择">
            <i-option v-for="item in payTypeList"
                      :value="item.value"
                      :key="item.value">
              {{ item.label }}
            </i-option>
          </i-select>
        </div>
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
               :config="refundRecordTableConfig"
               :getList="getList">
      <template slot="col2"
                slot-scope="{ item }">
        <el-table-column :prop="item.prop"
                         :label="item.label"
                         :fixed="item.fixed"
                         :min-width="item.minWidth">
          <template slot-scope="{ row }">
            <span>{{$util.toYuan(row.money)}}</span>
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
            <span>{{statePayTypeList.find(item => item.value === row.type) ?
              statePayTypeList.find(item => item.value === row.type).label : ''}}</span>
          </template>
        </el-table-column>
      </template>
    </table-com>
  </div>
</template>

<script>
import { payTypeList, userType, statePayTypeList } from '../../../../assets/enums/index';
import { refundRecordTableConfig } from './tableConfig';
import { mapGetters } from 'vuex';
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
      statePayTypeList,
      refundRecordTableConfig,
      payTypeList: [{ label: '全部', value: -1 }].concat(payTypeList),
      tableData: [],
      vipLevelList: [],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {
        payType: -1,
        orderCode: ''
      },
      dateRange: [new Date(this.$date().add(-7, 'day')), new Date()]
    };
  },
  methods: {
    getList () {
      this.$ajax.get({
        apiKey: 'biRefundStat',
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
