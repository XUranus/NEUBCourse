import React, { Component } from 'react';
import { Popover, Button, Card,Row, Col,Divider,Typography } from 'antd';
import 'react-chat-elements/dist/main.css';
import {Popup, Input,ChatList,MessageList } from 'react-chat-elements';

//https://github.com/detaysoft/react-chat-elements#readme

const chatData = [{
  avatar: 'https://avatars1.githubusercontent.com/u/27334096?s=460&v=4',
  alt: 'Reactjs',
  title: 'Facebook',
  subtitle: 'What are you doing?',
  date: new Date(),
  unread: 1,
},{
  avatar: 'https://avatars1.githubusercontent.com/u/27334096?s=460&v=4',
  alt: 'Reactjs',
  title: 'Facebook',
  subtitle: 'What are you doing?',
  date: new Date(),
  unread: 1,
},{
  avatar: 'https://avatars1.githubusercontent.com/u/27334096?s=460&v=4',
  alt: 'Reactjs',
  title: 'Facebook',
  subtitle: 'What are you doing?',
  date: new Date(),
  unread: 1,
},{
  avatar: 'https://avatars1.githubusercontent.com/u/27334096?s=460&v=4',
  alt: 'Reactjs',
  title: 'Facebook',
  subtitle: 'What are you doing?',
  date: new Date(),
  unread: 1,
}]

const messageData = [
{
    position: 'right',
    type: 'text',
    text: 'Hello hey man what fuck',
    date: new Date(),
    avatar: 'https://avatars1.githubusercontent.com/u/27334096?s=460&v=4',
},{
    position: 'left',
    type: 'text',
    text: 'Hello hey man what fuck',
    date: new Date(),
    avatar: 'https://avatars1.githubusercontent.com/u/27334096?s=460&v=4',
},{
  position: 'right',
  type: 'text',
  text: 'Hello hey man what fuck',
  date: new Date(),
  avatar: 'https://avatars1.githubusercontent.com/u/27334096?s=460&v=4',
},{
    position:'left',
    type:'photo',
    text:'react.svg',
    data:{
      uri:'https://avatars1.githubusercontent.com/u/27334096?s=460&v=4',
      status: {
        click: false,
        loading: 0,
      }
    }
  },{
    position:'center',
    type:'text',
    text:'system message',
  }
]

const EmojiPanel =  (<div>emoji list here</div>)

class ChatPanel extends Component {
  render = ()=>{
    return (
    <Card style={{margin:'40px',maxWidth:'1300px'}} bordered>
    <Typography.Title>正在和XX聊天</Typography.Title>
    <Divider></Divider>
    <Row>
      <Col span={8} >
        <ChatList
          className='chat-list'
          dataSource={chatData}/>
      </Col>
      <Col span={16} >
        <Row>
          <MessageList
            className='message-list'
            lockable={true}
            toBottomHeight={'100%'}
            avatar={'https://avatars1.githubusercontent.com/u/27334096?s=460&v=4'}
            dataSource={messageData} />
          <Divider></Divider>
          <div>
            <Popover content={EmojiPanel} title="Title">
              <Button icon="smile"></Button>
            </Popover>
            <Button icon="picture"></Button>
          </div>
          <Input
            placeholder="在此输入消息..."
            multiline={true}
            rightButtons={
                <Button type="primary">发送</Button>
            }/>
        </Row>
      </Col>
    </Row>
  
      
    <Popup
        show={false}
        header='Lorem ipsum dolor sit amet.'
        headerButtons={[{
            type: 'transparent',
            color:'black',
            text: 'close',
            onClick: () => {
                this.setState({show: false})
            }
        }]}
        text='Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem animi veniam voluptas eius!'
        footerButtons={[{
            color:'white',
            backgroundColor:'#ff5e3e',
            text:"Vazgeç",
        },{
            color:'white',
            backgroundColor:'lightgreen',
            text:"Tamam",
        }]}/>

    </Card>);
  }
}

export default ChatPanel;