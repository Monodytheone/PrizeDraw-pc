<template>
  <div class="page-wrapper">
    <div class="content">
      <!-- 顶部标题和重置按钮 -->
      <div class="header">
        <div class="switch1">
          隱藏員工信息
          <el-switch v-model="infoSwitch" @change="onHideEmployeeInfoChange" />
        </div>
        <div class="title" v-if="endTitle">抽奖已结束</div>
        <el-button type="warning" @click="backhome()">重置抽奖</el-button>
      </div>

      <!-- 奖项列表 -->
      <div class="section">
        <div class="title">奖项列表</div>
        <div v-for="(item, index) in tableData.rafflePrizes" :key="index" class="prize-card">
          <div class="prize-item">
            <span class="label">奖项名称：</span>
            <el-input v-model="item.prizeName" placeholder="奖项名称" :disabled="item.readonly" />
          </div>
          <div class="prize-item">
            <span class="label">奖项金额：</span>
            <el-input v-model="item.prizeAmount" placeholder="奖项金额" />
          </div>
          <div class="prize-item">
            <span class="label">已抽次数：</span>
            <el-input v-model="item.drawnCount" placeholder="已抽次数" />
          </div>
          <div class="prize-item">
            <span class="label">可抽次数：</span>
            <el-input v-model="item.drawsLeft" placeholder="可抽次数" />
          </div>
          <el-button type="primary" @click="start(item)">开始抽奖</el-button>
        </div>
        <el-button type="primary" style="width: 50px;" @click="openAddPrizeDialog()">临时加奖</el-button>
      </div>

      <!-- 中奖记录 -->
      <div class="section">
        <div class="title">中奖记录</div>
        <el-table :data="tableData.prizeRecords" class="custom-table">
          <el-table-column prop="rafflePrizeName" label="奖项名称" width="150" />
          <el-table-column prop="prizeAmount" label="中奖金额" width="100" />
          <el-table-column label="中奖人工号" width="100">
            <template #default="scope">
              <span>{{
                infoSwitch ? '*'.repeat(scope.row.winnerId && scope.row.winnerId.length) : scope.row.winnerId
                }}</span>
            </template>
          </el-table-column>
          <el-table-column label="中奖人姓名" width="100">
            <template #default="scope">
              <span>{{
                infoSwitch ? '*'.repeat(scope.row.winnerName && scope.row.winnerName.length) : scope.row.winnerName
                }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="winnerDepartment" label="中奖人部门" width="180" />
          <el-table-column prop="winTime" label="中奖时间" width="180" />
        </el-table>
      </div>

      <!-- 中奖金额汇总表 -->
      <div class="section">
        <div class="title">中奖金额汇总表</div>
        <el-table :data="tableData.winningAmountByDepartment" class="custom-table">
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="amount" label="金额" />
        </el-table>
      </div>

      <!-- 员工名单 -->
      <div class="section" v-if="!infoSwitch">
        <div class="title">员工名单</div>
        <el-table :data="tableData.employees" class="custom-table" style="height: 750px">
          <el-table-column prop="userId" label="工号" />
          <el-table-column prop="userName" label="姓名" />
          <el-table-column prop="department" label="部门" />
          <el-table-column label="是否已中奖" width="180">
            <template #default="scope">
              <span :class="{ 'has-won': scope.row.hasWon }">{{ scope.row.hasWon ? '已中奖' : '未中奖' }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 重置抽奖对话框 -->
      <el-dialog v-model="dialogTableVisible1" title="重置抽奖" width="400px" :close-on-press-escape="false"
        :close-on-click-modal="false">
        <el-form :model="form">
          <el-form-item label="密码" :label-width="'80px'">
            <el-input v-model="form.password" type="password" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogTableVisible1 = false">取消</el-button>
            <el-button type="primary" @click="backconfirmedhome">确认</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 临时加奖对话框 -->
      <el-dialog v-model="addBonusPrizeVisible" title="临时加奖" width="350px" :close-on-press-escape="true"
        :close-on-click-modal="false">
        <el-form :model="addBonusPrizeForm" label-position="right" label-width="auto">
          <el-form-item label="奖项名称：" style="width: 230px">
            <el-input v-model="addBonusPrizeForm.prizeName" />
          </el-form-item>
          <el-form-item label="金额：">
            <el-input-number v-model="addBonusPrizeForm.prizeAmount" :min="0" />
          </el-form-item>
          <el-form-item label="数量：">
            <el-input-number v-model="addBonusPrizeForm.quantity" :min="0" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="addBonusPrizeVisible = false">取消</el-button>
            <el-button type="primary" @click="onAddPrizeSubmit">添加奖项</el-button>
          </div>
        </template>
      </el-dialog>

      <!-- 全屏抽奖对话框 -->
      <el-dialog fullscreen v-model="dialogTableVisible" :close-on-press-escape="false" :close-on-click-modal="false"
        :show-close="false"
        :title="`${current?.rollingRafflePrize?.prizeName || ''} 已抽數量：${current?.rollingRafflePrize?.drawnCount || 0} 可抽數量：${current?.rollingRafflePrize?.drawsLeft || 0}`"
        width="90%">
        <div class="switch">
          隱藏員工信息
          <el-switch v-model="infoSwitch" @change="onHideEmployeeInfoChange" />
        </div>
        <div class="rolling-content">
          <div class="left">
            <div class="person-info">
              <div class="font">
                工號：{{
                  infoSwitch ? '*'.repeat(currentPeople?.userId && currentPeople?.userId.length) : currentPeople?.userId
                }}
              </div>
              <div class="font">
                姓名：{{
                  infoSwitch
                    ? '*'.repeat(currentPeople?.userName && currentPeople?.userName.length)
                    : currentPeople?.userName
                }}
              </div>
              <div class="font">部門：{{ currentPeople?.department }}</div>
            </div>
          </div>
          <div class="right">
            <el-button type="primary" class="stop-button" @click="stoproll">{{
              rollstart ? '停' : '继续抽奖'
              }}</el-button>
          </div>
        </div>
        <div class="rolling-tables">
          <div class="title">获奖人员名单</div>
          <el-table :data="current.prizeRecordOfCurrentRafflePrize" class="custom-table" style="height: 150px">
            <el-table-column prop="rafflePrizeName" label="奖项名称" />
            <el-table-column prop="prizeAmount" label="中奖金额" />
            <el-table-column label="中奖人工号">
              <template #default="scope">
                <span>{{
                  infoSwitch ? '*'.repeat(scope.row.winnerId && scope.row.winnerId.length) : scope.row.winnerId
                  }}</span>
              </template>
            </el-table-column>
            <el-table-column label="中奖人姓名">
              <template #default="scope">
                <span>{{
                  infoSwitch ? '*'.repeat(scope.row.winnerName && scope.row.winnerName.length) : scope.row.winnerName
                  }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="winnerDepartment" label="中奖人部门" />
          </el-table>
          <el-button type="danger" @click="back()">结束抽奖</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { ResetSystem, getData, StartRoll, StopRoll, BackToPrizeListPage, AddBonusPrize, ChangeHideEmployeeInfoStatus } from '@/api/home';
import router from '@/router/index';

const dialogTableVisible = ref(false);
const dialogTableVisible1 = ref(false);
const addBonusPrizeVisible = ref(false);
const endTitle = ref(false);
const infoSwitch = ref(false);

// 存放开始滚动消息
const current = ref({});
const currentPeople = ref({});
const rollstart = ref(false);
const rollIndex = ref(0);
const form = reactive({
  password: '',
});
const addBonusPrizeForm = reactive({
  prizeName: '',
  quantity: null,
  prizeAmount: null,
})
const tableData = reactive({
  rafflePrizes: [],
  prizeRecords: [],
  winningAmountByDepartment: [],
  employees: [],
  prizeRecordOfCurrentRafflePrize: [],
});
let timer = null;

const openAddPrizeDialog = () => {
  addBonusPrizeVisible.value = true;
  addBonusPrizeForm.prizeName = '';
  addBonusPrizeForm.quantity = 0;
  addBonusPrizeForm.prizeAmount = 0;
}

const onHideEmployeeInfoChange = (par) => {
  console.log(infoSwitch.value, '是否隐藏')
  ChangeHideEmployeeInfoStatus(infoSwitch.value)
    .catch(error => {
      ElMessage.error(`更新移动端个人信息隐藏状态失败：${error.response.data}`);
    })
}

const back = () => {
  BackToPrizeListPage().then((res) => {
    if (res) {
      dialogTableVisible.value = false;
      clearInterval(timer);
      rollstart.value = false;
      current.value = {};
      currentPeople.value = {};
      rollIndex.value = 0;
      tableData.employees = res.employees;
      tableData.prizeRecords = res.prizeRecords;
      tableData.rafflePrizes = res.rafflePrizes;
      tableData.winningAmountByDepartment = res.winningAmountByDepartment;
    }
  });
};

const stoproll = () => {
  if (rollstart.value) {
    clearInterval(timer);
    StopRoll().then((res) => {
      if (res) {
        rollstart.value = false;
        current.value.rollingRafflePrize = res.rafflePrize;
        current.value.prizeRecordOfCurrentRafflePrize = res.prizeRecordOfCurrentRafflePrize;
        currentPeople.value = res.currentWinner;
      }
    });
  } else {
    if (current.value.rollingRafflePrize.drawsLeft == 0) return ElMessage.warning('抽奖次数用完');
    StartRoll({ rafflePrizeId: current.value.rollingRafflePrize.id })
      .then((res) => {
        if (res) {
          rollstart.value = true;
          timer = setInterval(() => {
            if (rollIndex.value >= res.rollingEmployees.length) {
              rollIndex.value = 0;
            }

            currentPeople.value = res.rollingEmployees[rollIndex.value];
            rollIndex.value++;
          }, 100); // 调整滚动速度
        }
      })
      .catch((err) => {
        ElMessage.warning('不可抽奖');
      });
  }
};

const onAddPrizeSubmit = () => {
  AddBonusPrize(addBonusPrizeForm)
    .then(response => {
      console.log('response.data', response);
      tableData.rafflePrizes = response;
      addBonusPrizeVisible.value = false;
      ElMessage.success('添加成功');
    })
    .catch(error => {
      ElMessage.error(error.response.data);
    })
}


const start = async (item) => {
  ElMessageBox.confirm(
    `即將抽取${item.prizeName},已抽${item.drawnCount} 個, 剩余可抽${item.drawsLeft} 個，確認開始？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async () => {
      StartRoll({ rafflePrizeId: item.id })
        .then((res) => {
          if (res) {
            current.value = res;
            dialogTableVisible.value = true;
            rollstart.value = true;
            rollIndex.value = 0;
            if (timer) clearInterval(timer);
            timer = setInterval(() => {
              rollIndex.value = Math.floor(Math.random() * res.rollingEmployees.length)
              if (rollIndex.value >= res.rollingEmployees.length) {
                rollIndex.value = 0;
              }
              currentPeople.value = res.rollingEmployees[rollIndex.value];
            }, 100); // 调整滚动速度
          }
        })
        .catch(() => {
          ElMessage.warning('抽奖次数已用完');
        });
    })
    .catch(() => { });
};

const onCancel = () => {
  ElMessageBox.confirm(`確認退出抽獎？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      dialogTableVisible.value = false;
    })
    .catch(() => { });
};

const backhome = async () => {
  dialogTableVisible1.value = true;
  form.password = '';
};

const backconfirmedhome = async () => {
  ResetSystem({ password: form.password }).then((res) => {
    dialogTableVisible1.value = false;
    ElMessage.success('重置成功');
    router.push('/home');
  });
};

const getTableData = async () => {
  getData().then((res) => {
    if (res) {
      infoSwitch.value = res.hideEmployeeInfo;
      if (res.sysStatus === 5) {
        endTitle.value = true;
        tableData.employees = res.started_2_5.employees;
        tableData.prizeRecords = res.started_2_5.prizeRecords;
        tableData.rafflePrizes = res.started_2_5.rafflePrizes;
        tableData.winningAmountByDepartment = res.started_2_5.winningAmountByDepartment;
      }
      if (res.sysStatus === 2) {
        tableData.employees = res.started_2_5.employees;
        tableData.prizeRecords = res.started_2_5.prizeRecords;
        tableData.rafflePrizes = res.started_2_5.rafflePrizes;
        tableData.winningAmountByDepartment = res.started_2_5.winningAmountByDepartment;
      }
      if (res.sysStatus === 3) {
        current.value = res.rolling_3.rollingRafflePrize;
        dialogTableVisible.value = true;
        rollstart.value = true;
        rollIndex.value = 0;
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
          if (rollIndex.value >= res.rolling_3.rollingEmployees.length) {
            rollIndex.value = 0;
          }
          currentPeople.value = res.rolling_3.rollingEmployees[rollIndex.value];
          rollIndex.value++;
        }, 100); // 调整滚动速度
      }
      if (res.sysStatus === 4) {
        dialogTableVisible.value = true;
        current.value.rollingRafflePrize = res.stopRoll_4.rafflePrize;
        rollstart.value = false;
        current.value.prizeRecordOfCurrentRafflePrize = res.stopRoll_4.prizeRecordOfCurrentRafflePrize;
        currentPeople.value = res.stopRoll_4.currentWinner;
      }
    }
  });
};

