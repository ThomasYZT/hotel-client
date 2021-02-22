<template>
  <div class="page-container">
    <div class="page-content">
      <div class="flex-box">
        <div class="left-box">
          <org-tree v-if="showOrgTree" :params="orgParams" @nodeClick="onNodeClick"></org-tree>
        </div>
        <div class="data-box right-box">
          <div class="operation-wrapper flex-box">
            <div class="tool-wrapper left-box">

            </div>
            <div class="filter-block right-box">
              <div class="filter-item">
                <div class="filter-label">营业日期：</div>
                <i-date-picker type="date" v-model="businessDate" :options="dateOptions"></i-date-picker>
              </div>
            </div>
          </div>
          <table-com v-if="showTable"
                     :data="tableData"
                     :summaryHandler="summaryHandler"
                     :hasPage="false"
                     :showSummary="true"
                     :config="tableConfig"
                     :getList="getList">
          </table-com>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tableConfig } from './tableConfig.js';
import { userType } from '../../../assets/enums';
import { mapGetters } from 'vuex';
export default {
  components: {
    
  },
  computed: {
    ...mapGetters([
      'userInfo'
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
    },
    showAddBtn () {
      return (this.showOrgTree && Object.keys(this.nodeData).length > 0) || !this.showOrgTree;
    }
  },
  data () {
    return {
      tableConfig,
      tableData: [],
      nodeData: {},
      businessDate: new Date(),
      dateOptions: {
        disabledDate (date) {
          return date;
        }
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
    summaryHandler (param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
        } else if ([1].includes(index)) {
          const values = data.map(item => Number(item[column.property]));
          sums[index] =this.$util.sumArr(values, '', '');
        }else if ([2].includes(index)) {
          const values = data.map(item => Number(item[column.property]));
          sums[index] = this.$util.sumArr(values, '', '');
        }else if ([3].includes(index)) {
          const values = data.map(item => Number(item[column.property]));
          sums[index] = this.$util.sumArr(values, '', '');
        }else if ([4].includes(index)) {
          const values = data.map(item => Number(item[column.property]));
          sums[index] = this.$util.sumArr(values, '', '');
        }else if ([5].includes(index)) {
          const values = data.map(item => Number(item[column.property]));
          sums[index] = this.$util.sumArr(values, '', '');
        }else if ([6].includes(index)) {
          const values = data.map(item => Number(item[column.property]));
          sums[index] = this.$util.sumArr(values, '', '');
        }  else {
          return '';
        }
      });

      return sums;
    },
    getList () {
      this.$ajax.get({
        apiKey: 'roomCurrentRoom',
        params: {
          hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId
        }
      }).then(data => {
          console.log(data)
        this.tableData = data;
        console.log(this.tableData);
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    }
  },
  mounted () {
    if (!this.showOrgTree) {
      this.getList();
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.flex-box {
  height: 100%;
  /deep/ .table-wrapper{
    height: calc(100% - 40px);
  }
}
</style>
