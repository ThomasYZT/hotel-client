<template>
  <div class="modal-wrapper">
    <el-dialog title="挂帐"
               :visible.sync="visible"
               width="30%"
               custom-class="form-dialog"
               @close="cancel"
               :close-on-click-modal="false"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          是否确定挂账？
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
export default {
  data () {
    return {
      visible: false,
      isLoading: false,
      confirmFn: null,
      code: ''
    };
  },
  methods: {
    show ({ code, confirmFn }) {
      this.code = code;
      this.confirmFn = confirmFn;
      this.visible = true;
    },
    cancel () {
      this.reset();
    },
    confirm () {
      this.submitForm();
    },
    submitForm () {
      this.$ajax.post({
        apiKey: 'orderDebtOrder',
        params: {
          code: this.code
        }
      }).then(() => {
        this.$message.success('挂账成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`挂账失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.confirmFn = null;
      this.code = '';
      this.visible = false;
      this.isLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.dialog-wrapper {
  @include flex_layout(row, center, flex-start);
  max-height: 350px;
  overflow-y: auto;
  .form-wrapper {
    width: 90%;
  }
}

</style>
