export default [
  {
    path: '/',
    name: 'all',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/pinia',
    name: 'pinia',
    component: () => import('@/views/PiniaView.vue'),
  },
];
