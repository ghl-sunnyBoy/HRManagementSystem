import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import zh from './zh'
import en from './en'
import jsCookie from 'js-cookie'
Vue.use(VueI18n)
const messages = {
  en: {
    message: 'hello',
    ...enLocale, // 或者用 Object.assign({ message: 'hello' }, enLocale)
    ...en
  },
  zh: {
    message: '你好',
    ...zhLocale, // 或者用 Object.assign({ message: '你好' }, zhLocale)
    ...zh
  }
}
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: jsCookie.get('lang') || 'zh', // set locale
  messages // set locale messages
})
export default i18n
