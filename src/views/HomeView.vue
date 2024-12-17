<template>
  <div class="content">
    <!-- 上方左右布局 -->
    <div class="main-container">
      <!-- 左侧部分：导入员工和员工列表 -->
      <div class="left-section">
        <div class="section">
          <div class="title">员工导入</div>
          <el-upload ref="uploadRef" v-model:file-list="files" :http-request="requestMethod"
            :on-error="handleRequestFail" :show-file-list="false">
            <el-button type="primary">导入员工</el-button>
          </el-upload>
        </div>

        <div class="section">
          <div class="title">员工列表</div>
          <el-table :data="tableData.employees" class="custom-table" height="350">
            <el-table-column prop="userId" label="工号" />
            <el-table-column prop="userName" label="姓名" />
            <el-table-column prop="department" label="部门" />
          </el-table>
        </div>
      </div>

      <!-- 右侧部分：奖项设置和操作 -->
      <div class="right-section">
        <div class="section">
          <div class="title">奖项列表</div>
          <div v-for="(item, index) in tableData.rafflePrizes" :key="index" class="prize-card">
            <el-input v-model="item.prizeName" placeholder="奖项名称" :disabled="item.readonly" />
            <el-input v-model="item.prizeAmount" placeholder="奖项金额" />
            <el-input v-model="item.quantity" placeholder="奖项数量" />
            <el-button type="danger" @click="deleteItem(index)">删除</el-button>
          </div>
          <div class="button-group">
            <el-button type="warning" @click="add">添加奖项</el-button>
            <el-button type="success" @click="SetPrize">上传奖项列表</el-button>
          </div>
          <br><br>
          <div class="title">公证人</div><br>
          <el-input v-model="notary" placeholder="请输入公证人" style="width: 250px; margin-left: 100px;" />
          <el-button type="primary" style="margin-left: 20px;" @click="onSetNotary">设置公证人</el-button>
        </div>
      </div>
    </div>

    <!-- 下方部分：开始抽奖 -->
    <div class="footer">
      <el-button type="primary" size="large" @click="start">开始抽奖</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getData, SetNotary, SetRafflePrize, SysStatusStart, UploadEmployees } from '@/api/home';
import router from '@/router/index';

const tableData = reactive({
  rafflePrizes: [
    { id: 1, prizeName: '一等奖', prizeAmount: '', quantity: '', readonly: false },
    { id: 2, prizeName: '二等奖', prizeAmount: '', quantity: '', readonly: false },
    { id: 3, prizeName: '三等奖', prizeAmount: '', quantity: '', readonly: false },
  ],
  employees: [],
});

const files = ref([]);
const uploadRef = ref();

const notary = ref('');

const onSetNotary = () => {
  SetNotary(notary.value).then(() => ElMessage.success('设置成功'));
}

const requestSuccessMethod = async (file) => {
  const res = await UploadEmployees(file.file);
  tableData.employees = res;
  ElMessage.success('上传成功');

  // UploadEmployees(file.file).then(() => {
  //   ElMessage.success('上传成功');
  // });
};

const requestMethod = computed(() => requestSuccessMethod);

const add = () => {
  tableData.rafflePrizes.push({ id: Date.now(), prizeName: '', prizeAmount: '', quantity: '', readonly: false });
};

const deleteItem = (index) => {
  tableData.rafflePrizes.splice(index, 1);
};

const SetPrize = () => {
  SetRafflePrize({ items: tableData.rafflePrizes }).then(() => ElMessage.success('设置成功'));
};

const start = () => {
  ElMessageBox.confirm('确定开始抽奖吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    SysStatusStart().then(() => {
      ElMessage.success('抽奖开始！');
      router.push('/pinia');
    });
  });
};

const getTableData = async () => {
  const res = await getData();
  tableData.employees = res.notStart_1?.employees || [];
  notary.value = res.notary;
  if (res.notStart_1.rafflePrizes.length > 0) {
    tableData.rafflePrizes = res.notStart_1.rafflePrizes;
  }
};

const handleRequestFail = () => {
  ElMessage.error('上传失败');
}

onMounted(getTableData);
</script>

<style lang="less" scoped>
/* 页面整体 */
.content {
  background-color: #1a1a1a;
  color: #fff;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 主体左右布局 */
.main-container {
  display: flex;
  gap: 20px;
  flex: 1;
}

/* 左侧、右侧 */
.left-section,
.right-section {
  background-color: #333333;
  border-radius: 10px;
  padding: 20px;
  flex: 1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 标题 */
.title {
  font-size: 18px;
  font-weight: bold;
  color: #ffcc00;
  margin-bottom: 10px;
  text-align: center;
}

/* 表格样式 */
.custom-table {
  background-color: #444444;
  border-radius: 5px;
}

.custom-table ::v-deep th {
  background-color: #555555;
  color: #ffffff;
}

.custom-table ::v-deep td {
  background-color: #444444;
  color: #ffffff;
}

/* 奖项卡片 */
.prize-card {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

/* 底部按钮 */
.footer {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
