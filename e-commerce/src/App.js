import React, { Component } from 'react';
import { LocaleProvider } from 'antd';
//import './App.css';
import { BrowserRouter, Route} from 'react-router-dom';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import MainLayout from './MainLayout';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Demo from './Demo'
import UserDash from './UserDash.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <LocaleProvider locale={zhCN}>
          <BrowserRouter>
            <Route path="/demo" component={Demo}/>
            <Route path="/login" component={LoginPage}/>
            <Route path="/register" component={RegisterPage}/>

            <Route path="/item/:id" component={MainLayout}/>
            <Route exact path="/" component={MainLayout}/>
        
            <Route path="/user" component={UserDash}/>
          </BrowserRouter>
        </LocaleProvider>
      </div>
    );
  }
}

export default App;