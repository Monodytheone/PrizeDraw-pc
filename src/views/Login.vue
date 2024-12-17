<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h1 class="title">请输入您的 Token</h1>
      <el-input v-model="input" placeholder="请输入 token" @keyup.enter.native="onEnter" @change="onChange"
        class="token-input" clearable />
      <el-button type="primary" @click="onEnter" class="submit-button">提交</el-button>
    </div>
  </div>
</template>

<script setup>
import router from '@/router/index';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const input = ref('');

const onEnter = () => {
  if (input.value.trim()) {
    localStorage.setItem('token', input.value.trim());
    ElMessage.success('Token 已保存，正在跳转...');
    router.push('/home');
  } else {
    ElMessage.warning('请输入有效的 Token');
  }
};

const onChange = (val) => {
  // 可根据需要处理输入变化
};
</script>

<style scoped>
/* 页面整体背景 */
.login-wrapper {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

/* 登录容器 */
.login-container {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 40px 60px;
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8.5px);
  -webkit-backdrop-filter: blur(8.5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 400px;
  width: 100%;
}

/* 标题样式 */
.title {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

/* 输入框样式 */
.token-input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
}

/* 按钮样式 */
.submit-button {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background-color: #409eff;
  border: none;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #66b1ff;
}
</style>