onMounted(() => {
  getTableData();
});
</script>

<style lang="less" scoped>
:deep(.el-dialog) {
  position: relative;

  .switch {
    position: absolute;
    font-size: 18px;
    right: 20px;
    top: 12px;
  }
}

/* 页面整体 */
.page-wrapper {
  width: 100%;
  min-height: 100vh;
  /* 修改为 min-height 确保背景覆盖所有内容 */
  background-color: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* 改为 flex-start 以避免内容垂直居中 */
}

.content {
  width: 100%;
  max-width: 1200px;
  /* 设置最大宽度 */
  /* 移除 height: 100%; 以允许内容区域根据内容自适应高度 */
  background-color: #1a1a1a;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.switch1 {
  position: absolute;
  font-size: 18px;
  right: 20px;
  top: 12px;
}

.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333333;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.section {
  background-color: #333333;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  color: #ffcc00;
  margin-bottom: 10px;
  text-align: center;
}

.custom-table {
  background-color: #444444;
  border-radius: 5px;
}

:deep(.custom-table th) {
  background-color: #555555;
  color: #ffffff;
}

:deep(.custom-table td) {
  background-color: #444444;
  color: #ffffff;
}

.prize-card {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  background-color: #444444;
  padding: 15px;
  border-radius: 8px;
}

