<template>
  <div class="tree-wrapper">
    <el-tree :data="data"
             :node-key="nodeKey"
             default-expand-all
             :expand-on-click-node="expandOnClickNode">
      <span class="tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
              type="text"
              size="mini"
              @click="() => append(data)">
            Append
          </el-button>
          <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
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
    nodeKey: {
      type: Function,
      default () {
        return () => {};
      }
    },
    expandOnClickNode: {
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
