
//  main.c
//  HotelManagement
//
//  Created by ����У on 2017/2/28.
//  Copyright @ 2017�� ����У. All rights reserved.
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
    Log_in();//��½ҳ��
    return 0;
}

