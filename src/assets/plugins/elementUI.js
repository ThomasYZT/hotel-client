// 自定义element-ui主题
import {
  Checkbox,
  Table,
  TableColumn,
  Pagination,
  Icon,
  Tree,
  Dialog,
  Cascader
} from 'element-ui';
import '../../assets/styles/theme/elementTheme/index.scss';

export default {
  install: (Vue) => {
    Vue.use(Checkbox);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Pagination);
    Vue.use(Icon);
    Vue.use(Tree);
    Vue.use(Dialog);
    Vue.use(Cascader);
  }
};
