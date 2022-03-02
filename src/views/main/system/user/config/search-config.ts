import { IForm } from '@/base-ui/form/types'

export const searchFormConfig: IForm = {
  formItem: [
    { type: 'input', label: '用户名', placeholder: '请输入用户名' },
    { type: 'password', label: '密码', placeholder: '请输入密码' },
    {
      type: 'select',
      label: '喜欢的运动',
      placeholder: '请输入密码',
      options: [
        { option: '篮球', value: 'basketball' },
        { option: '足球', value: 'football' }
      ]
    },
    {
      type: 'data',
      label: '时间',
      otherOptions: {
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        type: 'daterange'
      }
    }
  ],
  labelWidth: '110px',
  itemStyle: { padding: '20px 40px' },
  colLayout: {
    xl: 8,
    lg: 8,
    md: 12,
    sm: 24,
    xs: 24
  }
}
