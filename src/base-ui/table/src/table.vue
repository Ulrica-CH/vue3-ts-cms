<template>
  <div class="xy-table">
    <div class="content">
      <div class="header">
        <slot name="header">{{ title }}</slot>
        <div class="headerHandle">
          <slot name="headerHandle">
            <el-button type="primary" round size="medium">新建用户</el-button>
            <el-button round
              ><el-icon><refresh /></el-icon
            ></el-button>
          </slot>
        </div>
      </div>
      <el-table
        :data="listDatas"
        style="width: 100%"
        border
        @selection-change="handleSelectChange"
      >
        <el-table-column
          v-if="showSelect"
          type="selection"
          width="50px"
          align="center"
          label=""
        ></el-table-column>
        <el-table-column
          v-if="showIndex"
          type="index"
          label="序号"
          width="80px"
          align="center"
        ></el-table-column>
        <template v-for="propList in propLists" :key="propList.prop">
          <el-table-column v-bind="propList" align="center">
            <!-- #default="scope123" 这里的scope123是自定义的一般写成scope-->
            <!-- :row11="scope123.row" row11是传递给父组件的数据的属性名要通过scope（可自定义）.row来调用 -->
            <template #default="scope123">
              <slot :name="propList.slotName" :row11="scope123.row">{{
                scope123.row[propList.prop]
              }}</slot>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="footer">
        <!-- 底部分页 -->
        <slot name="footer">
          <el-pagination
            v-model:currentPage="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[100, 200, 300, 400]"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
export default defineComponent({
  components: { Refresh },
  props: {
    title: {
      type: String,
      required: true
    },
    listDatas: {
      type: Array,
      required: true
    },
    propLists: {
      type: Array,
      required: true
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    showSelect: {
      type: Boolean,
      default: false
    }
  },
  emits: ['selectChange'],
  setup(props, { emit }) {
    const handleSelectChange = (value: any) => {
      emit('selectChange', value)
    }
    return { handleSelectChange }
  }
})
</script>

<style scoped lang="less">
.content {
  border-top: 20px solid #f5f5f5;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 20px 10px;
}
.footer {
  margin-top: 20px;
  .el-pagination {
    text-align: right;
  }
}
</style>
