<template>
  <div>
    <template>
      <v-tabs :value="0" background-color="primary">
        <v-tab @click="$router.push({name:'Case'})">用例管理</v-tab>
        <v-tab @click="$router.push({name:'Task'})">任务管理</v-tab>
        <v-tab @click="$router.push({name:'Jenkins'})">Jenkins管理</v-tab>
        <v-tab @click="$router.push({name:'Report'})">报告管理</v-tab>
      </v-tabs>
    </template>
    <v-alert
            v-model="errorDialog"
            border="left"
            close-text="Close Alert"
            color="deep-purple accent-4"
            dark
            dismissible
            label="this.errorContent"

    >
      {{ this.errorContent }}
    </v-alert>

<!--    生成任务  -->
    <v-dialog v-model="taskDialog" max-width="500px" >
      <v-card>
        <v-card-title>
          <span>生成测试任务</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field label="任务名称" v-model="addTaskItem.taskName"></v-text-field>
            <v-textarea label="备注" v-model="addTaskItem.taskRemark"></v-textarea>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
                  color="primary"
                  text
                  @click="taskDialog = false"
          >
            取消
          </v-btn>
          <v-btn
                  color="primary"
                  text
                  @click="createTask()"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
<!--编辑用例-->
    <v-dialog v-model="editDialog" max-width="500px" >
      <v-card>
        <v-card-title>
          <span>编辑测试用例</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field label="用例名称" v-model="editItem.caseName"></v-text-field>
<!--            <v-select :items="items" label="用例类型"  v-model="editItem.type"></v-select>-->
            <v-textarea label="用例数据" v-model="editItem.caseData"></v-textarea>
<!--            <v-file-input label="用例数据" v-model="editItem.caseData" v-if="editItem.type=='文件'"  outlined dense ></v-file-input>-->
            <v-textarea label="备注" v-model="editItem.remark"></v-textarea>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
                  color="primary"
                  text
                  @click="editDialog = false"
          >
            取消
          </v-btn>
          <v-btn
                  color="primary"
                  text
                  @click="confirmEdit(editItem)"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<!--  新建用例  -->
    <v-dialog
    v-model="addDialog"
    max-width="500px"
    >
    <v-card>
      <v-card-title>
        <span>添加测试用例</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-text-field label="用例名称" v-model="addItem.name"></v-text-field>
          <v-select :items="items" label="用例类型"  v-model="addItem.type"></v-select>
          <v-textarea label="用例数据" v-if="addItem.type=='文本'" v-model="addItem.data"></v-textarea>
          <v-file-input label="用例数据" v-model="addItem.file" v-if="addItem.type=='文件'"  outlined dense ></v-file-input>
          <v-textarea label="备注" v-model="addItem.remark"></v-textarea>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
                color="primary"
                text
                @click="addDialog = false"
        >
          取消
        </v-btn>
        <v-btn
                color="primary"
                text
                @click="addCase()"
        >
          确定
        </v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>
