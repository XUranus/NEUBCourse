import React, { Component } from 'react';
//import Carousel from 'nuka-carousel';
import CommodityPreviewCard from './CommodityPreviewCard'
import {Row, Col,Carousel} from 'antd';
//import './App.css'


class HomePanel extends Component {

  render = ()=>{

    return(
      <div>
  
        <Carousel
          infinite
          speed={1000}
          autoplay={true}
          effect="fade"
        >
        {[1,2,3].map((index)=>(<img alt="img" src="//i1.mifile.cn/a4/xmad_15548066591437_Stxlj.jpg"/>))}
        </Carousel>

        <Row gutter={16}>
          {[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((x)=>(
            <Col className="gutter-row" span={4}>
              <CommodityPreviewCard/>
            </Col>
          ))}
        </Row>

      </div>
    )
  }
}

export default HomePanel