import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { Spin, Tag, Menu, Icon, Dropdown, Avatar, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import defaultHeader from "../../assets/defaultHeader.png";
import styles from './index.less';
import Utils from '@/Common/Utils'

const Util = new Utils();
export default class GlobalHeaderRight extends PureComponent {
  getNoticeData(notices) {
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.dateTime) {
        newNotice.datetime = moment(newNotice.dateTime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      showMessage,
      theme,
      messageVisible,
      noticeVisible,
      unReadedCount
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
      </Menu>
    );
    const {readedList,unReadedList} = this.props;
    const noticeData = Util.isNotNull(readedList)?this.getNoticeData(readedList):{};
    const unNoticeData = Util.isNotNull(unReadedList)?this.getNoticeData(unReadedList):{};
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
          <NoticeIcon
              className={styles.action}
              count={unReadedCount}
              popupVisible={noticeVisible}
              onItemClick={(item, tabProps) => {
                  showMessage(true,item)
              }}
              locale={{
                  emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
              }}
              onPopupVisibleChange={onNoticeVisibleChange}
              loading={fetchingNotices}
          >
          <NoticeIcon
              list={unNoticeData.notification}
              title={formatMessage({ id: 'component.globalHeader.notification' })}
              avatar={'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png'}
              name="notification"
              emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />
          <NoticeIcon
              list={noticeData.notification}
              title={formatMessage({ id: 'component.globalHeader.message' })}
              name="notification"
              emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
              emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
      </NoticeIcon>


        <Tooltip title={formatMessage({ id: 'component.globalHeader.switch.system' })}>
          <a
              target="_self"
              href={currentUser.swichUrl}
              rel="noopener noreferrer"
              className={styles.action}
          >
            <Icon type="windows" />
          </a>
        </Tooltip>
        {currentUser.name ? (
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={defaultHeader}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </Dropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
      </div>
    );
  }
}
