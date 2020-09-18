<template>
  <div class="table-wrapper">
    <el-table size="medium"
              :data="data"
              :height="height"
              :rowKey="rowKey"
              :treeProps="treeProps"
              :lazy="lazy"
              :loadFn="loadFn"
              :indent="indent"
              header-row-class-name="custom-header-row"
              header-cell-class-name="custom-header-cell"
              row-class-name="custom-row"
              cell-class-name="custom-cell">
      <slot v-for="(item, index) in config"
            :item="item"
            :name="`col${index}`">
        <el-table-column :key="index"
                         :prop="item.prop"
                         :label="item.label"
                         :width="item.width || ''">
        </el-table-column>
      </slot>

      <template slot="empty">
        <div class="empty-content">
          暂无数据
        </div>
      </template>
    </el-table>

    <div v-if="hasPage && data.length > 0" class="pagination-wrapper">
      <el-pagination @size-change="sizeChange"
                     @current-change="getList"
                     :current-page.sync="curPage"
                     :page-size.sync="pageSize"
                     :page-sizes="[10, 20, 30]"
                     layout="全部, 页码, prev, pager, next, jumper"
                     :total="totalCount" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableCom',
  props: {
    config: {
      type: Array,
      default () {
        return [];
      }
    },
    data: {
      type: Array,
      default () {
        return [];
      }
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    totalCount: {
      type: Number,
      default: 0
    },
    getList: {
      type: Function,
      default: () => {}
    },

    height: {
      type: String,
      default: '100%'
    },
    hasPage: {
      type: Boolean,
      default: true
    },
    isTree: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    treeProps: {
      type: Object,
      default () {
        return { children: 'children', hasChildren: 'hasChildren' };
      }
    },
    lazy: {
      type: Boolean,
      default: false
    },
    loadFn: {
      type: Function,
      default: () => {}
    },
    indent: {
      type: Number,
      default: 16
    }
  },
  data () {
    return {
      curPage: 1
    };
  },
  methods: {
    sizeChange (val) {
      this.$emit('pageSize:update', val);
    }
  },
  created () {
    this.getList();
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.table-wrapper {
  width: 100%;
  height: 100%;

  .empty-content {
    width: 100%;
    height: 100%;
    @include flex_layout(row, center, center);
  }

  /deep/ .custom-header-row {
    .custom-header-cell {
       .cell {
        padding: 0 ;
      }
    }
  }

  /deep/ .custom-row {
    .custom-cell {
      .cell {
        padding: 0;
      }
    }
  }
}
</style>
