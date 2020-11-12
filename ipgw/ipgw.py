#!/usr/bin/python
# -*- coding: UTF-8 -*-
import requests
import sys
import getopt

headers = {
    "User_Agent" : "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36"
}

auth_action_url = 'http://ipgw.neu.edu.cn/include/auth_action.php'
phone_login_url = 'http://ipgw.neu.edu.cn/srun_portal_phone.php'
pc_login_url = 'http://ipgw.neu.edu.cn/srun_portal_pc.php?ac_id=1&'

def logout():
    logout_data = {
        "action":"auto_logout",
        "info": "", 
        #"username":uid, 
        #"password":password, 
    }
    res = requests.post(auth_action_url, data = logout_data, headers = headers)
    print(res.text)
    print('已注销')

def login_to_pc(uid,password):
    login_data = {
        "action":"login", 
        "ac_id": 1, 
        "user_ip":"",
        "nas_ip":"",
        "user_mac":"",
        "url":"",
        "save_me": 0,
        "username":uid, 
        "password":password,
    }
    res = requests.post(pc_login_url, data = login_data, headers = headers)
    #print(res.text)

def login_to_phone(uid,password):
    login_data = {
        "action":"login", 
        "ac_id": 1, 
        "user_ip":"",
        "nas_ip":"",
        "user_mac":"",
        "username":uid, 
        "password":password,
    }
    res = requests.post(pc_login_url, data = login_data, headers = headers)
    #print(res.text)

def show_usage_data():
    info_data = {
        "action":"get_online_info", 
        "key": "5874"
    }
    res = requests.post(auth_action_url, data = info_data, headers = headers)
    if(res.text=='not_online'):
        print('not_online')
    else:
        list = res.text.split(',')
        G = int(list[0]) // (1024 * 1024 * 1024)
        M = (int(list[0]) % (1024 * 1024 * 1024)) // (1024 * 1024)
        Hour = int(list[1]) // (60 * 60)
        Minute = (int(list[1]) % (60 * 60)) // 60
        Second = (int(list[1]) % (60 * 60)) % 60
        res = list[2]

        print("成功登陆！")
        print("已用流量: %sG %sM" %(G, M))
        print("已用时长: %s时%s分%s秒" %(Hour, Minute, Second))
        print("剩余余额: " + res)


if __name__ == "__main__":
    if(len(sys.argv)<3):
        if(sys.argv[1]=='logout'):
            logout()
        else:
            print('missing params!')
        exit(0)
    uid = sys.argv[1]
    password = sys.argv[2]
    mode = sys.argv[3]
    if(mode=='--pc'):
        login_to_pc(uid,password)
    else:
        login_to_phone(uid,password)
    show_usage_data()
    