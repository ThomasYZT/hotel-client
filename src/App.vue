<template>
  <div id="app">
    <router-view v-if="noFrame"/>
    <mainFrame v-else>
      <template slot="router">
        <transition name="el-fade-in">
          <router-view></router-view>
        </transition>
      </template>
    </mainFrame>
  </div>
</template>

<script>
import mainFrame from './components/Layout/mainFrame';
export default {
  components: {
    mainFrame
  },
  computed: {
    noFrame () {
      return !!this.$route.meta.noFrame;
    }
  },
  data () {
    return {};
  },
  methods: {},
  mounted () {}
};
</script>

<style scoped lang="scss">
  #app {
    height: 100%;
    width: 100%;
  }
</style>
