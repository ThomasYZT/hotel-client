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
              <div class="filter-item">
                <div class="filter-label">商品名称：</div>
                <i-input v-model="filterParams.name" placeholder="商品名称模糊查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <div class="filter-item">
                <div class="filter-label">入库时间：</div>
                <i-date-picker type="daterange" split-panels placeholder="入库时间" @on-change="timeChange"></i-date-picker>
              </div>
              <i-button class="short-width-btn" shape="circle" type="primary" @click="getList">查询</i-button>
            </div>
          </div>
          <table-com v-if="showTable"
                     :data="tableData"
                     :page-num.sync="pageNum"
                     :page-size.sync="pageSize"
                     :total-size="totalSize"
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
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {
        name: '',
        startTime: '',
        endTime: ''
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
    getList () {
      this.$ajax.post({
        apiKey: 'goodsOutStoragePageList',
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
    timeChange (val) {
      this.filterParams.startTime = val[0] || '';
      this.filterParams.endTime = val[1] || '';
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
