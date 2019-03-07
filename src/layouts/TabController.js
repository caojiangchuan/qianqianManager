/**
 * Created by spark on 2018/11/22.
 */
import React from "react";
import { Tabs, message } from "antd";
import { routerRedux } from "dva/router";
import Authorized from "@/utils/Authorized";
import tabStyle from './TabController.less';
import Exception403 from "../pages/Exception/403";

const TabPane = Tabs.TabPane;

const havePermission = () => {
  return true;
};

// tab控制
export default class TabController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      panes: []
    };
  }

  componentWillMount() {
    const { name, keys, component } = this.props;

    if (keys === "/" || !name) {
      return;
    }

    const panes = this.state.panes;
    const activeKey = keys;
    panes.push({ name, key: activeKey, component });
    this.setState({ panes, activeKey });
  }

  componentWillReceiveProps(nextProps) {
    const { name, keys, component } = nextProps;
    if (keys === "/" || !name) {
      return;
    }
    const panes = this.state.panes;
    const activeKey = keys;
    let isExist = false;
    for (let i = 0; i < panes.length; i++) {
      if (panes[i].key === activeKey) {
        isExist = true;
        break;
      }
    }

    if (isExist) {
      this.setState({
        activeKey
      });
    } else {
      panes.push({ name, key: activeKey, component });
      this.setState({ panes, activeKey });
    }
  }

  onChange = activeKey => {
    this.props.dispatch(
      routerRedux.push({
        pathname: activeKey
      })
    );
  };

  onEdit = (targetkey, action) => {
    this[action](targetkey);
  };

  remove = targetKey => {
    if (this.state.panes.length === 1) {
      message.warning("窗口不能全关闭");
      return;
    }

    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey });
  };

  render() {
    const { location, match, buttonAuth } = this.props;
    return (
      <div>
        <Tabs
          className={tabStyle.tabsStyle}
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {this.state.panes.map(pane => (
            <TabPane
                className={tabStyle.tabsStyle}
                tab={pane.name}
                key={pane.key}>
              <Authorized
                authority={location.authority}
                noMatch={<Exception403 />}
              >
                <pane.component
                  location={location}
                  math={match}
                  buttonAuth={buttonAuth}
                />
              </Authorized>
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}
