<template>
  <div>
    <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
      <template v-if="item.status === 'finished'">
        <img :src="item.url" alt="">
        <div class="demo-upload-list-cover">
          <i-icon type="ios-eye-outline" @click.native="handleView(item.name)"></i-icon>
          <i-icon type="ios-trash-outline" @click.native="handleRemove(item)"></i-icon>
        </div>
      </template>
    </div>
    <i-upload ref="upload"
              :show-upload-list="false"
              :default-file-list="defaultList"
              :format="fileType"
              :max-size="maxFileSize"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              multiple
              type="drag"
              action="http://139.155.42.50:8080/common/upload"
              :headers="{
                methods: 'POST'
              }"
              style="display: inline-block;width:58px;">
      <div style="width: 58px;height:58px;line-height: 58px;">
        <i-icon type="ios-camera" size="20"></i-icon>
      </div>
    </i-upload>
    <el-dialog title="View Image" :visible.sync="visible">
      <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ImgUploader',
  props: {
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
      default: 10
    }
  },
  data () {
    return {
      defaultList: [],
      imgName: '',
      visible: false,
      uploadList: []
    };
  },
  methods: {
    handleView (name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
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
    },
    handleFormatError (file) {
      this.$message.warning(`请选择${this.fileType.join(',')} 类型的图片`);
    },
    handleMaxSize (file) {
      this.$message.warning(`文件大小不能超过2M`);
    },
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList;
  }
};
</script>
<style>
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
