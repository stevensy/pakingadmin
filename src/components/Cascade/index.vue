<template>
  <div>
    <el-form-item v-for="(item, index) in datas" :key="index" :label="item.label" :label-width="labelWidth">
      <el-select
        v-model="select"
        filterable
        placeholder="请选择"
        size="mini"
        clearable
        @change="getV"
        disabled
      >
        <el-option
          v-for="(item, index) in item.arr"
          :key="index"
          :label="item.name"
          :value="item.code"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'cascade', // 级联
  props: {
    // datas: []
    labelWidth: {
      type: String,
      default: '80px'
    }
  },
  data() {
    return {
      datas: [
        { label: '省', arr: ['北京', '上海', '天津'] },
        { label: '市', arr: [] },
        { label: '区', arr: [] },
      ],
      select: undefined
    }
  },
  methods: {
    getV(v) {
      console.log(v)
    }
  }
}
</script>