.prize-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.label {
  width: 80px;
  text-align: right;
  font-weight: bold;
}

.has-won {
  font-weight: bold;
  color: red;
}

/* 对话框内容 */
.rolling-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  height: auto;
  margin-bottom: 20px;
}

.left {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.person-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.font {
  font-size: 50px;
  margin-bottom: 10px;
}

.stop-button {
  width: 400px;
  height: 400px;
  font-size: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 中奖记录和金额汇总表的表格上方的标题 */
.rolling-tables .title {
  margin-top: 20px;
  text-align: left;
}

.rolling-tables {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content {
    max-width: 1000px;
    /* 调整最大宽度 */
  }
}

@media (max-width: 1024px) {
  .rolling-content {
    gap: 30px;
  }

  .stop-button {
    width: 300px;
    height: 300px;
    font-size: 28px;
  }

  .font {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .prize-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .label {
    width: 100%;
    text-align: left;
  }

  .rolling-content {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .stop-button {
    width: 200px;
    height: 200px;
    font-size: 24px;
  }

  .font {
    font-size: 24px;
  }

  .rolling-tables .title {
    text-align: center;
  }

  .rolling-tables {
    width: 100%;
  }

  .content {
    padding: 15px;
    gap: 15px;
  }

  .header {
    padding: 10px 15px;
    position: relative;
  }

  .section {
    padding: 15px;
    gap: 15px;
  }
}

/* 按钮样式 */
.el-button {
  min-width: 100px;
}

/* 对话框底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
