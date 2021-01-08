<template>
  <div class="page-container">
    <div class="data-box" style="height: 400px">
      <div class="box-header">
        营业报表
      </div>
      <div class="operation-wrapper flex-box">
        <div class="left-box">
          <i-radio-group v-model="graphType" style="width: 500px"
                         type="button">
            <i-radio v-for="item in statisticTypeList"
                     :key="item.value"
                     :label="item.value">
              {{ item.label }}
            </i-radio>
          </i-radio-group>
        </div>
        <div class="filter-block right-box">
          <div class="filter-item">
            <div class="filter-label">时间范围：</div>
            <i-date-picker v-model="graphParams.dateRange"
                           transfer
                           type="daterange"
                           placement="bottom-end"
                           placeholder="请选择时间范围"
                           style="width: 250px"/>
          </div>
          <i-button type="primary">查询</i-button>
        </div>
      </div>
      <totalTurnoverChart v-if="graphType === statisticType.totalTurnover" :graphParams="graphParams"></totalTurnoverChart>
      <merchandisingChart v-else-if="graphType === statisticType.merchandising" :graphParams="graphParams"></merchandisingChart>
      <memberRechargeChart v-else-if="graphType === statisticType.memberRecharge" :graphParams="graphParams"></memberRechargeChart>
      <passengerFlowChart v-else-if="graphType === statisticType.passengerFlow" :graphParams="graphParams"></passengerFlowChart>
      <payChart v-else :graphParams="graphParams"></payChart>
    </div>
    <div class="data-box" style="height: 500px">
      <div class="box-header">
        收款查询
      </div>
      <tableTemplate></tableTemplate>
    </div>
  </div>
</template>

<script>
import totalTurnoverChart from '../components/totalTurnoverChart';
import merchandisingChart from '../components/merchandisingChart';
import memberRechargeChart from '../components/memberRechargeChart';
import passengerFlowChart from '../components/passengerFlowChart';
import tableTemplate from '../components/tableTemplate/index';
import payChart from '../components/payChart';
import { statisticType, statisticTypeList } from '../../../assets/enums/index';
export default {
  components: {
    totalTurnoverChart,
    merchandisingChart,
    memberRechargeChart,
    passengerFlowChart,
    payChart,
    tableTemplate
  },
  data () {
    return {
      statisticTypeList,
      statisticType,
      graphType: statisticType.totalTurnover,
      graphParams: {
        dateRange: [new Date(this.$date().add(-7, 'day')), new Date()]
      }
    };
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.page-container {
  padding: 0 0;
  height: 100%;
  background-color: #FFFFFF;
  overflow-y: auto;
  .data-box {
    display: inline-block;
    width: 100%;
    .box-header {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }
  }
}
</style>
