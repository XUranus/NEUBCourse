import React, { Component } from 'react';
import {Tabs, Card, Row, Col, Button, Typography, Radio ,Statistic,Icon,Rate } from 'antd';
import { Comment, Avatar } from 'antd';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import display1 from './static/display1.jpg'
import display2 from './static/display2.jpg'

const { Title, Text } = Typography;
const TabPane = Tabs.TabPane;


const ExampleComment = ({ children }) => (
  <Comment
    actions={[<span>回复</span>]}
    author={<span>Han Solo</span>}
    avatar={(
      <Avatar
        src="static/avatar.png"
        alt="Han Solo"
      />
    )}
    content={<p>We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure).</p>}
  >
    {children}
  </Comment>
);

class CommodityDetailPanel extends Component {

  _props = {
    title:'小米9 SE',
    description:'索尼4800万超广角三摄 / 骁龙712全球首发 / 全息幻彩机身 / 三星AMOLED屏幕 / 5.97”水滴屏 / 第五代屏幕指纹识别 / 多功能NFC / 红外遥控',
    price:2999,
  }

  state = {
    size: 'default',
  };

  handleSizeChange = (e) => {
    this.setState({ size: e.target.value });
  }

  render() {
    const props = this._props;
    return (
      <div>
        <Card>
          <Row style={{margin:'10px'}}>

            <Col span={12}>
              <Card bordered>
                <Carousel 
                  autoPlay
                  dynamicHeight
                >
                <div key={1}>
                    <img 
                      alt="demo"
                      style={{height:'100%'}}
                      src={display2}/>
                    <p className="legend">Image 1</p>
                </div>
                <div key={2}>
                    <img 
                      alt="demo"
                      style={{height:'100%'}}
                      src={display1}/>
                    <p className="legend">Image 2</p>
                </div>
                </Carousel>
              </Card>
            </Col>

            <Col span={12} style={{padding: '100px 0'}}>
              <Card style={{margin:'20px'}}>
                <Title level={2}>{props.title}</Title>
                <Text>{props.description}</Text>
                <Title level={2} type="warning">{props.price}元</Title>

                <Radio.Group value={this.state.size} onChange={this.handleSizeChange}>
                  <Text>选择容量 </Text>
                  <Radio.Button value="large">64G</Radio.Button>
                  <Radio.Button value="default">128G</Radio.Button>
                  <Radio.Button value="small">512G</Radio.Button>
                </Radio.Group>

                <br/><br/>
                <div>
                  <Text>数量 </Text>
                  <Button type="default" icon="minus"/>
                  <Button><Text>1</Text></Button>
                  <Button type="default" icon="plus"/>
                </div>


                <br/><br/>
                <Button type="default" size="large" >加入购物车</Button> &nbsp;
                <Button type="danger" size="large">立即购买</Button>
                <br/><br/>
              </Card>

              <Card style={{margin:'20px'}}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic title="收藏" value={1128} prefix={<Icon type="star" />} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="销售量" value={234} prefix={<Icon type="stock" />} />
                  </Col>
                  <Col span={10}>
                    <span>
                      <span className="ant-rate-text">评分&nbsp;</span>
                      <Rate allowHalf disabled defaultValue={3.4}/>
                    </span>
                  </Col>
                </Row>      
              </Card>
            </Col>
          </Row>

          <Row>
            <Tabs defaultActiveKey="1" onChange={alert}>
              <TabPane tab="商品详情" key="2">Content of Tab Pane 1</TabPane>
              <TabPane tab="累计评论" key="1">
                <ExampleComment>
                  <ExampleComment>
                    <ExampleComment />
                    <ExampleComment />
                  </ExampleComment>
                </ExampleComment>
              </TabPane>
            </Tabs>
          </Row>
        </Card>
      </div>
    );
  }
}

export default CommodityDetailPanel;