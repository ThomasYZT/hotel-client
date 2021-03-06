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
              <div class="filter-item" style="width: 230px;">
                <div class="filter-label">房号：</div>
                <i-input v-model="filterParams.roomNumber" placeholder="房号查询" clearable @on-clear="getList" search @on-search="getList"></i-input>
              </div>
              <div class="filter-item" style="width: 230px;">
                <div class="filter-label">楼层：</div>
                <i-select v-model="filterParams.floorId" style="width: 100%;" @on-clear="getList">
                  <i-option v-for="item in floorList"
                            :value="item.id"
                            :key="item.id">
                    {{ item.dictName }}
                  </i-option>
                </i-select>
              </div>
              <div class="filter-item" style="width: 230px;height: 32px;">
                <div class="filter-label">房间类型：</div>
                <i-select v-model="filterParams.roomTypeId" style="width: 100%;" @on-clear="getList">
                  <i-option v-for="item in roomTypeList"
                            :value="item.id"
                            :key="item.id">
                    {{ item.typeName }}
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
                     :config="tableConfig"
                     :getList="getList">
            <template slot="col2"
                      slot-scope="{ item }">
              <el-table-column :prop="item.prop"
                               :label="item.label"
                               :fixed="item.fixed"
                               :min-width="item.minWidth">
                <template slot-scope="{ row }">
                  <span>
                    {{floorList.find(item => item.id === row.floorId)
                      ? floorList.find(item => item.id === row.floorId).dictName
                      : ''}}
                  </span>
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
                  <span v-if="row.isAttribute === 0">显示</span>
                  <span v-else>不显示</span>
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
import editModal from '../components/editModal';
import { tableConfig } from './tableConfig.js';
import { userType } from '../../../assets/enums';
import floorDictionaryMixin from '../../../mixins/floorDictionaryMixin';
import { mapGetters } from 'vuex';
export default {
  mixins: [floorDictionaryMixin],
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
        roomNumber: '',
        floorId: 0,
        roomTypeId: 0
      },
      roomTypeList: [],
      nodeData: {}
    };
  },
  methods: {
    onNodeClick ({ data, isDefault }) {
      this.nodeData = data;
      this.getFloors(this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId);
      if (!isDefault) {
        this.getList();
      }
    },
    getList () {
      this.getAllRoomType().then(() => {
        this.$ajax.post({
          apiKey: 'roomPageList',
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
      }).catch(() => {
        this.$message.error('获取房间类型失败');
      });
    },
    getAllRoomType () {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'roomTypeGetAllList',
          params: {
            hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId
          },
          loading: false
        }).then(data => {
          this.roomTypeList = data ? [{
            id: 0,
            typeName: '全部'
          }].concat(data) : [{
            id: 0,
            typeName: '全部'
          }];
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    },
    addItem () {
      this.$refs.editModal.show({
        type: 'add',
        item: {
          hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId
        },
        floorList: this.floorList,
        roomTypeList: this.roomTypeList,
        confirmFn: this.getList
      });
    },
    editItem (item) {
      this.$refs.editModal.show({
        type: 'edit',
        item,
        floorList: this.floorList,
        roomTypeList: this.roomTypeList,
        confirmFn: this.getList
      });
    },
    delClick (item) {
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否删除 ${item.roomNumber}`,
        confirm: () => {
          this.delItem(item);
        }
      });
    },
    delItem (item) {
      this.$ajax.get({
        apiKey: 'roomDelete',
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
      this.getFloors(this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId);
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
