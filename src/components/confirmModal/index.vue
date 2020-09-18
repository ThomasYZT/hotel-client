<template>
  <div class="modal-wrapper">
    <el-dialog :title="title"
               :visible.sync="visible"
               width="20%"
               center>
      <div class="dialog-wrapper">
        <span>{{content}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <i-button class="dialog-cancel-btn" @click="cancel">取 消</i-button>
        <i-button class="dialog-confirm-btn" type="primary" @click="confirm">确 定</i-button>
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
  .dialog-wrapper {
    @include flex_layout(row, center, center);
    min-height: 70px;
  }

</style>
