<template>
  <div class="modal-wrapper">
    <el-dialog title="续房"
               :visible.sync="visible"
               width="30%"
               custom-class="form-dialog"
               @close="cancel"
               :close-on-click-modal="false"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="100"
                  label-position="left">
            <div class="form-item-wrapper">
              <FormItem class="block-form-item" label="续房日期" prop="endDate">
                <i-date-picker v-model="formData.endDate"
                               :editable="false"
                               :options="dateOptions"
                               transfer
                               type="datetime"
                               format="yyyy-MM-dd"
                               style="width: 100%;"
                               placeholder="预计住店开始时间"></i-date-picker>
              </FormItem>
            </div>
          </i-form>
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
  computed: {
    dateOptions () {
      return {
        disabledDate: (date) => {
          return date && date.valueOf() < this.orderInfo.endTime * 1000;
        }
      };
    }
  },
  data () {
    return {
      visible: false,
      isLoading: false,
      formData: {
        endDate: ''
      },
      orderInfo: {},
      roomOverVo: {},
      confirmFn: null,
      formRule: {
        endDate: [
          { required: true, type: 'date', message: '请选择续房时间', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    show ({ orderInfo, roomOverVo, confirmFn }) {
      this.orderInfo = orderInfo;
      this.roomOverVo = roomOverVo;
      this.formData.endDate = new Date(this.$date(this.orderInfo.endTime * 1000).add(1, 'day'));
      this.confirmFn = confirmFn;
      this.$nextTick(() => {
        this.visible = true;
      });
    },
    cancel () {
      this.reset();
    },
    confirm () {
      this.$refs.Form.validate(valid => {
        if (valid) {
          this.submitForm();
        }
      });
    },
    submitForm () {
      this.$ajax.post({
        apiKey: 'orderContinueRoom',
        params: {
          endDate: this.$date(this.formData.endDate).format('YYYY-MM-DD'),
          code: this.orderInfo.code
        },
        config: {
          headers: { 'Content-Type': 'application/json;charset-UTF-8' }
        },
        loading: false
      }).then(() => {
        this.$message.success('续房成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(res => {
        this.$message.error(`续房失败${res.msg ? ': ' + res.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        endDate: ''
      };
      this.orderInfo = {};
      this.roomOverVo = {};
      this.confirmFn = null;
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
