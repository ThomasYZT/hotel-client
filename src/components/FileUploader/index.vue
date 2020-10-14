<template>
  <div class="upload-wrapper">
    <i-upload multiple
              action="http://139.155.42.50:8080/common/upload"
              :data="{
                attchType: 1
              }"
              :headers="{
                methods: 'POST'
              }"
              :before-upload="handleBeforeUpload">
      <i-button>上传文件</i-button>
    </i-upload>
  </div>
</template>

<script>
export default {
  name: 'FileUploader',
  props: {
    maxFileNum: {
      type: Number,
      default: 5
    }
  },
  data () {
    return {
      uploadList: []
    };
  },
  methods: {
    handleBeforeUpload () {
      const check = this.uploadList.length < this.maxFileNum;
      if (!check) {
        this.$message.warning(`最多上传${this.maxFileNum}个文件`);
      }
      return check;
    }
  }
};
</script>

<style scoped>

</style>
