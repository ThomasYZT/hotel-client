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
                <div class="filter-label">开始日期：</div>
                <i-date-picker type="date" v-model="filterParams.startDate"></i-date-picker>
              </div>
              <div class="filter-item">
                <div class="filter-label">显示天数：</div>
                <i-select v-model="filterParams.day" style="width: 100%;">
                  <i-option v-for="item in dayList"
                            :value="item.value"
                            :key="item.value">
                    {{ item.label }}
                  </i-option>
                </i-select>
              </div>
              <i-button class="short-width-btn" shape="circle" type="primary" @click="getList">查询</i-button>
            </div>
          </div>
          <!-- <table-com v-if="showTable"
                     :data="tableData"
                     :summaryHandler="summaryHandler"
                     :hasPage="false"
                     :showSummary="true"
                     :config="tableTitle"
                     :getList="getList">
          </table-com> -->
          <Table border :columns="columns1" :data="data1"></Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userType } from '../../../assets/enums';
import { mapGetters } from 'vuex';
// import { constants } from 'zlib';
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
      tableData: [],
      nodeData: {},
      filterParams: {
        startDate: new Date(),
        day: '7',
        endDate: ''
      },
      columns1: [
                    {
                        title: 'Name',
                        key: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    }
                ],
                data1: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ],
      dayList: [
            {
                value: '7',
                label: '7'
            },
            {
                value: '10',
                label: '10'
            },
            {
                value: '15',
                label: '15'
            },
            {
                value: '20',
                label: '20'
            },
            {
                value: '25',
                label: '25'
            },
            {
                value: '30',
                label: '30'
            }
       ]
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
      const date2 = new Date(this.filterParams.startDate)
      const day = parseInt(this.filterParams.day) - 1;
      date2.setDate(date2.getDate() + parseInt(day))

      const year2 = date2.getFullYear()
      const month2 = (date2.getMonth() + 1) >= 10 ? (date2.getMonth() + 1) : ('0' + (date2.getMonth() + 1))
      const day2 = date2.getDate() >= 10 ? date2.getDate() : ('0' + date2.getDate())
      this.filterParams.endDate = `${year2}-${month2}-${day2}`;

      const date = new Date(this.filterParams.startDate)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
      const startDay = date.getDate() >= 10 ? date.getDate() : ('0' + date.getDate())
      this.filterParams.startDate = `${year}-${month}-${startDay}`;

      this.$ajax.post({
        apiKey: 'roomForwardRoomList',
        params: {
          hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId,
          ...this.filterParams
        }
      }).then(data => {
          this.tableData = data.data || [];
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
