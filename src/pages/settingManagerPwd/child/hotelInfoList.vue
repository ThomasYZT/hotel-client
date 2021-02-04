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
                <div class="filter-label">酒店名称：</div>
                <i-input v-model="filterPrams.name" placeholder="酒店名称模糊查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
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
            <template slot="col2"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <div class="operate-block">
                    <i-button type="primary" class="table-btn" size="small" @click="editItem(row)">设置口令</i-button>
                  </div>
                </template>
              </el-table-column>
            </template>
          </table-com>
        </div>
      </div>
    </div>
    <editPwdModal ref="editPwdModal"></editPwdModal>
    <confirmModal ref="confirmModal"></confirmModal>
  </div>
</template>

<script>
import editPwdModal from '../components/editPwdModal';
import { tableConfig } from './tableConfig.js';
import { userType } from '../../../assets/enums';
import { mapGetters } from 'vuex';
export default {
  components: {
    editPwdModal
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    orgParams () {
      let level;
      switch (this.userInfo.type) {
        case userType.admin:
          level = 2;
          break;
        case userType.agent:
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
      return [userType.admin, userType.agent].includes(this.userInfo.type);
    },
    showTable () {
      return !this.showOrgTree || Object.keys(this.nodeData).length > 0;
    }
  },
  data () {
    return {
      tableConfig,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterPrams: {
        name: ''
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
      const brandId = this.showOrgTree ? this.nodeData.id : this.userInfo.id;
      this.$ajax.post({
        apiKey: 'hotelPageList',
        params: {
          // id: this.userInfo.type === userType.hotel ? this.userInfo.id : brandId,
          brandId,
          ...this.filterPrams,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(data => {
        this.tableData = data.data || [];
        this.totalSize = data.totalSize || 0;
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    editItem (item) {
      this.$refs.editPwdModal.show({ type: 'edit', item, confirmFn: this.getList });
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
