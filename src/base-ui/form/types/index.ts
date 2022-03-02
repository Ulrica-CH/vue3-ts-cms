export interface IFormItem {
  type: any
  label: string
  placeholder?: any
  options?: any
  otherOptions?: any
}

export interface IForm {
  formItem: IFormItem[]
  labelWidth?: string
  itemStyle?: any
  colLayout?: any
}
