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
          </div>
          <table-com v-if="showTable"
                     :data="tableData"
                     :page-num.sync="pageNum"
                     :page-size.sync="pageSize"
                     :total-size="totalSize"
                     :config="vipChargeTableConfig"
                     :getList="getList">
            <template slot="col1"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{$util.toYuan(row.giveMoney)}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col0"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{$util.toYuan(row.topUpMoney)}}</span>
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
                  <span>{{vipChargeConfigStatusList.find(item => item.value === row.status) ?
                    vipChargeConfigStatusList.find(item => item.value === row.status).label : ''}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col6"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <div class="operate-block">
                    <i-button type="primary" class="table-btn" size="small" @click="editItem(row)">编 辑</i-button>
                    <i-button type="error" class="table-btn" size="small" @click="delClick(row)">删 除</i-button>
                    <i-button type="warning" class="table-btn" size="small" @click="toggleStatus(row)">
                      {{ row.status === vipChargeConfigStatus.on ? '停用' : '启用' }}
                    </i-button>
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
import editModal from '../components/vipChargeEditModal';
import { vipChargeTableConfig } from './tableConfig.js';
import { userType, vipChargeConfigStatusList, vipChargeConfigStatus } from '../../../assets/enums';
import vipLevelDictionaryMixin from '../../../mixins/vipLevelDictionaryMixin';
import { mapGetters } from 'vuex';
export default {
  mixins: [vipLevelDictionaryMixin],
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
    },
    showAddBtn () {
      return (this.showOrgTree && Object.keys(this.nodeData).length > 0) || !this.showOrgTree;
    }
  },
  data () {
    return {
      vipChargeConfigStatus,
      vipChargeConfigStatusList,
      vipChargeTableConfig,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {},
      nodeData: {}
    };
  },
  methods: {
    onNodeClick ({ data, isDefault }) {
      this.nodeData = data;
      this.getVipList(this.showOrgTree ? this.nodeData.id : this.userInfo.brandId, false);
      if (!isDefault) {
        this.getList();
      }
    },
    getList () {
      this.$ajax.post({
        apiKey: 'vipChargePageList',
        params: {
          brandId: this.showOrgTree ? this.nodeData.id : this.userInfo.brandId,
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
    addItem () {
      this.$refs.editModal.show({
        type: 'add',
        item: {
          brandId: this.showOrgTree ? this.nodeData.id : this.userInfo.brandId
        },
        vipLevelList: this.vipLevelList,
        confirmFn: this.getList
      });
    },
    editItem (item) {
      this.$refs.editModal.show({
        type: 'edit',
        item,
        vipLevelList: this.vipLevelList,
        confirmFn: this.getList
      });
    },
    delClick (item) {
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否删除`,
        confirm: () => {
          this.delItem(item);
        }
      });
    },
    delItem (item) {
      this.$ajax.get({
        apiKey: 'vipChargeDelete',
        params: {
          id: item.id
        }
      }).then(() => {
        this.getList();
        this.$message.success('删除成功');
      }).catch(err => {
        this.$message.error(`删除失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    toggleStatus (item) {
      const operateName = item.status === vipChargeConfigStatus.on ? '停用' : '启用';
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否 ${operateName}`,
        confirm: () => {
          this.$ajax.get({
            apiKey: item.status === vipChargeConfigStatus.on ? 'vipChargeDisable' : 'vipChargeEnable',
            params: {
              id: item.id
            }
          }).then(() => {
            this.getList();
            this.$message.success(`${operateName}成功`);
          }).catch(err => {
            this.$message.error(`${operateName}失败${err.msg ? ': ' + err.msg : ''}`);
          });
        }
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
