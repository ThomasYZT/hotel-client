<template>
  <div class="page-container">
    <div class="page-content">
      <div class="flex-box">
        <div class="left-box">
          <org-tree v-if="showOrgTree" all-selectable :params="orgParams" @nodeClick="onNodeClick"></org-tree>
        </div>
        <div class="data-box right-box">
          <div class="operation-wrapper flex-box">
            <div class="filter-block right-box">

<!--              <i-button class="short-width-btn" shape="circle" type="primary" @click="getList">查询</i-button>-->
            </div>
          </div>
          <div class="chart-wrapper">
            <vueChart :options="chartOptions"></vueChart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueChart from '../../../components/vueChart';
import { userType } from '../../../assets/enums';
import { mapGetters } from 'vuex';
export default {
  components: {
    vueChart
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'dictionary'
    ]),
    orgParams () {
      let level;
      switch (this.userInfo.type) {
        case userType.admin:
          level = 3;
          break;
        case userType.agent:
          level = 2;
          break;
        case userType.brand:
          level = 1;
          break;
      }
      return {
        typeId: this.userInfo.id,
        type: this.userInfo.type,
        level
      };
    },
    showOrgTree () {
      return [userType.admin, userType.agent, userType.brand].includes(this.userInfo.type);
    },
    showTable () {
      return !this.showOrgTree || Object.keys(this.nodeData).length > 0;
    }
  },
  data () {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {},
      roomTypeList: [],
      nodeData: {},
      chartOptions: {
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130, 80, 70, 110, 130, 80],
          type: 'bar'
        }]
      }
    };
  },
  methods: {
    onNodeClick ({ data, isDefault }) {
      this.nodeData = data;
      if (!isDefault) {
        this.getList();
      }
    },
    getList () {
      this.$ajax.post({
        apiKey: 'roomPageList',
        params: {
          hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId,
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
    },
  },
  mounted () {

  }
};
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/scss/base";
  .flex-box {
    height: 100%;
    .chart-wrapper{
      height: calc(100% - 40px);
    }
  }
</style>
