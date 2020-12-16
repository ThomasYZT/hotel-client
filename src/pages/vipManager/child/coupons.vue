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
                <div class="filter-label">优惠券类型：</div>
                <i-select v-model="filterParams.purpose" style="width: 100%;" @on-clear="getList">
                  <i-option v-for="item in couponsTypeList"
                            :value="item.value"
                            :key="item.value">
                    {{ item.label }}
                  </i-option>
                </i-select>
              </div>
              <div class="filter-item">
                <div class="filter-label">标题：</div>
                <i-input v-model="filterParams.title" placeholder="标题" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <i-button class="short-width-btn" shape="circle" type="primary" @click="getList">查询</i-button>
            </div>
          </div>
          <table-com v-if="showTable"
                     :data="tableData"
                     :page-num.sync="pageNum"
                     :page-size.sync="pageSize"
                     :total-size="totalSize"
                     :config="couponListTableConfig"
                     :getList="getList">
            <template slot="col2"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{$util.toYuan(row.subtractAmount)}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col3"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>{{vipLevelList.find(item => item.id === row.levelId) ?
                    vipLevelList.find(item => item.id === row.levelId).name : ''}}</span>
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
                  <span>{{couponStatusList.find(item => item.value === row.state) ?
                    couponStatusList.find(item => item.value === row.state).label : ''}}</span>
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
                  <span>{{couponsTypeList.find(item => item.value === row.purpose) ?
                    couponsTypeList.find(item => item.value === row.purpose).label : ''}}</span>
                </template>
              </el-table-column>
            </template>
            <template slot="col13"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <div class="operate-block">
                    <i-button type="primary" class="table-btn" size="small" @click="editItem(row)">编 辑</i-button>
                    <i-button type="error" class="table-btn" size="small" @click="delClick(row)">删 除</i-button>
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
import editModal from '../components/couponEditModal';
import { couponListTableConfig } from './tableConfig.js';
import { userType, couponsTypeList, couponStatusList } from '../../../assets/enums';
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
      couponStatusList,
      couponsTypeList,
      couponListTableConfig,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {
        purpose: '',
        title: ''
      },
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
        apiKey: 'couponPageList',
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
        content: `是否删除 ${item.title}`,
        confirm: () => {
          this.delItem(item);
        }
      });
    },
    delItem (item) {
      this.$ajax.get({
        apiKey: 'couponsDelete',
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