<!--    结束新建 -->
    <v-btn color="primary" class="btn" @click="addDialog=true">添加用例</v-btn>
    <v-btn color="success" class="btn" @click="taskDialog=true">生成任务</v-btn>

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
        datas:'',
        messages:'',
        addTaskItem: {
          taskName: '',
          taskRemark: ''
        },
        taskDialog: false,
        errorContent: '',
        errorDialog: false,
        addDialog: false,
        editDialog: false,
        editItem: {},
        items: ['文本', '文件'],
        addItem: {
          name: '',
          type: '',
          data:'',
          file: null,
          remark: ''
        },
        selected: [],
        headers: [
          {
            text: 'ID',
            value: 'id',
          },
          { text: '用例名称', value: 'caseName' },
          { text: '用例数据', value: 'caseData' },
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
        // params.caseName 测试用例名称
        // params.createUserId 创建者id(客户端传值无效，以token数据为准)
        // token  token值
      }
      this.$api.cases.getCaseList(post_data).then(res=>{
        console.log("created: caselist")
        console.log(res)
        this.desserts = res.data.data.data
      })
    },

    methods: {
      addCase(){
        if(this.addItem.type == '文本'){
          let post_data = {
            caseData: this.addItem.data,
            caseName: this.addItem.name,
            remark: this.addItem.remark
          }
          this.$api.cases.createCaseByText(post_data).then(res=>{
            console.log(res)
            // 关闭窗口
            this.addDialog = false
            console.log("添加用例----返回数据 ~~~~")
            this.datas = res.data.data
            this.messages = res.data.message
            if (this.datas == null ){
              // alert("添加用例失败，报错信息为："+this.messages)
              this.errorDialog = true
              this.errorContent = this.messages
            }
            // 更新页面数据
            let new_post_data = {
              pageNum: 1,
              pageSize:10,
            }
            this.$api.cases.getCaseList(new_post_data).then(res=>{

              console.log("added cases, refresh: caselist")
              console.log(res)
              this.desserts = res.data.data.data
            })
          })
        }else if(this.addItem.type == '文件'){
          let post_data = new FormData()

          post_data.append('caseFile',this.addItem.file)
          post_data.append('caseData', this.addItem.data)
          post_data.append('caseName', this.addItem.name)
          post_data.append('remark', this.addItem.remark)
          this.$api.cases.createCaseByFile(post_data).then(res=>{
            console.log(res)
            // 关闭窗口
            this.addDialog = false
            // 更新页面数据
            this.addDialog = false
            let new_post_data = {
              pageNum: 1,
              pageSize:10,
            }
            this.$api.cases.getCaseList(new_post_data).then(res=>{
              console.log("added cases, refresh: caselist")
              console.log(res)
              this.desserts = res.data.data.data
            })

          })
        }

        console.log(this.addItem)

      },
      deleteCase(item1){
        console.log("deleteCase ~~~~~~")
        console.log(item1)

        let post_datas = {
          caseId: item1.id
        }

        if(confirm('确定要删除吗')==true){
          this.$api.cases.deleteCaseById(post_datas).then(res=>{
            console.log(post_datas)
            console.log(res)

            let new_post_data = {
              pageNum: 1,
              pageSize:10,
            }
            this.$api.cases.getCaseList(new_post_data).then(res=>{
              console.log("added cases, refresh: caselist")
              console.log(res)
              this.desserts = res.data.data.data
            })
          })
        }
      },
      editCase(item1){
        console.log("deleteCase ~~~~~~")
        console.log(item1)
        this.editItem = item1
        this.editDialog = true
      },
      confirmEdit(editItem){
        let edit_post_data = {
          // updateHogwartsTestCaseDto: {
            caseData: this.editItem.caseData,
            caseName: this.editItem.caseName,
            id: this.editItem.id,
            remark: this.editItem.remark
          // }
        }
        this.$api.cases.editCase(edit_post_data).then(res=>{
          this.editDialog = false

          let new_post_data = {
            pageNum: 1,
            pageSize:10,
          }
          this.$api.cases.getCaseList(new_post_data).then(res=>{
            console.log("added cases, refresh: caselist")
            console.log(res)
            this.desserts = res.data.data.data
          })
        })
      },
      createTask(){

        console.log("被选中的：")

        let caseIdlest = []

        for(let i=0;i<this.selected.length;i++){
          caseIdlest.push(this.selected[i].id)
        }
        console.log(caseIdlest)
        let post_data = {
          caseIdList: caseIdlest,
          testTask: {
            // createUserId: 148,
            name: this.addTaskItem.taskName,
            remark: this.addTaskItem.taskRemark,
            testJenkinsId: 167
          }
        }

        this.$api.cases.addTask(post_data).then(res=>{
          this.taskDialog = false
          console.log(res)

          // this.datas = res.data.data
          // this.messages = res.data.message
          // if (this.datas == null ){
          //   // alert("添加用例失败，报错信息为："+this.messages)
          //   this.errorDialog = true
          //   this.errorContent = this.messages
          // }
        })

      }
    }

  }
</script>

<style scoped>
.btn{
  margin: 10px;
}
</style>