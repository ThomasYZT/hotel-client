<template>
  <div class="map-container">
    <div id="myPageTop">
      <input id="tipinput"/>
    </div>
    <div id="container"></div>

  </div>
</template>

<script>
import AMap from 'AMap';
export default {
  name: 'PlaceSearch',
  methods: {
    initMap () {
      // 地图加载
      const map = new AMap.Map('container', {
        resizeEnable: true
      });
        // 输入提示
      const autoOptions = {
        input: 'tipinput'
      };

      AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
        const auto = new AMap.AutoComplete(autoOptions);
        const placeSearch = new AMap.PlaceSearch({
          map: map
        }); // 构造地点查询类
        auto.on('select', select);// 注册监听，当选中某条记录时会触发
        function select (e) {
          console.log(e)
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name); // 关键字查询查询
        }
      });
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initMap();
    })
  }
};
</script>

<style scoped lang="scss">
#container {
  width: 100%;
  height: 300px;
}
</style>
