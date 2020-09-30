<template>
  <div class="no-data">
    暂无数据
  </div>
</template>

<script>
export default {
  name: 'NoData'
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.no-data {
  @include flex_layout(row, center, center);
  width: 100%;
  height: 100%;
  color: $normalGray;
}
</style>
