<template>
  <div class="area-selector">
    <el-cascader v-if="!reset"
                 style="width: 100%;"
                 ref="ElCascader"
                 clearable
                 :options="options"
                 v-model="area"
                 :props="propsConfig"></el-cascader>
  </div>
</template>

<script>
export default {
  name: 'AreaSelector',
  props: {
    value: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data () {
    return {
      propsConfig: {
        value: 'id',
        label: 'name',
        lazy: true,
        lazyLoad: this.lazyLoad
      },
      provinceData: [],
      cityData: [],
      countyData: [],
      options: [],
      area: [],
      reset: false
    };
  },
  methods: {
    lazyLoad (node, resolve) {
      const { level, value } = node;
      if (level === 0) {
        this.getProvinces().then(data => {
          resolve(data);
        });
      } else if (level === 1) {
        this.getCity(value).then(data => {
          resolve(data);
        });
      } else {
        this.getCounty(value).then(data => {
          resolve(data);
        });
      }
    },
    getCity (pid) {
      return this.$ajax.get({
        apiKey: 'globalGetCity',
        params: { pid },
        loading: false
      }).then(data => {
        this.cityData = data || [];
        return this.cityData;
      }).catch(err => {
        this.$message.error(`获取区域信息失败${err.msg ? ': ' + err.msg : ''}`);
        return [];
      });
    },
    getCounty (pid) {
      return this.$ajax.get({
        apiKey: 'globalGetCounty',
        params: { pid },
        loading: false
      }).then(data => {
        this.countyData = data || [];
        this.countyData.forEach(item => { item.leaf = true; });
        return this.countyData;
      }).catch(err => {
        this.$message.error(`获取区域信息失败${err.msg ? ': ' + err.msg : ''}`);
        return [];
      });
    },
    getProvinces () {
      return this.provinceData.length > 0 ? Promise.resolve(this.provinceData) : this.$ajax.get({
        apiKey: 'globalGetProvinces',
        loading: false
      }).then(data => {
        this.provinceData = data || [];
        return this.provinceData;
      }).catch(err => {
        this.$message.error(`获取区域信息失败${err.msg ? ': ' + err.msg : ''}`);
        return [];
      });
    },
    setDefault (area) {
      let proviceItem = null;
      let cityItem = null;
      this.getProvinces().then((data) => {
        this.options = data;
        const index = data.findIndex(item => item.id === area[0]);
        proviceItem = data[index];
        this.getCity(area[0]).then((data) => {
          cityItem = data.find(item => item.id === area[1]);
          proviceItem.children = data;
          this.getCounty(area[1]).then((data) => {
            cityItem.children = data;
            this.area = area;
            this.reset = true;
            this.$nextTick(() => {
              this.reset = false;
            });
          });
        });
      });
    }
  },
  watch: {
    area: {
      handler (newVal) {
        this.$emit('input', newVal);
        if (newVal.length === 0) {
          this.options = [];
        }
      }
    },
    value: {
      handler (newVal) {
        this.area = newVal;
        if (newVal.length === 0) {
          this.reset = true;
          this.options = [];
          this.$nextTick(() => {
            this.reset = false;
          });
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-input__inner {
  height: 32px;
}
</style>
