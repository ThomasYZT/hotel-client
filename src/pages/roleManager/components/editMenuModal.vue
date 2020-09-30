<template>
  <div class="modal-wrapper">
    <el-dialog title="编辑菜单"
               :visible.sync="visible"
               width="30%"
               center>
      <div class="dialog-wrapper">
        <el-tree v-if="visible"
                 ref="Tree"
                 :data="allMenuList"
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
        <i-button class="dialog-cancel-btn" @click="cancel">取 消</i-button>
        <i-button class="dialog-confirm-btn" type="primary" @click="confirm">确 定</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { arrayToTree } from '../../../assets/share/utils';
export default {
  data () {
    return {
      visible: false,
      isLoading: false,
      treeProps: {
        children: 'children',
        label: 'menuName'
      },
      item: null,
      allMenuList: [],
      roleMenuList: []
    };
  },
  methods: {
    show ({ item }) {
      this.item = item;
      Promise.all([
        this.getList(),
        this.getRoleMenu()
      ]).then(() => {
        this.visible = true;
        this.$nextTick(() => {
          const menuIds = this.roleMenuList.map(item => item.id);
          this.$refs.Tree.setCheckedKeys(menuIds);
        });
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },

    getList () {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'menuAllList'
        }).then(data => {
          this.allMenuList = arrayToTree({ data });
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    },
    getRoleMenu () {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'roleMenuList',
          params: {
            roleId: this.item.id
          }
        }).then(data => {
          this.roleMenuList = data;
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
      const menuIds = this.$refs.Tree.getCheckedKeys();
      this.$ajax.post({
        apiKey: 'roleSetMenu',
        params: {
          roleId: this.item.id,
          menuIds: menuIds.join(',')
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
      this.allMenuList = [];
      this.roleMenuList = [];
      this.visible = false;
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.dialog-wrapper {
  max-height: 300px;
  overflow-y: auto;
}

</style>
