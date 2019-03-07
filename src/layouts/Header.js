import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';
import Authorized from '@/utils/Authorized';
import MessageModal from './MessageModal';
import Utils from '@/Common/Utils';

const Util = new Utils();
const {MessageCoutent} = new MessageModal();

const { Header } = Layout;

class HeaderView extends PureComponent {
  state = {
    visible: true,
    messageVisible:false,
    noticeVisible:false,
    messageRecord:{}
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
    //获取站内消息
      this.getMessageList();

  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleNoticeClear = type => {
    message.success(
      `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
        id: `component.globalHeader.${type}`,
      })}`
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch,dynamicmenu } = this.props;
    if (key === 'userCenter') {
      router.push('/account/center');
      return;
    }
    if (key === 'triggerError') {
      router.push('/exception/trigger');
      return;
    }
    if (key === 'userinfo') {
        //外链页面
        window.location.href = dynamicmenu.userInfo.editPwdUrl;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
      //外链页面
      window.location.href = dynamicmenu.userInfo.logoutUrl;
    }
  };

  getMessageList =()=>{
      const { dispatch } = this.props;
      dispatch({
          type: 'messageTip/getMessage',
      });
  }

  handleNoticeVisibleChange = visible => {
    if (visible) {
      this.getMessageList();
    }
    this.setState({
        noticeVisible:visible,
    })
  };
  //查看消息
  showMessage =(flag,item)=>{
    this.setState({
        messageVisible:flag,
        noticeVisible:false,
        messageRecord:item,
    })
      if(!flag){
        this.getMessageList();
      }
      if(flag){
        this.readMessage(item);
        this.getMessageList();
      }
  }

  //阅读消息
  readMessage =(item)=>{
      const { dispatch } = this.props;
      dispatch({
          type: 'messageTip/readMessage',
          payload:item,
          callback:(response)=>{
              if(!Util.success(response)){
                  message.error('更新消息状态失败')
              }
          }
      });
  }

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        }
        if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        }
        if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  render() {
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible,messageVisible,noticeVisible,messageRecord} = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();

      const parentMethods = {
          showMessage:this.showMessage,
      };

    const HeaderDom = visible ? (
      <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            Authorized={Authorized}
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            showMessage={this.showMessage}
            messageVisible={messageVisible}
            noticeVisible={noticeVisible}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            showMessage={this.showMessage}
            messageVisible={messageVisible}
            noticeVisible={noticeVisible}
            {...this.props}
          />
        )}
      </Header>
    ) : null;
    return (
        <div>
          <Animate component="" transitionName="fade">
            {HeaderDom}
          </Animate>
          <MessageCoutent {...parentMethods} messageVisible={messageVisible} messageRecord={messageRecord} />
        </div>
    );
  }
}

export default connect(({ dynamicmenu, messageTip,global, setting, loading }) => ({
  currentUser:dynamicmenu.userInfo,
  collapsed: global.collapsed,
  fetchingNotices: loading.effects['messageTip/getMessage'],
    readedList: messageTip.readedList,
    unReadedList: messageTip.unReadedList,
    unReadedCount:messageTip.unReadedCount,
  setting,
}))(HeaderView);
