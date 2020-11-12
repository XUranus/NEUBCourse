
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

struct RoomInfo *LoadList_Hotel()//���ط�����Ϣ
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

void ViewAllHotel()//�鿴���з�����Ϣ
{
	struct RoomInfo *head,*p=LoadList_Hotel();
	printf("�����   ��������   ����ס����   �۸�\n");
	printf("-------------------------------------\n");
	while(p->next!=NULL)
	{
	printf("%d     ",p->RoomNum);
	switch(p->RoomType)
	{
		case 1:printf("���˼�");break;
		case 2:printf("˫�˼�");break;
		case 3:printf("���˼�");break;
		default:break;
	}
	printf("      %d        %dԪ\n",p->CheckInNum,p->Price);
	p=p->next;
	}
	printf("-------------------------------------\n");
	getch();
	system("cls");
	MainMenu();
}


void SearchRoom(int num)//�鿴ĳһ����״̬
{
	struct RoomInfo *head,*p;
	p=head=LoadList_Hotel();
	int flag=0;
	while(p->next!=NULL)
	{
		if(p->RoomNum==num)
		{
			flag=1;
			printf("�����   ����   �۸�   ״̬\n");
			printf("%d    %d    %d   ",p->RoomNum,p->RoomType,p->Price);
			if(p->CheckInNum==0)
			{
				printf("��ʱ������ס");
				getch();
				system("cls");
				break;
			}
			else
			{
				printf("%d�˾�ס",p->CheckInNum);
			}
			break;
		}
		system("cls");
		p=p->next;
	}
	if(!flag)
	{
		printf("�Ҳ����˷��䣡");
		getch();
		system("cls");
		ViewSpecificRoom();
	}
	MainMenu();
}

void ViewSpecificRoom()//�鿴�ض�����״̬������������SearchRoom����
{
	printf("����Ҫ���ҵķ���ţ�");
	int input_num;
	scanf("%d",&input_num);
	SearchRoom(input_num);
}


#endif
