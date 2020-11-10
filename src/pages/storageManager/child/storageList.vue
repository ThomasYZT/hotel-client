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
            <template slot="col1"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{genderList.find(item => item.value === row.sex) ?
                    genderList.find(item => item.value === row.sex).label : ''}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col5"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{consignTypeList.find(item => item.id === row.consignType)
                    ? consignTypeList.find(item => item.id === row.consignType).dictName : ''}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col7"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{storageStatusList.find(item => item.value === row.status).name}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col8"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <div class="operate-block">
                    <i-button type="primary"  v-if="row.status===0" class="table-btn" size="small" @click="editItem(row)">编 辑</i-button>
                    <i-button type="info" v-if="row.status===0" class="table-btn" size="small" @click="retrieveClick(row)">取 出</i-button>
                    <i-button type="error" v-if="row.status===0" class="table-btn" size="small" @click="lostClick(row)">遗 失</i-button>
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
import { userType, storageStatusList, genderList } from '../../../assets/enums';
import XLJCDictionaryMixin from '../../../mixins/XLJCDictionaryMixin';
import { mapGetters } from 'vuex';
export default {
  mixins: [XLJCDictionaryMixin],
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
      genderList,
      storageStatusList,
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
      this.getConsignTypeList(this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId, false);
      if (!isDefault) {
        this.getList();
      }
    },
    getList () {
      this.$ajax.post({
        apiKey: 'storagePageList',
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
    addItem () {
      this.$refs.editModal.show({
        type: 'add',
        item: {
          hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId
        },
        consignTypeList: this.consignTypeList,
        confirmFn: this.getList
      });
    },
    editItem (item) {
      this.$refs.editModal.show({
        type: 'edit',
        item,
        consignTypeList: this.consignTypeList,
        confirmFn: this.getList
      });
    },
    retrieveClick (item) {
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否取出`,
        confirm: () => {
          this.retrieveItem(item);
        }
      });
    },
    lostClick (item) {
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否遗失`,
        confirm: () => {
          this.lostItem(item);
        }
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
        apiKey: 'storageDelete',
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
    retrieveItem (item) {
      this.$ajax.get({
        apiKey: 'storageRetrieveConsign',
        params: {
          id: item.id
        }
      }).then(() => {
        this.getList();
        this.$message.success('操作成功');
      }).catch(err => {
        this.$message.error(`操作失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    lostItem (item) {
      this.$ajax.get({
        apiKey: 'storageLostConsign',
        params: {
          id: item.id
        }
      }).then(() => {
        this.getList();
        this.$message.success('操作成功');
      }).catch(err => {
        this.$message.error(`操作失败${err.msg ? ': ' + err.msg : ''}`);
      });
    }
  },
  mounted () {
    if (!this.showOrgTree) {
      this.getConsignTypeList(this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId, false);
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
