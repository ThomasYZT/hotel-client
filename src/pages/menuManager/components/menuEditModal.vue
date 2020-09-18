<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加菜单' : '编辑菜单'"
               :visible.sync="visible"
               width="40%"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="80"
                  label-position="left">
            <div class="form-item-wrapper">
              <FormItem label="父级菜单" prop="parentId">
                <i-select v-model="formData.parentId" placeholder="请选择父级菜单">
                  <i-option v-for="item in menuList" :value="item.id" :key="item.id">{{ item.menuName }}</i-option>
                </i-select>
              </FormItem>
              <FormItem label="菜单名称" prop="menuName">
                <i-input type="text" placeholder="菜单名称" v-model="formData.menuName" />
              </FormItem>
              <FormItem label="菜单链接" prop="url">
                <i-input type="text" placeholder="url" v-model="formData.url" />
              </FormItem>
            </div>
          </i-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button class="dialog-cancel-btn" @click="cancel">取 消</i-button>
        <i-button class="dialog-confirm-btn" type="primary" @click="confirm">确 定</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultsDeep from 'lodash/defaultsDeep';
export default {
  name: 'menuEditModal',
  props: {
    menuList: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    const validateParentId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择父级菜单'));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      isLoading: false,
      type: '',
      editItem: {},
      formData: {
        parentId: '0',
        menuName: '',
        url: ''
      },
      formRule: {
        parentId: [
          { validator: validateParentId, trigger: 'blur' }
        ],
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入url', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ type = '', item }) {
      if (!type || (type === 'edit' && !item)) return;
      if (type === 'edit') {
        this.formData = defaultsDeep({}, item);
      }
      this.type = type;
      this.visible = true;
    },
    cancel () {
      this.reset();
    },
    confirm () {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.addMenu();
        }
      });
    },
    addMenu () {
      const formData = {
        ...this.formData
      };
      this.$ajax.get('menuAdd', formData, null, true, false).then(() => {
        this.$message.success('添加成功');
        this.reset();
      }).catch(err => {
        this.$message.error(`添加失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        parentId: '0',
        menuName: '',
        url: ''
      };
      this.visible = false;
      this.editItem = {};
      this.isLoading = false;
      this.type = '';
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.dialog-wrapper {
  @include flex_layout(row, center, center);
  .form-wrapper {
    width: 70%;
  }
}

</style>
