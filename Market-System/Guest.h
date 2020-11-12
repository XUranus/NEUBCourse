#ifndef GUEST_H
#define GUEST_H
#include <string.h>
#include <time.h>
char *LocalTime();
void ViewSpecificGuest();
void SearchGuestId(char str[]);
void ViewAllGuest();
extern void MainMenu();
void AddHistory(struct guest *p);
void ChangeRoom();
void DeleteGuestData(struct guest *p,struct guest *head);

typedef struct guest{//旅客信息结构体
	char name[20];
	char sex[10];
	char id[20];
	char CheckInTime[100];
	char CheckOutTime[100];
	int RoomId;
	struct guest *next;
}Guest;

struct guest *Load_GuestInfo()//加载旅客信息链表 返回头指针
{
	struct guest *head,*p;
	fflush(stdin);
	FILE *fp;
	fp=fopen("GuestData","r");
	p=head=malloc(sizeof(struct guest));
	fflush(stdin);
	while(fscanf(fp,"%d %s %s %s %s %s",&p->RoomId,p->name,p->id,p->sex,p->CheckInTime,p->CheckOutTime)!=EOF)
	{
		 p->next=malloc(sizeof(struct guest));
		 p=p->next;
	}
	p=p->next=NULL;
	fclose(fp);
	return head;
}

void ViewAllGuest()//查看所有旅客的信息
{
	struct guest *head,*p;
	head=p=Load_GuestInfo();
	printf("名字     性别             身份证号\n");
	printf("-----------------------------------------\n");
	do
	{
	printf("%s       %s     %s   \n",p->name,p->sex,p->id);
	p=p->next;
	}while(p->next!=NULL);
	printf("----------------------------------------\n");
	getch();
	system("cls");
	MainMenu();

}

void ViewSpecificGuest()//查看特定的旅客
{
	printf("输入要查找的旅客身份证号：");
	char input_id[20];
	scanf("%s",input_id);
	SearchGuestId(input_id);
}

void SearchGuestId(char str[])//查询旅客的ID
{
	struct guest *head,*p;
	p=head=Load_GuestInfo();
	int flag=0;
	while(p!=NULL)
	{
		if(!strcmp(p->id,str))
		{
			flag=1;
			printf("姓名    性别         身份证号       开房时间          退房时间\n");
			printf("%s    %s   %s   %s  ",p->name,p->sex,p->id,p->CheckInTime);
			//if(p->In) printf("入住中");
			//else printf("%s",p->CheckOutTime);
			break;
		}
		p=p->next;
	}
	if(!flag)
	{
		printf("找不到此人！");
		getch();
		system("cls");
		ViewSpecificGuest();
	}	
	getch();
	system("cls"); 
	MainMenu();//返回主菜单
}

void CheckIn()//开房间函数
{
	char name[20];
	char sex[10];
	char id[20];
	int In=1;
	char CheckInTime[20];
	char CheckOutTime[20]="0";
	int Roomid;
	printf("登记新的旅客信息\n");
	printf("姓名:") ;
	scanf("%s",name);
	printf("性别:");
	scanf("%s",sex);
	printf("身份证号:");
	scanf("%s",id);
	printf("开房时间:%s\n",LocalTime());
	getch();
	printf("选择房间号：");
	scanf("%d",&Roomid);
	FILE *fp;
	fp=fopen("GuestData","a");
	fprintf(fp,"%d %s %s %s %s %s \n",Roomid,name,id,sex,LocalTime(),CheckOutTime);
	fclose(fp);
	printf("登记成功！\n");
	system("cls");
	MainMenu();
}

void ChangeRoom()//换房间函数
{
	char id[20];
	printf("    换房系统\n");
	printf("身份证号:");
	scanf("%s",id);//此处可优化界面，调用与查看旅客身份函数
	struct guest *head,*p;
	p=head=Load_GuestInfo();
	int flag=0;
	int ChangeRoomNum;
	while(p!=NULL)
	{
		if(!strcmp(p->id,id))
		{
			flag=1;
			printf("姓名    性别         身份证号       当前房间号  开房时间\n");
			printf("%s    %s   %s     %d  %s   ",p->name,p->sex,p->id,p->RoomId,p->CheckInTime);
			printf("换房号:");
			scanf("%d",&ChangeRoomNum);
			p->RoomId=ChangeRoomNum;
			RewriteGuestData(head);
			printf("换房成功！");
			getch();
			system("cls");
			MainMenu();
			break;
		}
		p=p->next;
	}
	if(!flag)
	{
		printf("找不到此人！");
		getch();
		system("cls");
		ChangeRoom();
	}
}

void CheckOut()//退房函数
{
	char id[20];
	printf("    退房系统\n");
	printf("身份证号:");
	scanf("%s",id);//此处可优化界面，调用与查看旅客身份函数
	struct guest *head,*p;
	p=head=Load_GuestInfo();
	int flag=0;
	char choice;
	while(p!=NULL)
	{
		if(!strcmp(p->id,id))
		{
			flag=1;
			printf("姓名    性别         身份证号       开房时间      退房时间\n");
			printf("%s    %s   %s   %s   %s   \n",p->name,p->sex,p->id,p->CheckInTime,LocalTime());
			printf( "确定退房？Y/N\n");
			fflush(stdin);
			scanf("%c",&choice);
			if(choice=='Y') {AddHistory(struct guest *p);DeleteGuestData(p,head);AddHistory(p);}
			else if(choice=='N') {
                    printf("已取消！");break;}
			else {
                printf("输入错误！");
                CheckOut();
			}
			system("cls");
			MainMenu();
		}
		p=p->next;
	}
	if(!flag)
	{
		printf("找不到此人！");
		getch();
		system("cls");
		ChangeRoom();
	}
}

void DeleteGuestData(struct guest *link,struct guest *list)
{
  struct guest *tmp;
  struct guest *prev;
  prev=NULL;
  tmp=list;
  while(tmp)
    {
      if(tmp==link)
        {
          if(prev)
            prev->next=tmp->next;
          if (list==tmp)
            list=list->next;
            tmp->next = NULL;
          break;
        }
      prev=tmp;
      tmp=tmp->next;
    }
    RewriteGuestData(list);
}

char *LocalTime()//获取时间函数
{
    FILE *fp;
    fp=fopen("temp","w");
    time_t timep;
    struct tm *p;
    time(&timep);
    p = localtime(&timep); //取得当地时间
    fprintf(fp,"%d-%d-%d", (1900+p->tm_year), (1+p->tm_mon), p->tm_mday);
    fprintf(fp,"(%d:%d:%d)\n",p->tm_hour, p->tm_min, p->tm_sec);
    fclose(fp);
    FILE *fp2;
    fp2=fopen("temp","r");
    char str[100];
    fscanf(fp2,"%s",str);
    fclose(fp2);
    remove("temp");
    return str;
}

void AddHistory(struct guest *p)
{
    FILE *fp;
    fp=fopen("HistoryGuest","a");
    fprintf(fp,"%s %s %s %d %s %s\n", p->name,p->sex,p->id,p->RoomId,p->CheckInTime,LocalTime());
    fclose(fp);
}

#endif
