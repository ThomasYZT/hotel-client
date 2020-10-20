<template>
  <div class="upload-wrapper">
    <i-upload multiple
              action="http://139.155.42.50:8080/common/upload"
              :show-upload-list="false"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :data="{
                attchType: attachType.file
              }"
              :headers="{
                methods: 'POST'
              }">
      <i-button>上传文件</i-button>
    </i-upload>
    <div class="file-list-wrapper">
      <div class="file-item"
           v-for="(item, index) in uploadList"
           :key="item.id">
        <div @click="downloadItem(item)">
          <i class="iconfont icon-wenjian"></i>
          <span>{{item.name}}</span>
        </div>
        <i class="iconfont icon-close" @click="delItem(index)"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { attachType } from '../../assets/enums';
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  name: 'FileUploader',
  props: {
    value: {
      type: Array,
      default () {
        return [];
      }
    },
    maxFileNum: {
      type: Number,
      default: 10
    },
    maxFileSize: {
      type: Number,
      default: 5120
    }
  },
  data () {
    return {
      attachType,
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
    },
    handleSuccess (res, file) {
      this.$message.success('上传成功');
      this.getAttachInfo(res.data).then(attachList => {
        this.uploadList.push({
          name: file.name,
          attachId: res.data,
          ...attachList[0]
        });
        this.$emit('change', this.uploadList);
      }).catch(err => {
        this.$message.error('获取附件信息失败');
      });
    },
    handleFormatError () {
      this.$message.success('文件格式错误');
    },
    handleMaxSize () {
      this.$message.warning(`文件大小不能超过5M`);
    },
    downloadItem (item) {
      console.log(item)
    },
    delItem (index) {
      this.uploadList.splice(index, 1);
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
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.file-list-wrapper {
  @include flex_layout(column, center, flex-start);
  .file-item {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .icon-close {
      &:hover {
        font-weight: bold;
      }
    }
  }
}

</style>
