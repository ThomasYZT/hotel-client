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
                <div class="filter-label">姓名：</div>
                <i-input v-model="filterParams.name" placeholder="姓名模糊查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <div class="filter-item">
                <div class="filter-label">身份证号：</div>
                <i-input v-model="filterParams.idCard" placeholder="身份证号查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <div class="filter-item">
                <div class="filter-label">手机号码：</div>
                <i-input v-model="filterParams.phone" placeholder="手机号码模糊查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <div class="filter-item">
                <div class="filter-label">会员等级：</div>
                <i-select v-model="filterParams.vipLevelId"
                          transfer
                          placeholder="请选择">
                  <i-option v-for="item in vipLevelList"
                            :value="item.id"
                            :key="item.id">
                    {{ item.name }}
                  </i-option>
                </i-select>
              </div>
              <i-button class="short-width-btn" shape="circle" type="primary" @click="getList">查询</i-button>
            </div>
          </div>
          <table-com v-if="showTable"
                     :data="tableData"
                     :page-num.sync="pageNum"
                     :page-size.sync="pageSize"
                     :total-size="totalSize"
                     :config="vipListTableConfig"
                     :getList="getList">
            <template slot="col11"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <div class="operate-block">
                    <i-button type="primary" class="table-btn" size="small" @click="showDetail(row)">查 询</i-button>
                  </div>
                </template>
              </el-table-column>
            </template>
          </table-com>
        </div>
      </div>
    </div>
    <vipInfoModal ref="vipInfoModal"></vipInfoModal>
  </div>
</template>

<script>
import vipInfoModal from '../components/vipInfoModal.vue';
import { vipListTableConfig } from './tableConfig.js';
import { userType, genderList } from '../../../assets/enums';
import { mapGetters } from 'vuex';
export default {
  components: {
    vipInfoModal
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
      genderList,
      vipListTableConfig,
      tableData: [],
      vipLevelList: [],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      filterParams: {
        name: '',
        phone: '',
        idCard: '',
        vipLevelId: ''
      },
      nodeData: {}
    };
  },
  methods: {
    onNodeClick ({ data, isDefault }) {
      this.nodeData = data;
      this.getVipLevelByBrandId(this.showOrgTree ? this.nodeData.id : this.userInfo.brandId, false);
      if (!isDefault) {
        this.getList();
      }
    },
    getList () {
      this.$ajax.post({
        apiKey: 'vipInfoPageList',
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
    showDetail (item) {
      this.$refs.vipInfoModal.show({ item });
    },
    getVipLevelByBrandId (brandId) {
      this.$ajax.get({
        apiKey: 'vipLevelGetByBrandId',
        params: {
          brandId
        }
      }).then(res => {
        this.vipLevelList = res || [];
      });
    }
  },
  mounted () {
    if (!this.showOrgTree) {
      this.getVipLevelByBrandId(this.userInfo.brandId, false);
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
