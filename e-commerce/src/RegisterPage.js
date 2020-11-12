import React, { Component } from 'react';
import { Steps, Card,Form, Icon, Input,Typography} from 'antd';

const Step = Steps.Step;
const Text = Typography


class RegisterPage extends Component {
  state={
    step:3
  }

  render() {
    const step = this.state.step;
    //alert(step)
    return (
     <div style={{margin:'30px'}}>
       <Card bordered>
        <Steps>
          <Step status={step===1?"process":(step<1?"wait":"finish")} title="填写手机号" icon={<Icon type={step===1?"loading":"mobile"} />} />
          <Step status={step===2?"process":(step<2?"wait":"finish")} title="输入验证码" icon={<Icon type={step===2?"loading":"code"} />} />
          <Step status={step===3?"process":(step<3?"wait":"finish")} title="填写信息" icon={<Icon type={step===3?"loading":"file-text"}/>} />
          <Step status={step===4?"process":(step<4?"wait":"finish")} title="完成注册" icon={<Icon type={step===4?"loading":"user"} />} />
        </Steps>

        {step===1?<div style={{width:'300px',margin:'0 auto',textAlign:'center'}}>
          <Text>输入你的手机号</Text>
          <Form layout="inline">
            <Form.Item>
              <Input prefix={<Icon type="mobile"/>} />
            </Form.Item>
          </Form>
        </div>:null}

        {step===3?<div style={{width:'300px',margin:'0 auto',textAlign:'center'}}>
          <Text>填写信息</Text>
          <Form layout="inline">
            <Form.Item>
              <Input prefix={<Icon type="mobile"/>} />
            </Form.Item>
          </Form>
        </div>:null}


       </Card>
     </div>
    );
  }
}

export default RegisterPage;
//我们已经发送一条验证短信至+86 17640192541 请输入短信中的验证码