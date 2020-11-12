import React, { Component } from 'react';
import {Card,Typography} from 'antd';
import {
  Form, Icon, Input, Button, Checkbox,
} from 'antd';

import bgImg from './static/bg.jpg'

class NormalLoginForm extends Component {

  componentDidMount() {
    document.querySelector('body').setAttribute('background',bgImg)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '输入您的手机号!' }],
          })(
            <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住登录状态</Checkbox>
          )}
          <br></br>
          <a className="login-form-forgot" href="">忘记密码？</a>
          &nbsp;
          <a href="">注册帐号</a>
          <br></br>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);


class LoginPage extends Component {
  render() {
    return (
     <div style={{margin:'30px',paddingTop:'100px'}}>
        <Card style={{width:'400px',height:'400px',margin:'0 auto',textAlign:'center'}} bordered>
          <Typography.Title>
            登录帐号
          </Typography.Title>
          <WrappedNormalLoginForm/>
        </Card>
     </div>
    );
  }
}

export default LoginPage;



