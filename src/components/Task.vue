<template>
  <div>
    <template>
      <v-tabs :value="1" background-color="primary">
        <v-tab @click="$router.push({name:'Case'})">用例管理</v-tab>
        <v-tab @click="$router.push({name:'Task'})">任务管理</v-tab>
        <v-tab @click="$router.push({name:'Jenkins'})">Jenkins管理</v-tab>
        <v-tab @click="$router.push({name:'Report'})">报告管理</v-tab>
      </v-tabs>
    </template>


    <template>
      <v-data-table
              v-model="selected"
              :headers="headers"
              :items="desserts"
              item-key="id"
              show-select
              class="elevation-1"
      >
        <!--        <template v-slot:[`item.operate`] = "{item}">-->
        <template v-slot:item.operate = "{item}">
          <v-btn color="primary" text small @click="editCase(item)">编辑</v-btn>
          <v-btn color="primary" text small @click="deleteCase(item)">删除</v-btn>
        </template>

      </v-data-table>

    </template>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        selected: [],
        headers: [
          {
            text: 'ID',
            value: 'id',
          },
          { text: '任务名称', value: 'name' },
          { text: '用例数', value: 'caseCount' },
          { text: '备注', value: 'remark' },
          { text: '相关操作', value: 'operate' },
        ],
        desserts: [],
      }
    },
    created() {
      let post_data = {
        pageNum: 1,
        pageSize:10,

      }
      this.$api.task.getTaskList(post_data).then(res=>{
        console.log(res)
        this.desserts = res.data.data.data
      })
      // tas.getCaseList(post_data).then(res=>{
      //   console.log("created: caselist")
      //   console.log(res)
      //   this.desserts = res.data.data.data
      // }
      // )
    },

  }
</script>

<style scoped>

</style>