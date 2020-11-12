import React, { Component } from 'react';
import { Layout,Menu, Icon } from 'antd';
import { BrowserRouter, Route} from 'react-router-dom';
import HomePanel from './HomePanel'
import CommodityDetailPanel from './CommodityDetailPanel'

const {
  Header, Footer, Content,
} = Layout;

class MainLayout extends Component {

  render = ()=>{
    return(
    <Layout className="layout">

      <Header theme="dark" style={{ height: '30px' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '30px',position:'absolute',right:0 }}
        >
          <Menu.Item key="1">购物车</Menu.Item>
          <Menu.Item key="2">用户XXX</Menu.Item>
          <Menu.Item key="3">退出</Menu.Item>
        </Menu>
      </Header>

      <Header style={{background:'white'}}>
        <div className="logo" ></div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">笔记本</Menu.Item>
          <Menu.Item key="2">红米</Menu.Item>
          <Menu.Item key="3">电视</Menu.Item>
          <Menu.Item key="4">笔记本</Menu.Item>
          <Menu.Item key="5">红米</Menu.Item>
          <Menu.Item key="6">电视</Menu.Item>
          <Menu.Item key="7">笔记本</Menu.Item>
          <Menu.Item key="8">红米</Menu.Item>
          <Menu.Item key="9">电视</Menu.Item>
        </Menu>
      </Header>

      

      <Content style={{width:'1400px',margin:'0 auto'}}>
        <br></br>
        <BrowserRouter>
          <Route exact path="/" component={HomePanel}/>
          <Route path="/item/:id" component={CommodityDetailPanel}/>
        </BrowserRouter>
      </Content>


      
      <Footer style={{ textAlign: 'center' }}>
        ECommerce Site ©2019 Created by XUranu
      </Footer>
    </Layout>
    )
  }
}

export default MainLayout