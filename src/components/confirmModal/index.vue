<template>
  <div class="modal-wrapper">
    <el-dialog :title="title"
               :visible.sync="visible"
               width="30%">
      <span>{{content}}</span>
      <span slot="footer" class="dialog-footer">
        <i-button style="margin-right: 10px" type="primary" @click="confirm">确 定</i-button>
        <i-button @click="cancel">取 消</i-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'confirmModal',
  data () {
    return {
      visible: false,
      title: '',
      content: '',
      confirmFn: null,
      cancelFn: null
    };
  },
  methods: {
    show ({ title = '提示', content = '', confirm = () => {}, cancel = () => {} }) {
      this.title = title;
      this.content = content;
      this.confirmFn = confirm;
      this.cancelFn = cancel;
      this.visible = true;
    },
    cancel () {
      this.cancelFn && this.cancelFn();
      this.reset();
    },
    confirm () {
      this.confirmFn && this.confirmFn();
      this.reset();
    },
    reset () {
      this.title = '';
      this.content = '';
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
/deep/ .el-dialog {
  padding: 0 10px;
  border-radius: 5px;
  .el-dialog__header {
    padding: 15px 10px 10px;
    border-bottom: 1px solid #bfbfbf;
  }
  .el-dialog__body {
    padding: 15px 10px 10px;
  }
}
</style>
