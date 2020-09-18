<template>
  <div class="tree-wrapper">
    <el-tree :props="props"
             :data="data"
             :render-content="renderContent"
             node-key="id"
             default-expand-all
             @node-click="nodeClick">

    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    data: {
      type: Object,
      default () {
        return {};
      }
    },
    nodeClick: {
      type: Function,
      default () {
        return () => {};
      }
    },
    renderContent: {
      type: Function,
      default () {
        return () => {};
      }
    },
    props: {
      type: Object,
      default () {
        return {
          children: 'children',
          label: 'label'
        };
      }
    }
  }
};
</script>

<style scoped lang="scss">

</style>
