
#ifndef HOTEL_H
#define HOTEL_H
#include <stdlib.h>
void ViewSpecificRoom();
extern struct guest *Load_GuestInfo();
extern void RewriteGuestData(struct guest *p);
extern void MainMenu();

typedef enum Room_Type{
	Single=1,
	Double=2,
	Trible=3,
}Room_Type;

typedef struct RoomInfo{
	int RoomNum;
	int CheckInNum;
	Room_Type RoomType;
	int Price;
	struct RoomInfo *next;
}Room;

struct RoomInfo *LoadList_Hotel()//加载房间信息
{
	struct RoomInfo *head,*p;
	fflush(stdin);
	FILE *fp;
	fp=fopen("RoomStatus","r");
	p=head=malloc(sizeof(struct RoomInfo));
	while(fscanf(fp,"%d %d %d %d",&p->RoomNum,&p->CheckInNum,&p->RoomType,&p->Price)==4)
	{
		 p->next=malloc(sizeof(struct RoomInfo));
		 p=p->next;
	}
	fclose(fp);
	p=NULL;
	return head;
}

void ViewAllHotel()//查看所有房间信息
{
	struct RoomInfo *head,*p=LoadList_Hotel();
	printf("房间号   房间种类   已入住人数   价格\n");
	printf("-------------------------------------\n");
	while(p->next!=NULL)
	{
	printf("%d     ",p->RoomNum);
	switch(p->RoomType)
	{
		case 1:printf("单人间");break;
		case 2:printf("双人间");break;
		case 3:printf("三人间");break;
		default:break;
	}
	printf("      %d        %d元\n",p->CheckInNum,p->Price);
	p=p->next;
	}
	printf("-------------------------------------\n");
	getch();
	system("cls");
	MainMenu();
}


void SearchRoom(int num)//查看某一房间状态
{
	struct RoomInfo *head,*p;
	p=head=LoadList_Hotel();
	int flag=0;
	while(p->next!=NULL)
	{
		if(p->RoomNum==num)
		{
			flag=1;
			printf("房间号   种类   价格   状态\n");
			printf("%d    %d    %d   ",p->RoomNum,p->RoomType,p->Price);
			if(p->CheckInNum==0)
			{
				printf("暂时无人入住");
				getch();
				system("cls");
				break;
			}
			else
			{
				printf("%d人居住",p->CheckInNum);
			}
			break;
		}
		system("cls");
		p=p->next;
	}
	if(!flag)
	{
		printf("找不到此房间！");
		getch();
		system("cls");
		ViewSpecificRoom();
	}
	MainMenu();
}

void ViewSpecificRoom()//查看特定房间状态，将参数传给SearchRoom（）
{
	printf("输入要查找的房间号：");
	int input_num;
	scanf("%d",&input_num);
	SearchRoom(input_num);
}


#endif
