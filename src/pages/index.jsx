import React, {Component} from "react";
import { Link } from 'umi';
import styles from './index.less';
import {Layout, Menu, Row, Col} from 'antd';
import {
  UserOutlined,
  InsertRowBelowOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import GoodsManage from "./goods/GoodsManage";
import InGoodsManage from "./inGoods/InGoodsManage";
import OutGoodsManage from "./outGoods/OutGoodsManage";
import CustomerManage from "./customer/CustomerManage";
import Dashboard from "./dashboard/Dashboard";

const {Header, Content, Sider} = Layout;

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menuKey: undefined,
      menuKeys: [],
    };
  }

  handleMenuChange = ({item, key, keyPath, domEvent}) => {
    this.setState({menuKey: key, menuKeys: [`${key}`]});
  };

  render() {
    let menuKey = this.state.menuKey;
    let content = <GoodsManage/>;

    switch (menuKey) {
      case "1":
        content = <GoodsManage/>;
        break;
      case "2":
        content = <InGoodsManage/>;
        break;
      case "3":
        content = <OutGoodsManage/>;
        break;
      case "4":
        content = <CustomerManage/>;
        break;
      default:
        content = undefined;
    }

    return (
      <div>
        <Layout>
          <Header className="header" style={{height: '44px', borderRight: 0}}>
            <Row>
              <Col span={12} style={{
                color: "white",
                lineHeight: "44px",
                fontSize:'xxx-large'
              }}>VENOM</Col>
            </Row>
          </Header>
          <Layout>
            <Sider width={150} className="site-layout-background">
              <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{height: '100%', borderRight: 0}}
                onClick={this.handleMenuChange}
                selectedKeys={this.state.menuKeys}
              >
                <Menu.Item key="1" icon={<AppstoreOutlined />}>商品管理</Menu.Item>
                <Menu.Item key="2" icon={<AppstoreAddOutlined />}>入库管理</Menu.Item>
                <Menu.Item key="3" icon={<InsertRowBelowOutlined />}>出库管理</Menu.Item>
                <Menu.Item key="4" icon={<UserOutlined/>}>客户管理</Menu.Item>
              </Menu>
            </Sider>
            <Layout style={{padding: '0 12px 12px'}}>
              <Content
                className="site-layout-background"
                style={{
                  padding: 12,
                  margin: 0,
                  minHeight: "100vh",
                }}
              >
                {this.state.menuKey ?  content :
                  <div style={{ background: '#f1f2f5', padding: '30px', minHeight: "100vh"}}>
                    <Dashboard/>
                  </div>
                }
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }

}

export default Index;
