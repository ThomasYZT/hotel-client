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
              <i-button v-if="showAddBtn" type="primary" @click="addItem">添加</i-button>
            </div>
            <div class="filter-block right-box">
              <div class="filter-item">
                <div class="filter-label">姓名：</div>
                <i-input v-model="filterParams.name" placeholder="姓名模糊查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <div class="filter-item">
                <div class="filter-label">手机号码：</div>
                <i-input v-model="filterParams.phone" placeholder="手机号码模糊查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
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
            <template slot="col5"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <div class="operate-block">
                    <i-button type="primary" class="table-btn" size="small" @click="editItem(row)">编 辑</i-button>
                    <i-button type="error" class="table-btn" size="small" @click="delClick(row)">删 除</i-button>
                    <i-switch size="large" :true-value="1" :false-value="0" v-model="row.status"
                              @on-change="statusChange($event, row)">
                      <span slot="open">停用</span>
                      <span slot="close">启用</span>
                    </i-switch>
                  </div>
                </template>
              </el-table-column>
            </template>
          </table-com>
        </div>
      </div>
    </div>
    <editModal ref="editModal"></editModal>
    <confirmModal ref="confirmModal"></confirmModal>
  </div>
</template>

<script>
import editModal from '../components/editModal';
import { tableConfig } from './tableConfig.js';
import { userType } from '../../../assets/enums';
import { mapGetters } from 'vuex';
export default {
  components: {
    editModal
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
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {
        name: '',
        phone: ''
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
        apiKey: 'blacklistPageList',
        params: {
          hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.id,
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
    statusChange (val, item) {
      if (val === 0) {
        this.$ajax.get({
          apiKey: 'blacklistDisableBlacklist',
          params: {
            id: item.id
          }
        }).then(() => {
          this.$message.success('停用成功');
        }).catch(err => {
          this.$message.success(`停用失败${err.msg ? ': ' + err.msg : ''}`);
        });
      } else {
        this.$ajax.get({
          apiKey: 'blacklistEnableBlacklist',
          params: {
            id: item.id
          }
        }).then(() => {
          this.$message.success('启用成功');
        }).catch(err => {
          this.$message.success(`启用失败${err.msg ? ': ' + err.msg : ''}`);
        });
      }
    },
    addItem () {
      this.$refs.editModal.show({
        type: 'add',
        item: {
          hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.id
        },
        confirmFn: this.getList
      });
    },
    editItem (item) {
      this.$refs.editModal.show({ type: 'edit', item, confirmFn: this.getList });
    },
    delClick (item) {
      if(item.status === 1) {
        this.$message.warning('必须先停用该记录，才能删除');
      }else {
        this.$refs.confirmModal.show({
          title: '警告',
          content: `是否删除 ${item.name}`,
          confirm: () => {
            this.delItem(item);
          }
        });
      }
    },
    delItem (item) {
      this.$ajax.get({
        apiKey: 'blacklistDelete',
        params: {
          id: item.id
        }
      }).then(() => {
        this.getList();
        this.$message.success('删除成功');
      }).catch(err => {
        this.$message.error(`删除失败${err.msg ? ': ' + err.msg : ''}`);
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
