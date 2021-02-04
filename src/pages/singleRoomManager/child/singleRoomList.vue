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
              <i-button  type="primary" :ghost="zzfd" @click="zzfdClick">在住房单</i-button>
            </div>
            <div class="tool-wrapper left-box" style="margin-left:10px;">
              <i-button type="primary" :ghost="ylfd" @click="ylfdClick">预离房单</i-button>
            </div>
            <div class="tool-wrapper left-box" style="margin-left:10px;">
              <i-button type="primary" :ghost="jrytdf" @click="jrytdfClick">今日已退房单</i-button>
            </div>
            <div class="filter-block right-box">
              <i-button class="short-width-btn" style="width:90px;" type="primary" @click="getList">高级查询</i-button>
            </div>
          </div>
          <table-com v-if="showTable"
                     :data="tableData"
                     :page-num.sync="pageNum"
                     :page-size.sync="pageSize"
                     :total-size="totalSize"
                     :config="tableConfig"
                     :getList="getList">
            <template slot="col2"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{$util.toYuan(row.totalPrice)}}</span>
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
import { tableConfig } from './tableConfig.js';
import { userType, payTypeList } from '../../../assets/enums';
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
      payTypeList,
      tableConfig,
      tableData: [],
      zzfd: true,
      ylfd: true,
      jrytdf: true,
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {
        roomNumber: '',
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
    },
    zzfdClick() {
        this.zzfd = false;
        this.ylfd = true;
        this.jrytdf = true;
    },
    ylfdClick() {
        this.zzfd = true;
        this.ylfd = false;
        this.jrytdf = true;
    },
    jrytdfClick() {
        this.zzfd = true;
        this.ylfd = true;
        this.jrytdf = false;
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
