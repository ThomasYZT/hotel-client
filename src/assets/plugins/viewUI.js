import {
  Tabs,
  TabPane,
  Dropdown,
  DropdownMenu,
  Form,
  FormItem,
  Input,
  Button,
  Checkbox,
  Message,
  Menu,
  MenuItem,
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Select,
  Option,
  Switch,
  Upload,
  Icon,
  Transfer,
  DatePicker,
  Tooltip,
  InputNumber,
  RadioGroup,
  Radio
} from 'view-design';
// 自定义element-ui主题
import '../../assets/styles/theme/viewUITheme/index.less';

export default {
  install: (Vue) => {
    Vue.component(Tabs.name, Tabs);
    Vue.component(TabPane.name, TabPane);
    Vue.component(Dropdown.name, Dropdown);
    Vue.component(DropdownMenu.name, DropdownMenu);
    Vue.component(FormItem.name, FormItem);
    Vue.component(Menu.name, Menu);
    Vue.component(Submenu.name, Submenu);
    Vue.component(Select.name, Select);
    Vue.component(Option.name, Option);

    Vue.component('iForm', Form);
    Vue.component('iInput', Input);
    Vue.component('iButton', Button);
    Vue.component('iCheckbox', Checkbox);
    Vue.component('iMenuItem', MenuItem);
    Vue.component('Message', Message);
    Vue.component('iBreadcrumb', Breadcrumb);
    Vue.component('iBreadcrumbItem', BreadcrumbItem);
    Vue.component('iSelect', Select);
    Vue.component('iOption', Option);
    Vue.component('iSwitch', Switch);
    Vue.component('iUpload', Upload);
    Vue.component('iIcon', Icon);
    Vue.component('iTransfer', Transfer);
    Vue.component('iDatePicker', DatePicker);
    Vue.component('iTooltip', Tooltip);
    Vue.component('iInputNumber', InputNumber);
    Vue.component('iRadioGroup', RadioGroup);
    Vue.component('iRadio', Radio);
    Vue.prototype.$message = Message;

    Message.config({
      top: 70,
      duration: 2
    });
  }
};
