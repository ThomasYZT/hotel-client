<template>
  <div>
    <div class="demo-upload-list"
         v-for="(item, index) in uploadList"
         :key="index">
      <img v-viewer ref="viewer" :src="item.attchFilePath" alt="">
      <div class="demo-upload-list-cover">
        <i-icon type="ios-eye-outline" @click.native="handleView(index)"></i-icon>
        <i-icon type="ios-trash-outline" @click.native="handleRemove(index)"></i-icon>
      </div>
    </div>
    <i-upload ref="upload"
              :show-upload-list="false"
              :format="fileType"
              :max-size="maxFileSize"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              multiple
              type="drag"
              :action="`${domain}/common/upload`"
              :data="{ attchType: attachType.img }"
              :headers="{ methods: 'POST' }"
              style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <i-icon type="ios-camera" size="20"></i-icon>
      </div>
    </i-upload>
  </div>
</template>
<script>
import { domain } from '../../assets/api';
import { attachType } from '../../assets/enums';
export default {
  name: 'ImgUploader',
  model: {
    prop: 'fileList',
    event: 'change'
  },
  props: {
    fileList: {
      type: Array,
      default () {
        return [];
      }
    },
    fileType: {
      type: Array,
      default () {
        return ['jpg', 'jpeg', 'png'];
      }
    },
    maxFileSize: {
      type: Number,
      default: 2048
    },
    maxFileNum: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      domain,
      attachType,
      uploadList: []
    };
  },
  methods: {
    handleView (index) {
      this.$refs.viewer[index].$viewer.show();
    },
    handleRemove (index) {
      this.uploadList.splice(index, 1);
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < this.maxFileNum;
      if (!check) {
        this.$message.warning(`最多上传${this.maxFileNum}个文件`);
      }
      return check;
    },
    handleSuccess (res, file) {
      this.$message.success('上传成功');
      this.uploadList.push({
        attchFileName: file.name,
        attchFilePath: res.data.path,
        attchType: attachType.file,
        id: res.data.attachId
      });
      this.$emit('change', this.uploadList);
    },
    handleFormatError (file) {
      this.$message.warning(`请选择${this.fileType.join(',')} 类型的图片`);
    },
    handleMaxSize (file) {
      this.$message.warning(`文件大小不能超过2M`);
    },
    getAttachInfo (params) {
      return new Promise((resolve, reject) => {
        let ids;
        if (Object.prototype.toString.apply(params) === '[object Array]') {
          ids = params.join(',');
        } else {
          ids = params;
        }
        if (ids) {
          this.$ajax.get({
            apiKey: 'attachGetByIds',
            params: {
              ids
            }
          }).then(res => {
            resolve(res);
          }).catch(err => {
            reject(err);
          });
        } else {
          reject({ msg: '参数错误' });
        }
      });
    }
  },
  watch: {
    fileList: {
      handler (newVal) {
        this.uploadList = newVal;
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
