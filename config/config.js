// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      targets: {
        ie: 11,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
      },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: true,
          }
        : {}),
    },
  ],
];

// judge add ga
if (process.env.APP_TYPE === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  // add for transfer to umi
  plugins,
  targets: {
    ie: 11,
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  proxy: {
      //测试环境,由NGINX转发
    '/frontApi': {
        target: 'http://10.100.200.48:8088/',//开发机器
        //target: 'http://10.8.70.73:8088/',//孙佳斌本机
        //target: 'http://10.8.30.23:8088/',//常俊机器
        //target: 'http://10.8.30.88:8088/',//冯梦蕾机器
        changeOrigin: true,
        pathRewrite: { '^/frontApi': '' }
    },
    //该配置仅在开发调试配置,解决本机跨域问题
    '/shiro-cas': {
        target: 'http://10.100.200.48:8088/',//开发机器
        //target: 'http://10.8.70.73:8088/',//孙佳斌本机
        //target: 'http://10.8.30.23:8088/',//常俊机器
        //target: 'http://10.8.30.88:8088/',//冯梦蕾机器
        changeOrigin: true,
        // pathRewrite: { '^/shiro-cas': '/shiro-cas' }
    },
    // '/frontApi': {
    //     target: 'http://10.8.30.88:8088',
    //     changeOrigin: true,
    // },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  chainWebpack: webpackPlugin,
};
