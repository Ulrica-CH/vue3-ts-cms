//定义校验规则
export const rules = {
  // trigger 什么时候触发 pattern 规则
  name: [
    {
      required: true,
      message: '账号不能为空',
      trigger: 'blur'
    },
    {
      pattern: /^[a-z0-9]{5,10}$/,
      message: '账号为5-10个字符',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    },
    {
      pattern: /^[a-z0-9]{3,16}$/,
      message: '密码为3-16个字符',
      trigger: 'blur'
    }
  ]
}
