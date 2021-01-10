<template>
  <div class="page-container">
    <div class="page-content">
      <div class="flex-box">
        <div class="left-box">
          <org-tree v-if="showOrgTree" :params="orgParams" @nodeClick="onNodeClick"></org-tree>
        </div>
        <div class="data-box right-box">
          <div class="operation-wrapper flex-box">
            <div class="filter-block right-box">
              <div class="filter-block right-box">
                <div class="filter-item"
                     style="width: 400px">
                  <div class="filter-label">时间范围：</div>
                  <i-date-picker v-model="filterPrams.dateRange"
                                 style="width: 100%"
                                 transfer
                                 format="yyyy-MM-dd HH:mm:ss"
                                 type="datetimerange"
                                 placement="bottom-end"
                                 placeholder="请选择时间范围"/>
                </div>
              </div>
              <i-button class="short-width-btn" shape="circle" type="primary" @click="getList">查询</i-button>
            </div>
          </div>
          <table-com v-if="showTable"
                     :data="tableData"
                     :config="goodsSalesCollectTableConfig"
                     :summaryHandler="summaryHandler"
                     :hasPage="false"
                     :showSummary="true"
                     :getList="getList">
            <template slot="col2"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{$util.toYuan(row.unitPrice) || 0}}</span>
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
                  <span>{{$util.toYuan(row.totalPrice) || 0}}</span>
                </template>
              </el-table-column>
            </template>
          </table-com>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { goodsSalesCollectTableConfig } from './tableConfig.js';
import { userType } from '../../../assets/enums';
import { mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    typeId () {
      switch (this.userInfo.type) {
        case userType.admin:
          return -1;
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
      return (!this.showOrgTree || Object.keys(this.nodeData).length > 0);
    }
  },
  data () {
    return {
      goodsSalesCollectTableConfig,
      tableData: [],
      filterPrams: {
        dateRange: [new Date(this.$date(0, 'HH:mm:ss').add(-7, 'day')), new Date(this.$date('23：59：59', 'HH:mm:ss'))]
      },
      nodeData: {}
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
          sums[index] = '合计';
        } else if ([2, 4].includes(index)) {
          const values = data.map(item => Number(item[column.property]));
          sums[index] = this.$util.sumArr(values, '元', this.$util.toYuan);
        } else {
          return '';
        }
      });

      return sums;
    },
    getList () {
      this.$ajax.get({
        apiKey: 'biGetGoodsSalesCollect',
        params: {
          typeId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId,
          type: this.showOrgTree ? this.nodeData.type : 0,
          start: this.$date(this.filterPrams.dateRange[0]).format('YYYY-MM-DD HH:mm:ss'),
          end: this.$date(this.filterPrams.dateRange[1]).format('YYYY-MM-DD HH:mm:ss')
        }
      }).then(data => {
        this.tableData = data || [];
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    }
  },
  mounted () {

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
