export interface IFormItem {
  field: any
  type: any
  label: string
  placeholder?: any
  options?: any
  otherOptions?: any
}

export interface IForm {
  formItems: IFormItem[]
  labelWidth?: string
  itemStyle?: any
  colLayout?: any
}
