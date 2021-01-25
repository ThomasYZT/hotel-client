<template>
  <div class="modal-wrapper">
    <el-dialog title="换房"
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
              <FormItem class="block-form-item" label="房间类型" prop="roomTypeId">
                <i-select v-model="formData.roomTypeId"
                          transfer
                          placeholder="请选择"
                          @on-change="roomTypeChange">
                  <i-option v-for="item in roomTypeList"
                            :value="item.id"
                            :key="item.id">
                    {{ item.typeName }}
                  </i-option>
                </i-select>
              </FormItem>
              <FormItem class="block-form-item" label="房间" prop="roomId">
                <i-select v-model="formData.roomId"
                          transfer
                          placeholder="请选择"
                          @change="roomTypeChange">
                  <i-option v-for="item in roomList"
                            :value="item.id"
                            :key="item.id">
                    {{ item.roomNumber }}
                  </i-option>
                </i-select>
              </FormItem>
              <FormItem class="block-form-item" label="类型" prop="type">
                <i-select v-model="formData.type"
                          transfer
                          placeholder="类型">
                  <i-option v-for="item in ordainRoomTypeList"
                            :value="item.value"
                            :key="item.value">
                    {{ item.label }}
                  </i-option>
                </i-select>
              </FormItem>
              <FormItem class="block-form-item" label="入住人数" prop="num">
                <i-input type="text"
                         placeholder="入住人数"
                         v-model.trim="formData.num" />
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
import { ordainRoomTypeList } from '../../../assets/enums';
import { mapActions, mapGetters } from 'vuex';
export default {
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data () {
    return {
      ordainRoomTypeList,
      visible: false,
      isLoading: false,
      formData: {
        roomTypeId: '',
        roomId: ''
      },
      roomTypeList: [],
      roomList: [],
      confirmFn: null,
      formRule: {
        roomTypeId: [
          { required: true, type: 'number', message: '请请选择房间类型', trigger: 'blur' }
        ],
        roomId: [
          { required: true, type: 'number', message: '请选择房间', trigger: 'blur' }
        ],
        type: [
          { required: true, type: 'number', message: '请选择类型', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入入住人数', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapActions([
      'getAllRoomType'
    ]),
    show ({ hotelId, code, confirmFn }) {
      this.hotelId = hotelId;
      this.code = code;
      this.confirmFn = confirmFn;
      this.getAllRoomType(hotelId).then(data => {
        this.roomTypeList = data;
        this.visible = true;
      }).catch(() => {
        this.reset();
        this.$message.error('获取房间类型失败');
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
    getRooms (roomTypeId) {
      this.$ajax.post({
        apiKey: 'roomPageList',
        params: {
          hotelId: this.hotelId,
          pageNum: 1,
          pageSize: 999999,
          roomTypeId
        }
      }).then(data => {
        this.roomList = data.data || [];
        this.formData.roomId = '';
      }).catch(err => {
        this.$message.error(`获取数据失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    roomTypeChange (roomTypeId) {
      this.getRooms(roomTypeId);
    },
    submitForm () {
      const roomTypeItem = this.roomTypeList.find(item => item.id === this.formData.roomTypeId);
      const roomItem = this.roomList.find(item => item.id === this.formData.roomId);
      const formData = {
        ...this.formData,
        code: this.code,
        roomNumber: roomItem?.roomNumber,
        cashPledge: roomTypeItem?.cashPledge,
        price: roomTypeItem?.price,
        roomType: roomTypeItem?.typeName
      };
      this.$ajax.post({
        apiKey: 'orderChangeRoom',
        params: formData,
        loading: false
      }).then(() => {
        this.$message.success('修改成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(res => {
        this.$message.error(`修改失败${res.msg ? ': ' + res.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        roomTypeId: '',
        roomId: ''
      };
      this.confirmFn = null;
      this.hotelId = '';
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
