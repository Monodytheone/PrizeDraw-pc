import { createRouter, createWebHistory } from 'vue-router';
import { getData } from '@/api/home';
const files = import.meta.glob('./modules/*.js', {
  eager: true,
});

// 路由暂存
const routeModuleList = [];

// 遍历路由模块
Object.keys(files).forEach((key) => {
  const module = files[key].default || {};
  const moduleList = Array.isArray(module) ? [...module] : [module];
  routeModuleList.push(...moduleList);
});

// 存放动态路由
const asyncRouterList = [...routeModuleList];

// 存放固定路由
const defaultRouterList = [];

const routes = [...defaultRouterList, ...asyncRouterList];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  if (!token) {
    if (to.path !== '/login') {
      next('/login');
    } else {
      next();
    }
  } else {
    try {
      const res = await getData();
      if ([2, 3, 4, 5].includes(res.sysStatus)) {
        if (to.path !== '/pinia') {
          next({ path: '/pinia' });
        } else {
          next();
        }
      } else if ([1].includes(res.sysStatus)) {
        if (to.path !== '/home') {
          next('/home');
        } else {
          next();
        }
      } else {
        next();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      next(false); // 取消导航
    }
  }
});

// router.beforeEach(async (to, from, next) => {
//   const token = localStorage.getItem('token');
//   if (!token && to.path !== '/login') {
//     next('/login');
//   } else if (!token && to.path === '/login') {
//     next();
//   } else {
//     const res = await getData();
//     if ([2, 3, 4, 5].includes(res.sysStatus)) {
//       next({ path: '/pinia' });
//     }
//     if ([1].includes(res.sysStatus)) {
//       next('/home');
//     }
//   }
// });

export default router;
