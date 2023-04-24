export default {
  stepList: [
    {
      id: 1,
      name: '初级'
    },
    {
      id: 2,
      name: '中级'
    },
    {
      id: 3,
      name: '高级'
    }
  ],
  //	否	int	题目类型:1(单选),2(多选),3(简答)
  typeList: [
    {
      id: 1,
      name: '单选'
    },
    {
      id: 2,
      name: '多选'
    },
    {
      id: 3,
      name: '简答'
    }
  ],
  //    1(简单),2(一般),3(困难)
  difficultyList: [
    {
      id: 1,
      name: '简单'
    },
    {
      id: 2,
      name: '一般'
    },
    {
      id: 3,
      name: '困难'
    }
  ],
  //	否	int	状态:0(禁用),1(启用)
  statusList: [
    {
      id: '0',
      name: '禁用'
    },
    {
      id: '1',
      name: '启用'
    }
  ],
  role_idList: [
    { id: '1', name: '超级管理员' },
    { id: '2', name: '管理员' },
    { id: '3', name: '老师' },
    { id: '4', name: '学生' }
  ]
}
