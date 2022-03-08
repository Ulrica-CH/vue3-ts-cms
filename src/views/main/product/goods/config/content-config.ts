export const contentTableConfig = {
  title: '商品列表',
  //控制序号显示
  showIndex: true,
  //控制是否有选择按钮
  showSelect: true,
  propLists: [
    {
      prop: 'name',
      label: '商品名称',
      minWidth: '80'
    },
    {
      prop: 'oldPrice',
      label: '原始价格',
      minWidth: '80'
    },
    {
      prop: 'newPrice',
      label: '新价格',
      minWidth: '80'
    },
    {
      prop: 'imgUrl',
      label: '图片预览',
      minWidth: '60',
      slotName: 'image'
    },
    {
      prop: 'status',
      label: '状态',
      minWidth: '100',
      slotName: 'status'
    },
    {
      prop: 'createAt',
      label: '创建时间',
      minWidth: '250',
      slotName: 'createAt'
    },
    {
      prop: 'updateAt',
      label: '更新时间',
      minWidth: '250',
      slotName: 'updateAt'
    },
    { label: '操作', minWidth: '100px', slotName: 'edit' }
  ]
}
