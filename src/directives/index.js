import Vue from 'vue'
import question from '@/api/constant/question'
const directiveObj = {
  subjectAndStep: {
    inserted(dom, obj) {
      // 前段.初级
      dom.innerText = obj.value.subject_name + '.' + question.stepList.find(i => +i.id === +obj.value.step).name
    },
    componentUpdated(dom, obj) {
      dom.innerText = obj.value.subject_name + '.' + question.stepList.find(i => +i.id === +obj.value.step).name
    }
  },
  formated: {
    inserted(dom, obj) {
      dom.innerText = question[obj.arg].find(i => +i.id === obj.value).name
    },
    componentUpdated(dom, obj) {
      dom.innerText = question[obj.arg].find(i => +i.id === obj.value).name
    }
  }
}
Object.entries(directiveObj).forEach(key => {
  Vue.directive(key[0], key[1])
})
