<template>
  <div class="modal-wrapper">
    <el-dialog title="选择角色"
               :visible.sync="visible"
               :close-on-click-modal="false"
               custom-class="form-dialog"
               width="300px"
               @close="cancel"
               center>
      <div class="dialog-wrapper">
        <el-tree v-if="visible"
                 ref="Tree"
                 :data="allList"
                 :props="treeProps"
                 :highlight-current="false"
                 :expand-on-click-node="false"
                 :check-on-click-node="false"
                 node-key="id"
                 style="width: 100%;"
                 show-checkbox
                 default-expand-all>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      isLoading: false,
      treeProps: {
        children: 'children',
        label: 'roleName'
      },
      item: null,
      allList: [],
      userRoleList: []
    };
  },
  methods: {
    show ({ item }) {
      this.item = item;
      Promise.all([
        this.getList(),
        this.getUserRole()
      ]).then(() => {
        this.visible = true;
        this.$nextTick(() => {
          const roleIds = this.userRoleList.map(item => item.id);
          this.$refs.Tree.setCheckedKeys(roleIds);
        });
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    getList () {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'userGetAllRoleList',
          params: {
            hotelUserId: this.item.id
          }
        }).then(data => {
          this.allList = data;
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    },
    getUserRole () {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'userRoleList',
          params: {
            hotelUserId: this.item.id
          }
        }).then(data => {
          this.userRoleList = data;
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    },
    cancel () {
      this.reset();
    },
    confirm () {
      const roleIds = this.$refs.Tree.getCheckedKeys();
      this.$ajax.post({
        apiKey: 'userSetRole',
        params: {
          hotelUserId: this.item.id,
          roleIds: roleIds.join(',')
        }
      }).then(() => {
        this.reset();
        this.$message.success('设置成功');
      }).catch(err => {
        this.$message.error(`设置失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.item = null;
      this.allList = [];
      this.userRoleList = [];
      this.visible = false;
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
  @import "~@/assets/styles/scss/base";
  .dialog-wrapper {
    max-height: 400px;
    overflow-y: auto;
  }

</style>
