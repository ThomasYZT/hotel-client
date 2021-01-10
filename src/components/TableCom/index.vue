<template>
  <div class="table-wrapper">
    <el-table ref="Table"
              border
              stripe
              v-if="!reset"
              size="medium"
              :data="data"
              :show-summary="showSummary"
              :summary-method="summaryHandler"
              :height="hasPage && data.length > 0 ? 'calc(100% - 50px)' : '100%'"
              :show-overflow-tooltip="true"
              header-row-class-name="custom-header-row"
              header-cell-class-name="custom-header-cell"
              row-class-name="custom-row"
              cell-class-name="custom-cell"
              @selection-change="onSelectionChange">
      <slot v-for="(item, index) in config"
            :item="item"
            :name="`col${index}`">
        <el-table-column :key="index"
                         :fixed="item.fixed"
                         :min-width="item.minWidth"
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
      <el-pagination @current-change="getList"
                     :current-page.sync="curPage"
                     :page-size.sync="curSize"
                     :page-sizes="[10, 20, 30]"
                     :total="totalSize"
                     layout="total, prev, pager, next"/>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
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
    totalSize: {
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
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summaryHandler: {
      type: Function,
      default () {
        return () => {};
      }
    }
  },
  data () {
    return {
      curPage: this.pageNum,
      curSize: this.pageSize,
      reset: false
    };
  },
  methods: {
    doLayout: debounce(function () {
      this.reset = true;
      this.$nextTick(() => {
        this.reset = false;
      });
    }, 500),
    onSelectionChange (selection) {
      this.$emit('selectChange', selection);
    },
    toggleRowSelections (rows) {
      this.$nextTick(() => {
        rows.forEach(row => {
          this.$refs.Table.toggleRowSelection(row);
        });
      });
    }
  },
  created () {
    this.getList();
  },
  mounted () {
    window.addEventListener('resize', this.doLayout);
  },
  destroyed () {
    window.removeEventListener('resize', this.doLayout);
  },
  watch: {
    data: {
      handler () {
        this.doLayout();
      },
      deep: true
    },
    curSize: {
      handler (val) {
        this.$emit('update:pageSize', val);
      }
    },
    curPage: {
      handler (val) {
        this.$emit('update:pageNum', val);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/scss/base";
.table-wrapper {
  width: 100%;
  height: 100%;
  max-width: 100%;
  /deep/ .el-table__empty-block {
    width: 100% !important;
  }
  .empty-content {
    @include flex_layout(row, center, center);
  }
  .pagination-wrapper {
    @include flex_layout(row, flex-start, flex-end);
    height: 50px;
  }

  /deep/ .custom-header-row {
    background-color: #eff4f8;
  }
}
/deep/ .custom-header-cell {
  background-color: #eff4f8;
}
</style>
