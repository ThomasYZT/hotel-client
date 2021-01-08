<template>
  <div class="chart-container">
    <vueChart :options="chartOptions"></vueChart>
  </div>
</template>

<script>
import vueChart from '../../../components/vueChart';
import { userType } from '../../../assets/enums/index';
import { mapGetters } from 'vuex';
export default {
  components: {
    vueChart
  },
  props: {
    graphParams: {
      type: Object,
      default () {
        return {};
      }
    }
  },
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
    },
    chartOptions () {
      return {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.dateList,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '金额',
            type: 'bar',
            barWidth: '20px',
            data: this.dataList
          }
        ]
      };
    }
  },
  data () {
    return {
      dateList: [],
      dataList: []
    };
  },
  methods: {
    getData () {
      this.$ajax.get({
        apiKey: 'biGetTopUpStatistical',
        params: {
          start: this.$date(this.graphParams.dateRange[0]).format('YYYY-MM-DD'),
          end: this.$date(this.graphParams.dateRange[1]).format('YYYY-MM-DD'),
          type: this.userInfo.type,
          typeId: this.typeId
        }
      }).then(res => {
        this.dateList = res.map(item => item.date);
        this.dataList = res.map(item => item.value);
      }).catch(() => {
        this.$message.error('获取数据失败');
      });
    }
  },
  created () {
    this.getData();
  },
  watch: {
    graphParams: {
      handler () {
        this.getData();
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 300px;
}
</style>
