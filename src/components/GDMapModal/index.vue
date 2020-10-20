<template>
  <el-dialog :visible.sync="visible"
             title="地图"
             width="30%"
             :close-on-click-modal="false"
             custom-class="form-dialog"
             @close="cancel"
             center>

    <div class="map-wrapper">
      <div v-if="visible" id="container" style="width:100%; height:250px"></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <i-button style="margin-right: 10px" type="primary" @click="comfirm">确 定</i-button>
      <i-button @click="cancel">取 消</i-button>
    </span>
  </el-dialog>
</template>

<script>
import AMap from 'AMap';
export default {
  name: 'MapModal',
  data () {
    return {
      visible: false
    };
  },
  methods: {
    show () {
      this.visible = true;
      this.$nextTick(() => {
        this.initMap();
      });
    },
    initMap () {
      // 初始化地图对象，加载地图
      const map = new AMap.Map('container', {
        resizeEnable: true
      });
      const options = {
        enableHighAccuracy: true,
        showButton: true, // 是否显示定位按钮
        buttonPosition: 'LB', // 定位按钮的位置
        /* LT LB RT RB */
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮距离对应角落的距离
        showMarker: true, // 是否显示定位点
        markerOptions: { // 自定义定位点样式，同Marker的Options
          offset: new AMap.Pixel(-18, -36),
          content: '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
        },
        showCircle: true, // 是否显示定位精度圈
        circleOptions: { // 定位精度圈的样式
          strokeColor: '#0093FF',
          noSelect: true,
          strokeOpacity: 0.5,
          strokeWeight: 1,
          fillColor: '#02B0FF',
          fillOpacity: 0.25
        }
      };
      AMap.plugin(['AMap.Geolocation'], function () {
        const geolocation = new AMap.Geolocation(options);
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
      });
    },
    comfirm () {

    },
    cancel () {
      this.visible = false;
    }
  }
};
</script>

<style scoped lang="scss">
#container{
  height:100%;
}
</style>
