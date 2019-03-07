export default [
  // app
  {
    path: "/",
    component: "../layouts/BasicLayout",
    Routes: ["src/pages/Authorized"],
    // authority: ["guest", "user"],
    routes: [
      // dashboard
      { path: '/', redirect: '/Dashboard/Analysis' },
      // 首页
      {
        path: "/dashboard",
        icon: "home",
        name: "dashboard",
        component: "./Dashboard/Analysis",
        authority: ["admin", "user"]
      },
      // 账号管理
      {
        path: "/accountManage",
        icon: "solution",
        name: "AccountManage",
        component: "./AccountManage/AccountManage",
        authority: ["admin", "user"]
      },
      // Banner管理
      {
        path: "/bannerManage",
        icon: "form",
        name: "bannerManage",
        component: "./BannerManage/BannerManage",
        authority: ["admin", "user"]
      },
      // 推送管理
      {
          path: "/pushManage",
          icon: "solution",
          name: "pushManage",
          component: "./PushManage/PushManage",
          authority: ["admin", "user"]
      },
        // 各项配置
        {
            path: "/configManage",
            icon: "solution",
            name: "configManage",
            component: "./ConfigManage/ConfigManage",
            authority: ["admin", "user"]
        },
      {
        name: "exception",
        icon: "warning",
        path: "/exception",
        routes: [
          // exception
          {
            path: "/exception/403",
            name: "not-permission",
            component: "./Exception/403"
          },
          {
            path: "/exception/404",
            name: "not-find",
            component: "./Exception/404"
          },
          {
            path: "/exception/500",
            name: "server-error",
            component: "./Exception/500"
          }
        ]
      },
      {
        component: "404"
      }
    ]
  }
];
