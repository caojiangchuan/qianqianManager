import React from "react";
import { Layout, Icon, message, Tabs } from "antd";
import DocumentTitle from "react-document-title";
import isEqual from "lodash/isEqual";
import memoizeOne from "memoize-one";
import { connect } from "dva";
import { ContainerQuery } from "react-container-query";
import classNames from "classnames";
import pathToRegexp from "path-to-regexp";
import { enquireScreen, unenquireScreen } from "enquire-js";
import { formatMessage } from "umi/locale";
import SiderMenu from "@/components/SiderMenu";
import Authorized from "@/utils/Authorized";
import SettingDrawer from "@/components/SettingDrawer";
import logo from "../assets/logo.jpg";
import Footer from "./Footer";
import Header from "./Header";
import Context from "./MenuContext";
import Exception403 from "../pages/Exception/403";
import TabController from "./TabController";
import Utils from '@/Common/Utils'
import { getAuthority } from '../utils/authority';

const Util = new Utils();
const { Content } = Layout;
const TabPane = Tabs.TabPane;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = "menu";
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => {
      return item;
    });
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const query = {
  "screen-xs": {
    maxWidth: 575
  },
  "screen-sm": {
    minWidth: 576,
    maxWidth: 767
  },
  "screen-md": {
    minWidth: 768,
    maxWidth: 991
  },
  "screen-lg": {
    minWidth: 992,
    maxWidth: 1199
  },
  "screen-xl": {
    minWidth: 1200,
    maxWidth: 1599
  },
  "screen-xxl": {
    minWidth: 1600
  }
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    rendering: true,
    isMobile: false,
    menuData: this.getMenuData()
  };

  // getChildContext() {
  //     const { location, routerData } = this.props;
  //     return {
  //         location,
  //         breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
  //     };
  // }
  //组件渲染前调用
  componentWillMount(){
    const { dispatch } = this.props;
    dispatch({
      type:"dynamicmenu/getUserInfo",
    })

    dispatch({
      type:"dynamicmenu/getDynamicMenu",
      callback:(response)=>{
          if(Util.success(response)){
              localStorage.setItem('buttonAuth',response.data.buttonData);
          }
      }
    });

  }
  componentDidMount() {
    const {dynamicmenu} = this.props;

    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile
        });
      }
    });


  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap
    };
  }

  getMenuData() {
    const {
      route: { routes }
    } = this.props;
    return memoizeOneFormatter(routes);
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key => {
      return pathToRegexp(key).test(pathname);
    });
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    return "证大前前后端管理系统";
    /*
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return "证大钱钱后端管理系统";
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name
    });
    return `${message} - Ant Design Pro`;
    */
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== "topmenu" && !isMobile) {
      return {
        paddingLeft: collapsed ? "80px" : "256px"
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      // margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: "global/changeLayoutCollapsed",
      payload: collapsed
    });
  };

  renderSettingDrawer() {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    /*
    const { rendering } = this.state;
    if (
      (rendering || process.env.NODE_ENV === "production") &&
      APP_TYPE !== "site"
    ) {
      return null;
    }
    return <SettingDrawer />;
    */
  }

  render() {
    const {
      userInfo,
      dynamicmenu,
      navTheme,
      layout: PropsLayout,
      children,
      match,
      location: { pathname },
      routerData
    } = this.props;
    const routerConfig = this.matchParamsPath(location.pathname);
    const buttonAuth = dynamicmenu.buttonAuth;
    const tasParams = {
      keys: location.pathname,
      location,
      dispatch: this.props.dispatch,
      match,
      ...routerConfig,
      buttonAuth
    };
    let { menuData } = dynamicmenu;
    const menuTree = memoizeOneFormatter(menuData);

    const { isMobile } = this.state;
    const isTop = PropsLayout === "topmenu";
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            // Authorized={Authorized}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuTree}
            isMobile={isMobile}
            location={location}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: "100vh"
          }}
        >
          <Header
            menuData={menuTree}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content style={this.getContentStyle()}>
            <TabController {...tasParams} />

            {/* <Authorized*/}
            {/* authority={routerConfig && routerConfig.authority}*/}
            {/* noMatch={<Exception403 />}*/}
            {/* >*/}
            {/* {children}*/}
            {/* </Authorized>*/}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );

    {
      /* <Context.Provider value={this.getContext()}>*/
    }
    {
      /* <div className={classNames(params)}>{layout}</div>*/
    }
    {
      /* </Context.Provider>*/
    }
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => {
              return (
                <Context.Provider value={this.getContext()}>
                  <div className={classNames(params)}>{layout}</div>
                </Context.Provider>
              );
            }}
          </ContainerQuery>
        </DocumentTitle>
        {this.renderSettingDrawer()}
      </React.Fragment>
    );
  }
}

// 新增了动态菜单dynamicmenu和loading
export default connect(({ dynamicmenu, loading, global, setting }) => {
  return {
    dynamicmenu,
    loading: loading.effects["dynamicmenu/getDynamicmenu"],
    collapsed: global.collapsed,
    layout: setting.layout,
    ...setting
  };
})(BasicLayout);