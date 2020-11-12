import React, { Component } from 'react';
import { Card } from 'antd';
const { Meta } = Card;

class CommodityPreviewCard extends Component {
  _props = {
    width: 230,
    height: 370,
    coverImage: "https://i1.mifile.cn/a1/pms_1550642182.7527088!220x220.jpg",
    title: "小米9 6GB+128GB",
    description: "骁龙855，索尼4800万超广角微距三摄",
    price: "2999"
  }

  handleClick = ()=>{
    console.log('clicked!')
  }

  render() {
    const props = this._props;
    return (
      <Card
        hoverable
        bordered
        style={{ 
          maxWidth: props.width, 
          maxHeight: props.height,
          textAlign:"center",
          margin:5
        }}
        cover={<img alt={props.description} src={props.coverImage} />}
        onClick={this.handleClick.bind(this)}
      >
      <Meta
        title={props.title}
        description={
          <div> 
            <p>{props.description}</p> 
            <p style={{color:'red',fontSize:18}}>{props.price}元</p> 
          </div>
        }
      />
    </Card>
    );
  }
}

export default CommodityPreviewCard;