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
  props: {
    position: {
      type: Object,
      default () {
        return {
          x: 0,
          y: 0
        };
      }
    }
  },
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

      map.on('click', (e) => {
        this.$emit('change', {
          x: String(e.pos[0]),
          y: String(e.pos[1])
        });
      });

      AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], () => {
        const auto = new AMap.AutoComplete(autoOptions);
        const placeSearch = new AMap.PlaceSearch({
          map: map
        }); // 构造地点查询类
        auto.on('select', (e) => {
          if (!e.poi.location) {
            this.$message.warning('无法获取精确位置，请在地图上点击选择');
          } else {
            this.$emit('change', {
              x: String(e.poi.location.lat),
              y: String(e.poi.location.lng)
            });
          }

          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name, (status, result) => {
            map.getAllOverlays().forEach(mark => {
              mark.on('click', (e) => {
                this.$emit('change', {
                  x: String(e.pos[0]),
                  y: String(e.pos[1])
                });
              });
            });
          });
        });
      });
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initMap();
    });
  }
};
</script>

<style scoped lang="scss">
#container {
  width: 100%;
  height: calc(250px);
}
#tipinput {
  margin-bottom: 10px;
  display: inline-block;
  width: 100%;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 14px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #333333;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border 0.2s
}
</style>
