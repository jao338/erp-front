import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      breadCrumbLink: true,
      breadCrumbIcon: 'home',
      breadCrumbLabel: 'homePage',
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
          breadCrumbLabel: 'homePage',
        },
        component: () => import('pages/Index/IndexPage.vue')
      },
      {
        path: 'products',
        meta: {
          requiresAuth: true,
          breadCrumbLink: true,
          breadCrumbIcon: 'inventory_2',
          breadCrumbLabel: 'product',
        },
        redirect: { name: 'product' },
        component: () => import('pages/Product/ProductLayout.vue'),
        children: [
          {
            path: '',
            name: 'product',
            meta: {
              breadCrumbLink: true,
              breadCrumbIcon: 'inventory_2',
              breadCrumbLabel: 'product',
            },
            component: () => import('pages/Product/ProductPage.vue')
          },
          {
            path: 'add',
            name: 'product-add',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'add',
              breadCrumbLabel: 'add',
            },
            component: () => import('pages/Product/ProductForm.vue')
          },
          {
            path: 'edit/:uuid_product',
            name: 'product-edit',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'edit',
              breadCrumbLabel: 'edit',
            },
            component: () => import('pages/Product/ProductForm.vue')
          },
        ]
      },
      {
        path: 'suppliers',
        meta: {
          requiresAuth: true,
          breadCrumbLink: true,
          breadCrumbIcon: 'local_shipping',
          breadCrumbLabel: 'supplier',
        },
        redirect: { name: 'supplier' },
        component: () => import('pages/Supplier/SupplierLayout.vue'),
        children: [
          {
            path: '',
            name: 'supplier',
            meta: {
              breadCrumbLink: true,
              breadCrumbIcon: 'local_shipping',
              breadCrumbLabel: 'supplier',
            },
            component: () => import('pages/Supplier/SupplierPage.vue')
          },
          {
            path: 'add',
            name: 'supplier-add',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'add',
              breadCrumbLabel: 'add',
            },
            component: () => import('pages/Supplier/SupplierForm.vue')
          },
          {
            path: 'edit/:uuid_supplier',
            name: 'supplier-edit',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'edit',
              breadCrumbLabel: 'edit',
            },
            component: () => import('pages/Supplier/SupplierForm.vue')
          },
        ]
      },
      {
        path: 'shoppings',
        meta: {
          requiresAuth: true,
          breadCrumbLink: true,
          breadCrumbIcon: 'shopping_cart_checkout',
          breadCrumbLabel: 'purchase',
        },
        redirect: { name: 'shopping' },
        component: () => import('pages/Shopping/ShoppingLayout.vue'),
        children: [
          {
            path: '',
            name: 'shopping',
            meta: {
              breadCrumbLink: true,
              breadCrumbIcon: 'shopping_cart_checkout',
              breadCrumbLabel: 'purchase',
            },
            component: () => import('pages/Shopping/ShoppingPage.vue')
          },
          {
            path: 'add',
            name: 'shopping-add',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'add',
              breadCrumbLabel: 'add',
            },
            component: () => import('pages/Shopping/ShoppingForm.vue')
          },
          {
            path: 'edit/:uuid_shopping',
            name: 'shopping-edit',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'edit',
              breadCrumbLabel: 'edit',
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
          breadCrumbIcon: 'point_of_sale',
          breadCrumbLabel: 'sale',
        },
        redirect: { name: 'sale' },
        component: () => import('pages/Sale/SaleLayout.vue'),
        children: [
          {
            path: '',
            name: 'sale',
            meta: {
              breadCrumbLink: true,
              breadCrumbIcon: 'point_of_sale',
              breadCrumbLabel: 'sale',
            },
            component: () => import('pages/Sale/SalePage.vue')
          },
          {
            path: 'add',
            name: 'sale-add',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'add',
              breadCrumbLabel: 'add',
            },
            component: () => import('pages/Sale/SaleForm.vue')
          },
          {
            path: 'edit/:uuid_sale',
            name: 'sale-edit',
            meta: {
              breadCrumbLink: false,
              breadCrumbIcon: 'edit',
              breadCrumbLabel: 'edit',
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
    component: () => import('pages/Auth/Login/LoginPage.vue'),
  },

  {
    path: '/register',
    name: 'register',
    component: () => import('pages/Auth/Register/RegisterPage.vue'),
  },

  {
    path: '/first-access',
    name: 'first-access',
    component: () => import('pages/Auth/FirstAccess/FirstAccessPage.vue'),
  },

  {
    path: '/verify-code-access',
    name: 'verify-code-access',
    component: () => import('pages/Auth/VerifyCodeAccess/VerifyCodeAccessPage.vue'),
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/NotFound/NotFoundPage.vue'),
  },
];

export default routes;
