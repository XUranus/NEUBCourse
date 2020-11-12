
//  main.c
//  HotelManagement
//
//  Created by 王星校 on 2017/2/28.
//  Copyright @ 2017年 王星校. All rights reserved.
//
#include <stdio.h>
#include "Hotel.h"
#include "Guest.h"
#include <stdlib.h>
#include "SysConfig.h"
#include <windows.h>
#include <conio.h>
int main(int argc,  char ** argv)
{
    //FILE *fp;
    //fp=fopen("GuestData","r");
    //Encryption(fp);
    //Decipher(fp);

    MainMenu();
    Log_in();//登陆页面
    return 0;
}

