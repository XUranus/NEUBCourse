#ifndef SYSCONFIG_H//��ֹ��������
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
void Log_in()//��¼����
{
    int PassLenth;
    FILE *p;
    p=fopen("SystemData","r");
    fscanf(p,"%d",&PassLenth);
    fclose(p);
    char dst[50],password[20];
    printf("        �Ƶ����ϵͳ��¼ v1.0\n");
    printf("-----------------------------------\n");
    printf("����:");
    char c;
    int i=0;
    while((c=getch())!='\r')//��ģ��Ϊ�˷�ֹ�������
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
       // FILE *fp;//�û����ݽ���
        //fp=fopen("GuestData","r");
        //Decipher(fp);

        printf("-----------------------------------\n");
        printf("           ��¼�ɹ�!\n");
        getch();
        system("cls");
        MainMenu();
    }
    else
    {
        printf("     ����������������룡\n");
        getch();
        system("cls");
        Log_in();
    }
}


void EditPassword()//�޸�����
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
    printf("       �����޸�\n");
    printf("----------------------\n");
    printf("ԭ���룺");
    while((c=getch())!='\r')//��ģ��Ϊ�˷�ֹ�������
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
        printf("�����룺");
        scanf("%s",NewPassword1);
        printf("ȷ�ϣ�");
        scanf("%s",NewPassword2);
        if(strcmp(NewPassword1,NewPassword2))
        {
            printf("       �������벻ͬ��\n");
            getch();
            system("cls");
            EditPassword();
        }
        else
        {
            printf("      ���óɹ�!\n");
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
        printf("      �������\n");
        getch();
        system("cls");
        EditPassword();
    }
 }

void MainMenu()//������
{
    time_t timep;
    char s[30];
    time(&timep);
    strcpy(s,ctime(&timep));
    printf("            �Ƶ����ϵͳ v1.0\n");
    printf("��ǰʱ��:%s\n", s);
    printf("-----------------------------------\n");
    printf("1  �鿴�õ���Ϣ\n");
    printf("2  �鿴ĳһ������Ϣ\n");
    printf("3  �鿴�ÿ���Ϣ\n");
    printf("4  �鿴ĳһ�ÿ���Ϣ\n");
    printf("5  �ÿ���ס\n");
    printf("6  �ÿͻ���\n");
    printf("7  �ÿ��˷�\n");
    printf("8  �޸�����\n");
    printf("9  �˳�����\n");
    int num;
    printf("����ִ�е���ţ�");
    scanf("%d",&num);
    switch(num)
    {
        case 1:system("cls");ViewAllHotel();break;//ȫ���ּ���system cls
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
            printf("������Ч�����������룡\n");
            getch();
            MainMenu();
        }
    }
}

void RewriteGuestData(struct guest *p)//���ļ���������
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
