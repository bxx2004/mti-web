<script setup lang="ts">

import {UploadFilled} from "@element-plus/icons-vue";
import {fileUploadURL, request} from "../network";
import {reactive, ref} from "vue";
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import {ElNotification} from "element-plus";
import InfoFrame from "../components/InfoFrame.vue";
import Report from "../components/Report.vue";
import MatingResult from "../components/MatingResult.vue";

let test = JSON.parse("[{\"id\":\"GS0002-2\",\"x\":1,\"y\":1},{\"id\":\"GS0002-190\",\"x\":2,\"y\":2},{\"id\":\"GS0116-107\",\"x\":3,\"y\":3},{\"id\":\"GS0116-30\",\"x\":4,\"y\":4},{\"id\":\"GS0145-24\",\"x\":5,\"y\":5},{\"id\":\"GS0145-129\",\"x\":6,\"y\":6},{\"id\":\"GS0146-127\",\"x\":7,\"y\":7},{\"id\":\"GS0146-120\",\"x\":8,\"y\":8},{\"id\":\"GS0169-79\",\"x\":9,\"y\":9},{\"id\":\"GS0169-121\",\"x\":10,\"y\":10},{\"id\":\"GS0174-61\",\"x\":11,\"y\":11},{\"id\":\"GS0174-48\",\"x\":12,\"y\":12},{\"id\":\"GS0175-55\",\"x\":8,\"y\":13},{\"id\":\"GS0175-75\",\"x\":13,\"y\":14},{\"id\":\"GS0193-86\",\"x\":4,\"y\":15},{\"id\":\"GS0193-108\",\"x\":7,\"y\":16},{\"id\":\"GS0194-162\",\"x\":12,\"y\":17},{\"id\":\"GS0194-23\",\"x\":14,\"y\":18},{\"id\":\"GS0196-20\",\"x\":15,\"y\":19},{\"id\":\"GS0196-68\",\"x\":16,\"y\":20},{\"id\":\"GS0216-112\",\"x\":17,\"y\":21},{\"id\":\"GS0216-84\",\"x\":18,\"y\":15},{\"id\":\"GS0225-63\",\"x\":19,\"y\":22},{\"id\":\"GS0225-90\",\"x\":13,\"y\":23},{\"id\":\"T011-9\",\"x\":15,\"y\":24},{\"id\":\"T011-58\",\"x\":2,\"y\":25},{\"id\":\"GS0200-1\",\"x\":16,\"y\":13},{\"id\":\"GS0200-110\",\"x\":20,\"y\":26},{\"id\":\"GS0180-4\",\"x\":21,\"y\":27},{\"id\":\"GS0180-5\",\"x\":22,\"y\":28}]")


const form = reactive({
  matingResultMatrixFile: "",
  osResultFile: ""
})

function saveFile(id:string) {
  var wb = XLSX.utils.table_to_book(document.querySelector(id));//关联dom节点
  /* get binary string as output */
  var wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(new Blob([wbout], {
      type: 'application/octet-stream'
    }), 'result.xlsx')//自定义文件名
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout);
  }
  return wbout
}
function uploadSuccess(type:string,res:any){
  if (type === '1'){
    form.matingResultMatrixFile = res.payload.path
  }
  if (type === '2'){
    form.osResultFile = res.payload.path
  }
}
const isLoading = ref(false)
let result = reactive({
  number_of_monokaryons: 0,
  number_of_mating_info: 0,
  number_of_missed_mating_info: 0,
  missed_mating_list: [],
  number_of_OS_exp_info: 0,
  number_of_missed_OS_exp_info: 0,
  missed_OS_exp_list: [],
  "pre-assign_mating_type": [],
  data:[],
  score: 0,
  total_score:0,
  mn_graph:{
    nodes:[],
    lines:[]
  },
  un_graph:{
    nodes:[],
    lines:[]
  },
  "total_number_of_mating-type_combinations": 0,
  "total_number_of_all-right_mating-type_combinations": 0
})
async function start() {
  if (form.osResultFile !== '' && form.matingResultMatrixFile !== ''){
    isLoading.value = true
    let res = await request("/mating-type-imputation/imputation/get-imputation-result",form)
    if (res.data.status){
      result = res.data.payload
    }else {
      ElNotification.error({
        message: res.data.message
      })
    }
    isLoading.value = false
    ElNotification.success({
      message: "分析成功！"
    })
  }else {
    ElNotification.error({
      message: "请上传相应的文件"
    })
  }

}
</script>

<template>

  <div class="container">
    <el-text style="font-size: 50px">
      MTI - 交配型推断应用平台
    </el-text>
    <el-row :gutter="24" class="top-20" v-if="result.data.length == 0">
      <el-col :span="12">
        <el-upload
            drag
            :action="fileUploadURL"
            :limit="1"
            :on-success="(response:any)=> {uploadSuccess('1',response)}"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽文件到这里或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              交配结果矩阵文件
            </div>
          </template>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <el-upload
            drag
            :action="fileUploadURL"
            :limit="1"
            :on-success="(response:any)=> {uploadSuccess('2',response)}"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽文件到这里或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              OWE-SOJ 实验结果文件
            </div>
          </template>
        </el-upload>
      </el-col>
    </el-row>
    <el-button v-if="result.data.length == 0" v-loading="isLoading" type="primary" class="top-20" @click="start">
      开始分析
    </el-button>

    <div class="result top-20" v-if="result.data.length != 0">
      <report :data="result"></report>
      <info-frame class="top-20" title="详细信息">
        <el-collapse>
          <el-collapse-item title="表格结果">
            <el-descriptions
                :column="6"
                border
            >
              <el-descriptions-item
                  label-align="center"
                  label-class-name="title"
                  label="操作"
                  :span="6"
              >
                <el-button @click="saveFile('#mn_list')">下载表格</el-button>
              </el-descriptions-item>
            </el-descriptions>

            <el-table id="mn_list" :data="result.data">
              <el-table-column prop="id" label="id"></el-table-column>
              <el-table-column prop="x" label="x"></el-table-column>
              <el-table-column prop="y" label="y"></el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </info-frame>

    </div>
  </div>
</template>

<style scoped>
.result{
  text-align: left;
  margin-left: 10%;
  margin-right: 10%;
  border-color: green;
}
.container{
  text-align: center;
}
.top-20{
  margin-top: 20px;
}
</style>