<template>
  <div class="page-container">
    <div class="page-content">
      <div class="flex-box">
        <div class="left-box">
          <org-tree v-if="showOrgTree" :params="orgParams" @nodeClick="onNodeClick"></org-tree>
        </div>
        <div class="data-box right-box">
          <div class="operation-wrapper">
            <div class="operate-btn"
                 v-for="(item, index) in functionList"
                 :key="index"
                 @click="onFunctionClick(item)">
              <div class="icon-wrapper">
                <img v-if="item.id !== functionType.addTool"
                     class="del-icon"  alt=""
                     src="../../../assets/img/delete.png"
                     @click.stop="delTool(item)">
                <i :class="`iconfont ${item.icon}`"></i>
              </div>
              {{item.name}}
            </div>
          </div>

          <div class="list-wrapper">
            <div class="flex-box">
              <div class="left-box">
                <div class="floor-pagenation">
                  <div class="page-item"
                       :class="{ 'active-page-num': filterParams.floorId === item.id }"
                       v-for="(item, index) in floorList"
                       :key="index"
                       @click="onFloorClick(item)">
                    {{item.dictName}}
                  </div>
                </div>
              </div>
              <div class="right-box room-list">
                <div v-for="(item, index) in tableData"
                     :key="index"
                     class="room-block"
                     :class="{ 'active': item.id === activeRoom.id }"
                     :style="{ backgroundColor: roowStatusList.find(state => item.status === state.value).bgColor }"
                     @click="onRoomClick(item)">
                  <div>{{item.roomNumber}}</div>
                  <div>{{item.roomTypeName}}</div>
                  <div class="status-btn"
                       v-if="[roomStatus.clean, roomStatus.error, roomStatus.outClearing].includes(item.status)"
                       @click.stop="changeStatus(item)">修改状态</div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer-operator">
            <div class="filter-item">总房数：{{allRoomCount}}</div>
            <div class="filter-item">入住数：{{stayCount}}</div>
            <div class="filter-item" style="width: 100px !important;">
              <i-select v-model="filterParams.floorId" style="width: 100%;" @on-change="getList">
                <i-option v-for="item in floorList"
                          :value="item.id"
                          :key="item.id">
                  {{ item.dictName }}
                </i-option>
              </i-select>
            </div>
            <div v-for="item in roowStatusList"
                 :key="item.value"
                 class="filter-item">
              <div class="filter-btn"
                   :style="{ backgroundColor: item.bgColor }"
                   @click="statusChange(item.value)">
                {{item.label}}
              </div>
            </div>
            <div class="filter-item">
              <i-input v-model="filterParams.roomNumber"
                       style="width: 70px;"
                       placeholder="房间号"
                       :clearable="true"
                       @on-clear="getList"
                       @on-enter="getList"></i-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <confirmModal ref="confirmModal"></confirmModal>
    <addToolModal ref="addToolModal"></addToolModal>
    <ordainModal ref="ordainModal"></ordainModal>
    <checkInModal ref="checkInModal"></checkInModal>
    <checkoutModal ref="checkoutModal"></checkoutModal>
    <changeStatusModal ref="changeStatusModal"></changeStatusModal>
  </div>
</template>

