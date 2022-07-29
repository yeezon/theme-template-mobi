
import SubView from './View/SubView'
import ScrollView from './View/ScrollView'
import Icons from './Icons'
import Icon from './Icon/Icon'
import Currency from './Currency/Currency'
import Cell from './Cell/Cell'
import Radio from './Radio/Radio'
import RadioGroup from './Radio/RadioGroup'
// import RadioButton from './Radio/radio-button'
import Button from './Button/Button'
import Popup from './Popup/Popup'
import NavBar from './NavBar'
import NavBack from './NavBack/Index'
import Form from './Form/Form'
import Group from './Group/Group'
import Field from './Field/Field'
import Switch from './Switch/Switch'
import AreaPicker from './Picker/Area'
import Tabs from './Tabs/Tabs'
import TabPane from './Tabs/Pane'
import Quantity from './Quantity/Quantity'
import Slides from './Slides'
import Items from './Items/Index'

import ToastInit from './Toast'
import ConfirmInit from './Confirm'

import LowerTips from './Other/LowerTips'
import Loading from './Other/Loading'
import LoadTips from './Other/LoadTips'
import StatusTips from './Other/StatusTips'

import Header from './Other/Header'
import StatusBar from './Other/StatusBar'
import HomeIndicator from './Other/HomeIndicator'

const componentDefs = [
  SubView,
  ScrollView,
  Icons,
  Icon,
  Currency,
  Cell,
  Radio,
  RadioGroup,
  Button,
  Popup,
  NavBar,
  NavBack,
  Form,
  Group,
  Field,
  Switch,
  AreaPicker,
  Tabs,
  TabPane,
  Quantity,
  Slides,
  Items,
  LowerTips,
  Loading,
  LoadTips,
  StatusTips,
  Header,
  StatusBar,
  HomeIndicator
]

const install = function (Vue, options) {
  if (install.installed) return

  for (const oComDef of componentDefs) {
    Vue.component(oComDef.name, oComDef)
  }

  // 放在后面，避免引用了还没注册的组件报错
  Vue.prototype.$toast = ToastInit(Vue)
  Vue.prototype.$confirm = ConfirmInit(Vue)

  install.installed = true
}

export default {
  install,
  SubView,
  ScrollView,
  Icons,
  Icon,
  Currency,
  Cell,
  Radio,
  RadioGroup,
  Button,
  Popup,
  NavBar,
  NavBack,
  Form,
  Group,
  Field,
  Switch,
  AreaPicker,
  Tabs,
  TabPane,
  ToastInit,
  ConfirmInit,
  Quantity,
  Slides,
  Items,
  LowerTips,
  Loading,
  LoadTips,
  StatusTips,
  Header,
  StatusBar,
  HomeIndicator
}

// export View 的方式，避免单独引用输出多余代码？
