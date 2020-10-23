<template>
  <div class="upload-wrapper">
    <i-upload multiple
              action="http://139.155.42.50:8080/common/upload"
              :show-upload-list="false"
              :before-upload="handleBeforeUpload"
              :on-success="handleSuccess"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :data="{ attchType: attachType.file }"
              :headers="{ methods: 'POST' }">
      <i-button>上传文件</i-button>
    </i-upload>
    <div class="file-list-wrapper">
      <div class="file-item"
           v-for="(item, index) in uploadList"
           :key="item.id">
        <div @click="downloadItem(item)">
          <i class="iconfont icon-wenjian"></i>
          <span>{{item.attchFileName}}</span>
        </div>
        <!--<a :href="item.attchFilePath" :download="item.attchFileName">{{item.attchFileName}}</a>-->
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
      this.uploadList.push({
        attchFileName: file.name,
        attchFilePath: res.data.path,
        attchType: attachType.file,
        id: res.attachId
      });
      this.$emit('change', this.uploadList);
    },
    handleFormatError () {
      this.$message.success('文件格式错误');
    },
    handleMaxSize () {
      this.$message.warning(`文件大小不能超过5M`);
    },
    downloadItem (item) {
      const aLink = document.createElement('a');
      aLink.href = item.attchFilePath;
      aLink.setAttribute('download', item.attchFileName);
      const evt = document.createEvent('MouseEvents');
      // evt.initEvent('click', false, true);
      // aLink.dispatchEvent(evt);
      aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
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
  },
  watch: {
    value: {
      handler(newVal) {
        this.uploadList = newVal;
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.upload-wrapper {
  @include flex_layout(row, flex-start, flex-start);
}
.file-list-wrapper {
  margin-left: 10px;
  margin-top: -5px;
  @include flex_layout(column, center, flex-start);
  .file-item {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .icon-close {
      margin: 5px 0 0 10px;
      &:hover {
        font-weight: bold;
      }
    }
  }
}

</style>