<script>
import { userType, roowStatusList, functionType, functionMapList, roomStatus, orderType } from '../../../assets/enums';
import addToolModal from '../components/addToolModal';
import ordainModal from '../components/ordainModal';
import checkInModal from '../components/checkInModal';
import checkoutModal from '../components/checkoutModal';
import changeStatusModal from '../components/changeStatusModal';
import floorDictionaryMixin from '../../../mixins/floorDictionaryMixin';
import { mapGetters } from 'vuex';
export default {
  mixins: [floorDictionaryMixin],
  components: {
    addToolModal,
    ordainModal,
    checkInModal,
    checkoutModal,
    changeStatusModal
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
    }
  },
  data () {
    return {
      roomStatus,
      roowStatusList: [{
        label: '全部',
        value: '-1',
        bgColor: '#4e6ef2'
      }].concat(roowStatusList),
      functionType,
      orderType,
      functionList: [],
      tableData: [],
      filterParams: {
        status: -1,
        roomNumber: '',
        floorId: 0,
        roomTypeId: 0
      },
      roomTypeList: [],
      nodeData: {},
      activeRoom: {},
      allRoomCount: 0,
      stayCount: 0
    };
  },
  methods: {
    onNodeClick ({ data }) {
      this.nodeData = data;
      this.getFloors(this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId);
      this.getList();
      this.statusStat();
    },
    getList () {
      this.activeRoom = {};
      this.getAllRoomType().then(() => {
        this.$ajax.post({
          apiKey: 'roomPageList',
          params: {
            hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId,
            pageNum: 1,
            pageSize: 999999,
            ...this.filterParams
          }
        }).then(data => {
          this.tableData = data.data || [];
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
    onRoomClick (item) {
      if (Object.keys(this.activeRoom).length > 0) {
        this.activeRoom = this.activeRoom.id === item.id ? {} : item;
      } else {
        this.activeRoom = item;
      }
    },
    onFloorClick (item) {
      this.filterParams.floorId = item.id;
      this.getList();
    },
    statusChange (status) {
      this.filterParams.status = status;
      this.getList();
    },
    onFunctionClick (item) {
      switch (item.id) {
        case functionType.reserve:
          // 预定
          this.reservationAndCheckin('reservation');
          break;
        case functionType.check:
          // 登记入住
          this.reservationAndCheckin('checkin');
          break;
        case functionType.reservationQuiry:
          // 订单查询
          this.$router.push({
            name: 'orderList'
          });
          break;
        case functionType.roomPrice:
          // 查看房价
          this.$router.push({
            name: 'roomTypeList'
          });
          break;
        case functionType.businessQuery:
          // 营业查询
          this.$router.push({
            name: 'dataStatistic'
          });
          break;
        case functionType.handover:
          this.$router.push({
            name: 'workList'
          });
          break;
        case functionType.settle:
          if (Object.keys(this.activeRoom).length === 0 ||
            ![roomStatus.live, roomStatus.hourRoom].includes(this.activeRoom.status)) {
            this.$message.warning('请选择在住房间或钟点房');
            return;
          }
          this.$refs.checkoutModal.show({
            item: {
              hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId,
              hotelUserId: this.userInfo.id
            },
            roomInfo: this.activeRoom,
            confirmFn: () => {
              this.getList();
            }
          });
          break;
        case functionType.addTool:
          this.$refs.addToolModal.show({
            funcList: this.functionList,
            confirmFn: () => { this.getTools(); }
          });
          break;
      }
    },
    reservationAndCheckin (type) {
      // 预定
      if (type === 'reservation') {
        if (Object.keys(this.activeRoom).length === 0 ||
            ![roomStatus.clean].includes(this.activeRoom.status)) {
          this.$message.warning('请选择一个空净房');
          return;
        }
        this.$refs.ordainModal.show({
          item: {
            hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId,
            hotelUserId: this.userInfo.id,
            orderType: orderType.mobile
          },
          activeRoom: this.activeRoom,
          confirmFn: () => {
            this.getList();
          }
        });
      }
      // 登记入住
      if (type === 'checkin') {
        if (Object.keys(this.activeRoom).length > 0 &&
          ![roomStatus.clean, roomStatus.reserved].includes(this.activeRoom.status)) {
          this.$message.warning('请选择空净房');
          return;
        }
        this.$refs.checkInModal.show({
          item: {
            hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId,
            hotelUserId: this.userInfo.id,
            orderType: orderType.hotel
          },
          activeRoom: this.activeRoom,
          confirmFn: () => {
            this.getList();
          }
        });
      }
    },
    statusStat () {
      this.$ajax.get({
        apiKey: 'roomStatusStat',
        params: {
          hotelId: this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId
        }
      }).then(data => {
        this.allRoomCount = (data || []).reduce((pre, cur) => pre + cur.cnt, 0);
        this.stayCount = (data || []).filter(item => [roomStatus.live, roomStatus.hourRoom].includes(item.status)).reduce((pre, cur) => pre + cur.cnt, 0);
      }).catch(() => {
        this.allRoomCount = 0;
        this.stayCount = 0;
      });
    },
    getTools () {
      this.$ajax.get({
        apiKey: 'userTools',
        loading: false,
        params: {
          hotelUserId: this.userInfo.id
        }
      }).then(data => {
        this.functionList = (data.map(item => ({
          ...item,
          icon: functionMapList.find(tool => tool.name === item.id).icon
        })) || []).concat({
          id: functionType.addTool,
          name: '添加工具',
          ord: 0,
          icon: 'icon-15'
        });
      }).catch(() => {
        this.functionList = [{
          id: functionType.addTool,
          name: '添加工具',
          ord: 0,
          icon: 'icon-15'
        }];
        this.$message.error('获取工具列表失败');
      });
    },
    delTool (item) {
      this.$refs.confirmModal.show({
        title: '警告',
        content: `是否删除 ${item.name}`,
        confirm: () => {
          this.$ajax.post({
            apiKey: 'userRemoveTool',
            params: {
              hotelUserId: this.userInfo.id,
              toolId: item.id
            }
          }).then(() => {
            this.getTools();
          }).catch(() => {
            this.$message.error('删除失败');
          });
        }
      });
    },
    changeStatus (item) {
      this.$refs.changeStatusModal.show({
        item,
        confirmFn: () => {
          this.getList();
        }
      });
    }
  },
  mounted () {
    this.getTools();
    if (!this.showOrgTree) {
      this.getList();
      this.getFloors(this.showOrgTree ? this.nodeData.id : this.userInfo.hotelId);
    }
  }
};
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/scss/base";
  .flex-box {
    height: 100%;

    .operation-wrapper {
      @include flex_layout(row, flex-start, center);
      height: 100px !important;
      overflow-y: auto;

      .operate-btn {
        @include flex_layout(column, center, center);
        margin-right: 15px;
        width: 80px;
        height: 80px;
        cursor: pointer;
        white-space: nowrap;
        .icon-wrapper {
          @include flex_set(0, 1, auto);
          @include flex_layout(row, center, center);
          position: relative;
          margin-bottom: 5px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: $normalGreen;
          color: #FFFFFF;
          i {
            margin-top: -2px;
            font-size: 25px;
          }
          &:hover {
            .del-icon {
              display: block;
            }
          }
          .del-icon {
            position: absolute;
            display: none;
            width: 15px;
            height: 15px;
            right: 0;
            top: 0;
            transition: all .1s;
            &:hover {
              width: 19px;
              height: 19px;
              right: -2px;
              top: -2px;
            }
          }
        }
      }
    }
    .list-wrapper {
      height: calc(100% - 150px);

      .floor-pagenation {
        @include flex_layout(column, flex-start, center);
        height: 100%;
        overflow-y: auto;
        background-color: $lightGray;

        .page-item {
          margin: 3px 3px 3px 3px;
          writing-mode: sideways-rl;
          vertical-align: middle;
          padding: 10px 3px;
          text-align: center;
          background-color: $lightGreen;
          cursor: pointer;

          &.active-page-num {
            background-color: $normalGreen;
          }
        }
      }

      .room-list {
        @include flex_layout(row, flex-start, flex-start);
        margin-left: 10px;
        flex-wrap: wrap;
        overflow-y: auto;

        .room-block {
          box-sizing: border-box;
          margin: 10px 10px 10px 0;
          padding: 10px 10px;
          height: 90px;
          width: 90px;
          font-size: 16px;
          background-color: $lightGreen;
          border-radius: 4px;
          cursor: pointer;

          .status-btn {
            font-size: 14px;
            color: #2d8cf0;
            cursor: pointer;
          }

          &.active {
            opacity: .6;
          }
        }
      }
    }

    .footer-operator {
      @include flex_layout(row, flex-start, flex-end);
      height: 50px;
      overflow-y: auto;

      .filter-item {
        @include flex_set(1, 0, auto);
        @include flex_layout(row, center, center);
        margin-right: 10px;
        width: auto !important;
        padding: 5px 0;
        height: 42px;
        white-space: nowrap;

        .filter-btn {
          padding: 0 10px;
          line-height: 32px;
          cursor: pointer;
        }
      }
    }
  }
</style>
