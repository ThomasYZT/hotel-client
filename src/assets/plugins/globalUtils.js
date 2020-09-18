// 自定义element-ui主题
import '../../assets/styles/theme/viewUITheme/index.less';
import TableCom from '../../components/TableCom';
import Breadcrumb from '../../components/Breadcrumb';
import confirmModal from '../../components/confirmModal';
import ajax from '../../assets/api';

export default {
  install: (Vue) => {
    Vue.component(TableCom.name, TableCom);
    Vue.component(Breadcrumb.name, Breadcrumb);
    Vue.component(confirmModal.name, confirmModal);

    Vue.prototype.$ajax = ajax;
  }
};
