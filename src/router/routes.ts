import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      breadCrumbLink: true,
      breadCrumbIcon: 'home',
      breadCrumbLabel: 'paginaInicial',
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'home',
        meta: {
          requiresAuth: true,
          breadCrumbLink: true,
          breadCrumbIcon: 'home',
          breadCrumbLabel: 'home',
        },
        component: () => import('pages/Index/IndexPage.vue')
      },
      {
        path: 'products',
        meta: {
          requiresAuth: true,
          breadCrumbLink: true,
          breadCrumbIcon: '',
          breadCrumbLabel: 'produto',
        },
        redirect: { name: 'product' },
        component: () => import('pages/Product/ProductLayout.vue'),
        children: [
          {
            path: '',
            name: 'product',
            meta: {
              breadCrumbLink: true,
              breadCrumbIcon: '',
              breadCrumbLabel: 'produto',
            },
            component: () => import('pages/Product/ProductPage.vue')
          },
          {
            path: 'add',
            name: 'product-add',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'add',
              breadCrumbLabel: 'adicionar',
            },
            component: () => import('pages/Product/ProductForm.vue')
          },
          {
            path: 'edit/:uuid_product',
            name: 'product-edit',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'edit',
              breadCrumbLabel: 'editar',
            },
            component: () => import('pages/Product/ProductForm.vue')
          },
        ]
      },
      {
        path: 'shoppings',
        meta: {
          requiresAuth: true,
          breadCrumbLink: true,
          breadCrumbIcon: '',
          breadCrumbLabel: 'compra',
        },
        redirect: { name: 'shopping' },
        component: () => import('pages/Shopping/ShoppingLayout.vue'),
        children: [
          {
            path: '',
            name: 'shopping',
            meta: {
              breadCrumbLink: true,
              breadCrumbIcon: 'home',
              breadCrumbLabel: 'compra',
            },
            component: () => import('pages/Shopping/ShoppingPage.vue')
          },
          {
            path: 'add',
            name: 'shopping-add',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'add',
              breadCrumbLabel: 'adicionar',
            },
            component: () => import('pages/Shopping/ShoppingForm.vue')
          },
          {
            path: 'edit/:uuid_shopping',
            name: 'shopping-edit',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'edit',
              breadCrumbLabel: 'editar',
            },
            component: () => import('pages/Shopping/ShoppingForm.vue')
          },
        ]
      },
      {
        path: 'sales',
        meta: {
          requiresAuth: true,
          breadCrumbLink: true,
          breadCrumbIcon: '',
          breadCrumbLabel: 'venda',
        },
        redirect: { name: 'sale' },
        component: () => import('pages/Sale/SaleLayout.vue'),
        children: [
          {
            path: '',
            name: 'sale',
            meta: {
              breadCrumbLink: true,
              breadCrumbIcon: 'home',
              breadCrumbLabel: 'venda',
            },
            component: () => import('pages/Sale/SalePage.vue')
          },
          {
            path: 'add',
            name: 'sale-add',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'add',
              breadCrumbLabel: 'adicionar',
            },
            component: () => import('pages/Sale/SaleForm.vue')
          },
          {
            path: 'edit/:uuid_sale',
            name: 'sale-edit',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'edit',
              breadCrumbLabel: 'editar',
            },
            component: () => import('pages/Sale/SaleForm.vue')
          },
        ]
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login/LoginPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/NotFound/NotFoundPage.vue'),
  },
];

export default routes;
