<template>
  <div class="modal-wrapper">
    <el-dialog :title="type === 'add' ? '添加房间信息' : '编辑房间信息'"
               :visible.sync="visible"
               :close-on-click-modal="false"
               width="50%"
               custom-class="form-dialog"
               @close="cancel"
               center>
      <div class="dialog-wrapper">
        <div class="form-wrapper">
          <i-form ref="Form"
                  inline
                  :disabled="isLoading"
                  :model="formData"
                  :rules="formRule"
                  :label-width="100"
                  label-position="right">
            <div class="form-item-wrapper">
              <div class="form-item-block">
                <FormItem class="inline-form-item" label="房间号" prop="roomNumber">
                  <i-input type="text" placeholder="房间号" v-model.trim="formData.roomNumber" />
                </FormItem>
                <FormItem class="inline-form-item" label="房间类型" prop="roomTypeId">
                  <i-select v-model="formData.roomTypeId"
                            placeholder="请选择">
                    <i-option v-for="item in roomTypeList"
                              :value="item.id"
                              :key="item.id">
                      {{ item.typeName }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="楼层" prop="floorId" >
                  <i-select v-model="formData.floorId"
                            placeholder="请选择">
                    <i-option v-for="item in floorList"
                              :value="item.id"
                              :key="item.id">
                      {{ item.dictName }}
                    </i-option>
                  </i-select>
                </FormItem>
                <FormItem class="inline-form-item" label="分机号" prop="phoneExt">
                  <i-input type="text" placeholder="分机号" v-model.trim="formData.phoneExt" />
                </FormItem>
                <FormItem class="block-form-item" label="显示房间属性" prop="isAttribute">
                  <i-switch size="large" :true-value="'0'" :false-value="'1'" v-model="formData.isAttribute">
                    <span slot="open">不显示</span>
                    <span slot="close">显示</span>
                  </i-switch>
                </FormItem>
                <FormItem v-if="roomAttrs && roomAttrs.length > 0"
                          class="block-form-item"
                          prop="attributeList"
                          label="房间属性列表">
                  <i-checkbox-group v-model="attributeList">
                    <i-checkbox v-for="item in roomAttrs"
                                :true-value="1"
                                :false-value="0"
                                :key="item.id"
                                :label="item.id">
                      <span>{{item.dictName}}</span>
                    </i-checkbox>
                  </i-checkbox-group>
                </FormItem>
                <FormItem class="block-form-item" label="描述" prop="remark">
                  <i-input type="textarea" placeholder="描述" v-model.trim="formData.remark" />
                </FormItem>
              </div>
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
import defaultsDeep from 'lodash/defaultsDeep';
import { mapGetters } from 'vuex';
import roomAttrDictionaryMixin from '../../../mixins/roomAttrDictionaryMixin';
export default {
  mixins: [roomAttrDictionaryMixin],
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data () {
    return {
      visible: false,
      isLoading: false,
      type: '',
      editItem: {},
      formData: {
        roomNumber: '',
        roomTypeId: '',
        floorId: '',
        phoneExt: '',
        remark: '',
        isAttribute: 1,
        attributeList: []
      },
      attributeList: [],
      confirmFn: null,
      cancelFn: null,
      formRule: {
        roomNumber: [
          { required: true, message: '请输入房间号', trigger: 'blur' }
        ],
        roomTypeId: [
          { required: true, type: 'number', message: '请选择房间类型', trigger: 'blur' }
        ],
        floorId: [
          { required: true, type: 'number', message: '请选择楼层', trigger: 'blur' }
        ],
        phoneExt: [
          { required: true, message: '请输入分机号', trigger: 'blur' }
        ]
      },
      roomTypeList: [],
      floorList: []
    };
  },
  methods: {
    show ({ type = '', item, roomTypeList, floorList, confirmFn, cancelFn }) {
      if (!type || !item) return;
      this.formData = defaultsDeep({}, item, this.formData);
      this.$util.valueToStr(this.formData, ['roomTypeId', 'floorId']);
      this.roomTypeList = roomTypeList.filter(item => item.id !== 0);
      this.floorList = floorList.filter(item => item.id !== 0);

      this.type = type;
      if (confirmFn) {
        this.confirmFn = confirmFn;
      }

      if (cancelFn) {
        this.cancelFn = cancelFn;
      }
      this.getRoomAttrsList(item.hotelId, false).then(() => {
        if (type === 'add') {
          this.formData.attributeList = this.roomAttrs.map(item => ({
            attributeValue: 0,
            dictionaryId: item.id
          }));
          this.visible = true;
        } else {
          this.getRoomAttrs(item.id).then(data => {
            this.formData.attributeList = data;
            this.attributeList = data.filter(item => item.attributeValue === 1).map(item => item.dictionaryId);
            this.visible = true;
          }).catch(() => {
            this.$message.error('获取房间属性失败');
          });
        }
      });
    },
    cancel () {
      this.cancelFn && this.cancelFn();
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
      this.formData.attributeList.forEach(attr => {
        if (this.attributeList.includes(attr.dictionaryId)) {
          attr.attributeValue = 1;
        } else {
          attr.attributeValue = 0;
        }
      });
      this.$ajax.post({
        apiKey: this.type === 'add' ? 'roomAdd' : 'roomUpdate',
        params: this.formData,
        loading: false,
        config: {
          headers: { 'Content-Type': 'application/json;charset-UTF-8' }
        }
      }).then(() => {
        this.$message.success(this.type === 'add' ? '添加成功' : '编辑成功');
        this.confirmFn && this.confirmFn();
        this.reset();
      }).catch(err => {
        this.$message.error(`${this.type === 'add' ? '添加' : '编辑'}失败${err.msg ? ': ' + err.msg : ''}`);
      });
    },
    reset () {
      this.$refs.Form.resetFields();
      this.formData = {
        roomNumber: '',
        roomTypeId: '',
        floorId: '',
        isAttribute: '1',
        attributeList: []
      };
      this.attributeList = [];
      this.roomTypeList = [];
      this.floorList = [];
      this.confirmFn = null;
      this.cancelFn = null;
      this.visible = false;
      this.isLoading = false;
      this.type = 'add';
    },
    getRoomAttrs (roomId) {
      return new Promise((resolve, reject) => {
        this.$ajax.get({
          apiKey: 'roomAttrsGet',
          params: {
            roomId
          }
        }).then(data => {
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
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
        max-height: 350px;
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
