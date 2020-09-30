// 自定义element-ui主题
import '../../assets/styles/theme/viewUITheme/index.less';
import TableCom from '../../components/TableCom';
import Breadcrumb from '../../components/Breadcrumb';
import confirmModal from '../../components/confirmModal';
import orgTree from '../../components/orgTree';
import NoData from '../../components/noData';
import ImgUploader from '../../components/ImgUploader';
import validator from '../share/validator';
import globalUtil from '../share/globalUtil';
import ajax from '../../assets/api';

export default {
  install: (Vue) => {
    Vue.component(TableCom.name, TableCom);
    Vue.component(Breadcrumb.name, Breadcrumb);
    Vue.component(confirmModal.name, confirmModal);
    Vue.component(orgTree.name, orgTree);
    Vue.component(NoData.name, NoData);
    Vue.component(ImgUploader.name, ImgUploader);

    Vue.prototype.$ajax = ajax;
    Vue.prototype.$validator = validator;
    Vue.prototype.$util = globalUtil;
  }
};
