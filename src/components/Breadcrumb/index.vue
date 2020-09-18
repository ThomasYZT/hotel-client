<template>
  <div v-if="matchList.length > 0" class="breadcrumb-wrapper">
    <i-breadcrumb>
      <template v-for="(item, index) in matchList">
        <i-breadcrumb-item :to="index === matchList.length - 1 ? '' : item.path" :key="item.name">
          {{item.meta.menuName}}
        </i-breadcrumb-item>
      </template>
    </i-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Breadcrumb',
  computed: {
    matchList () {
      return this.$route.matched || [];
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
/deep/ .ivu-breadcrumb {
  span {
    &:last-child {
      .ivu-breadcrumb-item-link {
        font-weight: normal;
        color: $normalGreen;
      }
    }
  }
}
</style>
