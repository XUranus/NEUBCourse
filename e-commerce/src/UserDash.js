import React, { Component } from 'react';
import {Layout, Menu, Icon, Card ,Table, Divider, Col,Row} from 'antd';
const SubMenu = Menu.SubMenu;
const { Content, Sider } = Layout;


const columns = [{
  title: '商品',
  dataIndex: 'item',
  key: 'item',
  render: item => 
  <Row>
    <Col span={12}><img alt="img" src={item.img} style={{width:'100%',maxWidth:'100px'}}/></Col>
    <Col span={12}>
      <p>{item.title}</p>
      <p style={{color:'gray'}}>{item.choice}</p>
    </Col>
  </Row>,
}, {
  title: '单价',
  dataIndex: 'price',
  key: 'price',
}, {
  title: '数量',
  dataIndex: 'num',
  key: 'num',
}, {
  title: '付款',
  key: 'costs',
  dataIndex: 'costs',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="javascript:;">退货</a>
      <Divider type="vertical" />
      <a href="javascript:;">签收</a>
    </span>
  ),
}];

const data = [{
  key: '1',
  item: {title:'小米MIX3',choice:'6G+128G太空灰',img:'//i8.mifile.cn/a1/pms_1540429662.99682335.jpg'},
  price: 32.01,
  num: 3,
  costs: 96.03,
},
{
  key: '1',
  item: {title:'小米MIX3',choice:'6G+128G太空灰',img:'//i8.mifile.cn/a1/pms_1540429662.99682335.jpg'},
  price: 32.01,
  num: 3,
  costs: 96.03,
},
{
  key: '1',
  item: {title:'小米MIX3',choice:'6G+128G太空灰',img:'//i8.mifile.cn/a1/pms_1540429662.99682335.jpg'},
  price: 32.01,
  num: 3,
  costs: 96.03,
}];


class UserDash extends Component {
  state = {
    menu:"5"
  };

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({menu:e.key})
  }

  render() {
    const menu = this.state.menu;

    return (
      <Card style={{margin:'50px'}}>
      <Layout>
        <Sider width={200}>
          <Menu
            onClick={this.handleClick}
            style={{ width: 200,minHeight:'700px' }}
            defaultSelectedKeys={['5']}
            defaultOpenKeys={['sub1','sub2','sub3','sub4','sub5']}
            mode="inline"
          >
            <SubMenu key="sub1" title={<span><Icon type="car" /><span>动态</span></span>}>
              <Menu.Item key="1">物流</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="shopping-cart" /><span>购物车</span></span>}>
              <Menu.Item key="2">我的购物车</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" title={<span><Icon type="shopping" /><span>已买到的宝贝</span></span>}>
              <Menu.Item key="3">已付款</Menu.Item>
              <Menu.Item key="4">待发货</Menu.Item>
              <Menu.Item key="5">待收货</Menu.Item>
              <Menu.Item key="6">待评价</Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title={<span><Icon type="user" /><span>个人信息</span></span>}>
              <Menu.Item key="7">基本信息</Menu.Item>
              <Menu.Item key="8">收获地址</Menu.Item>
            </SubMenu>
            <SubMenu key="sub5" title={<span><Icon type="safety" /><span>安全中心</span></span>}>
              <Menu.Item key="9">重设密码</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        
        <Content style={{
          background: '#fff', padding: 24, margin: 0, minHeight: 280,
        }}>
            {menu==="5"?<div>
              <Table columns={columns} dataSource={data} />
            </div>:null}

            
        </Content>
     

      </Layout>

      </Card>
    );
  }
}

export default UserDash;