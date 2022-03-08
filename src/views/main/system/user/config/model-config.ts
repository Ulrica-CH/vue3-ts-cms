import { IForm } from '@/base-ui/form'

export const modelDIalogConfig: IForm = {
  formItems: [
    {
      field: 'name',
      type: 'input',
      label: '用户名',
      placeholder: '请输入用户名'
    },
    {
      field: 'realname',
      type: 'input',
      label: '真实姓名',
      placeholder: '请输入真实姓名'
    },
    {
      field: 'password',
      type: 'password',
      label: '密码',
      placeholder: '请输入密码',
      isHidden: false
    },
    {
      field: 'cellphone',
      type: 'input',
      label: '手机号',
      placeholder: '请输入手机号'
    },
    {
      field: 'department',
      type: 'select',
      label: '所属部门',
      placeholder: '请选择部门',
      options: []
    },
    {
      field: 'role',
      type: 'select',
      label: '所属角色',
      placeholder: '请选择角色',
      options: []
    }
  ],
  itemStyle: {},
  colLayout: {
    span: 24
  },
  labelWidth: '80px'
}
