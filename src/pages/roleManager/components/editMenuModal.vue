<template>
  <div class="modal-wrapper">
    <el-dialog title="配置菜单"
               :visible.sync="visible"
               width="350px"
               custom-class="form-dialog"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
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
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
        <i-button @click="cancel">取 消</i-button>
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
/deep/ .el-dialog__body {
  padding: 25px 0 30px;
}
.dialog-wrapper {
  @include flex_layout(row, center, flex-start);
  padding: 0 25px 0;
  .form-wrapper {
    width: 100%;

    .form-item-wrapper {

      .form-item-block {
        margin-right: 20px;
        max-height: 400px;
        overflow-y: auto;
        font-size: 13px;
        color: #333333;

        .form-item-block-title {
          font-size: 16px;
          margin-bottom: 10px;
        }

        &:last-child {
          margin: 0;
        }
      }
    }
  }
}

</style>
