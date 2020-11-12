#ifndef SYSCONFIG_H//防止反复包含
#define SYSCONFIG_H
#include <ctype.h>
#include <string.h>
extern void MainMenu();
//void Encryption(FILE *);
//void ViewLog(FILE *);
//void Decipher(FILE *);
int Caesar_cipher(char dst[],char password[]);
void Caesar_trans(char pass[]);
void MainMenu();
void Log_in()//登录界面
{
    int PassLenth;
    FILE *p;
    p=fopen("SystemData","r");
    fscanf(p,"%d",&PassLenth);
    fclose(p);
    char dst[50],password[20];
    printf("        酒店管理系统登录 v1.0\n");
    printf("-----------------------------------\n");
    printf("密码:");
    char c;
    int i=0;
    while((c=getch())!='\r')//此模块为了防止密码回显
    {
        if(i<PassLenth && isprint(c))
        {
            password[i++]=c;
            putchar('*');
        }
        else if(i>0 && c=='\b')
        {
            --i;
            putchar('\b');
            putchar(' ');
            putchar('\b');
        }
    }
    putchar('\n');
    password[i]='\0';
    FILE *fp;
    fp=fopen("SystemData","r");
    fscanf(fp,"%d %s",&PassLenth,dst);
    fclose(fp);
    if(Caesar_cipher(dst,password))
    {
       // FILE *fp;//用户数据解码
        //fp=fopen("GuestData","r");
        //Decipher(fp);

        printf("-----------------------------------\n");
        printf("           登录成功!\n");
        getch();
        system("cls");
        MainMenu();
    }
    else
    {
        printf("     密码错误，请重新输入！\n");
        getch();
        system("cls");
        Log_in();
    }
}


void EditPassword()//修改密码
{
    char NewPassword1[20],NewPassword2[20];
    char c;
    int PassLenth;
    int i=0;
    char originpass[20],dst[20];
    FILE *pp;
    pp=fopen("SystemData","r");
    fscanf(pp,"%d",&PassLenth);
    fclose(pp);
    printf("       密码修改\n");
    printf("----------------------\n");
    printf("原密码：");
    while((c=getch())!='\r')//此模块为了防止密码回显
    {
        if(i<PassLenth && isprint(c))
        {
            originpass[i++]=c;
            putchar('*');
        }
        else if(i>0 && c=='\b')
        {
            --i;
            putchar('\b');
            putchar(' ');
            putchar('\b');
        }
    }
    putchar('\n');
    originpass[i]='\0';
    FILE *p;
    int t;
    p=fopen("SystemData","r");
    fscanf(p,"%d %s",&t,dst);
    fclose(p);
    //Caesar_trans(dst);
    if(Caesar_cipher(dst,originpass))
    {
        printf("新密码：");
        scanf("%s",NewPassword1);
        printf("确认：");
        scanf("%s",NewPassword2);
        if(strcmp(NewPassword1,NewPassword2))
        {
            printf("       两次输入不同！\n");
            getch();
            system("cls");
            EditPassword();
        }
        else
        {
            printf("      设置成功!\n");
            FILE *fp;
            fp=fopen("SystemData","w");
            Caesar_trans(NewPassword2);
            fprintf(fp,"%d %s",strlen(NewPassword2),NewPassword2);
            fclose(fp);
            getch();
            system("cls");
            MainMenu();
        }
    }
    else
    {
        printf("      密码错误！\n");
        getch();
        system("cls");
        EditPassword();
    }
 }

void MainMenu()//主界面
{
    time_t timep;
    char s[30];
    time(&timep);
    strcpy(s,ctime(&timep));
    printf("            酒店管理系统 v1.0\n");
    printf("当前时间:%s\n", s);
    printf("-----------------------------------\n");
    printf("1  查看旅店信息\n");
    printf("2  查看某一房间信息\n");
    printf("3  查看旅客信息\n");
    printf("4  查看某一旅客信息\n");
    printf("5  旅客入住\n");
    printf("6  旅客换房\n");
    printf("7  旅客退房\n");
    printf("8  修改密码\n");
    printf("9  退出程序\n");
    int num;
    printf("输入执行的序号：");
    scanf("%d",&num);
    switch(num)
    {
        case 1:system("cls");ViewAllHotel();break;//全部分加上system cls
        case 2:system("cls");ViewSpecificRoom();break;
        case 3:system("cls");ViewAllGuest();break;
        case 4:system("cls");ViewSpecificGuest();break;
        case 5:system("cls");CheckIn();break;
        case 6:system("cls");ChangeRoom();break;
        case 7:system("cls");CheckOut();break;
        case 8:system("cls");EditPassword();break;
        case 9:exit(0);
        default:
        {
            printf("输入无效，请重新输入！\n");
            getch();
            MainMenu();
        }
    }
}

void RewriteGuestData(struct guest *p)//向文件更新数据
{
    FILE *fp;
    fp=fopen("GuestData","w");
    while(p!=NULL)
    {
        fprintf(fp,"%d %s %s %s %s %s\n",&p->RoomId,p->name,p->id,p->sex,p->CheckInTime,p->CheckOutTime,p->RoomId);
        p=p->next;
    }
    fclose(fp);
}


/*
void ViewLog(FILE *fp)
{
	fseek(fp,0,SEEK_END);
	int file_size;
	file_size=ftell(fp);
	char *tmp;
	fseek(fp,0,SEEK_SET);
	tmp=(char *)malloc(file_size * sizeof(char));
	fread(tmp,file_size,sizeof(char),fp);
	printf("%s",tmp );
	fclose(fp);
}
*/
int Caesar_cipher(char dst[],char password[])
{
	char temp_str[100];
	memset(temp_str,'\0',sizeof(temp_str));
	strcpy(temp_str,dst);
	int i;
	for(i=0;i<=strlen(temp_str)-1;i++)
	{
		temp_str[i]-=3;
	}
	if(!strcmp(temp_str,password)) return 1;
	else return 0;
}

void Caesar_trans(char pass[])
{
	int i;
	for(i=0;i<=strlen(pass)-1;i++)
	{
		pass[i]+=3;
	}
}

#endif
