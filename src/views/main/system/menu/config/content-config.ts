export const contentTableConfig = {
  title: '菜单列表',
  //控制序号显示
  showIndex: false,
  //控制是否有选择按钮
  showSelect: false,
  propLists: [
    {
      prop: 'name',
      label: '菜单名称',
      minWidth: '200'
    },
    {
      prop: 'type',
      label: '类型',
      minWidth: '100'
    },
    {
      prop: 'url',
      label: '菜单url',
      minWidth: '140'
    },
    {
      prop: 'icon',
      label: '菜单图标',
      minWidth: '140'
    },
    {
      prop: 'permission',
      label: '按钮权限',
      minWidth: '140'
    },
    {
      prop: 'createAt',
      label: '创建时间',
      minWidth: '220',
      slotName: 'createAt'
    },
    {
      prop: 'updateAt',
      label: '更新时间',
      minWidth: '220',
      slotName: 'updateAt'
    },
    { label: '操作', minWidth: '100px', slotName: 'edit' }
  ],
  // 控制table的二级三级展开
  childProps: {
    rowKey: 'id',
    treeProp: {
      children: 'children'
    }
  }
}
