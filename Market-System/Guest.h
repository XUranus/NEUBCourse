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

typedef struct guest{//�ÿ���Ϣ�ṹ��
	char name[20];
	char sex[10];
	char id[20];
	char CheckInTime[100];
	char CheckOutTime[100];
	int RoomId;
	struct guest *next;
}Guest;

struct guest *Load_GuestInfo()//�����ÿ���Ϣ���� ����ͷָ��
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

void ViewAllGuest()//�鿴�����ÿ͵���Ϣ
{
	struct guest *head,*p;
	head=p=Load_GuestInfo();
	printf("����     �Ա�             ���֤��\n");
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

void ViewSpecificGuest()//�鿴�ض����ÿ�
{
	printf("����Ҫ���ҵ��ÿ����֤�ţ�");
	char input_id[20];
	scanf("%s",input_id);
	SearchGuestId(input_id);
}

void SearchGuestId(char str[])//��ѯ�ÿ͵�ID
{
	struct guest *head,*p;
	p=head=Load_GuestInfo();
	int flag=0;
	while(p!=NULL)
	{
		if(!strcmp(p->id,str))
		{
			flag=1;
			printf("����    �Ա�         ���֤��       ����ʱ��          �˷�ʱ��\n");
			printf("%s    %s   %s   %s  ",p->name,p->sex,p->id,p->CheckInTime);
			//if(p->In) printf("��ס��");
			//else printf("%s",p->CheckOutTime);
			break;
		}
		p=p->next;
	}
	if(!flag)
	{
		printf("�Ҳ������ˣ�");
		getch();
		system("cls");
		ViewSpecificGuest();
	}	
	getch();
	system("cls"); 
	MainMenu();//�������˵�
}

void CheckIn()//�����亯��
{
	char name[20];
	char sex[10];
	char id[20];
	int In=1;
	char CheckInTime[20];
	char CheckOutTime[20]="0";
	int Roomid;
	printf("�Ǽ��µ��ÿ���Ϣ\n");
	printf("����:") ;
	scanf("%s",name);
	printf("�Ա�:");
	scanf("%s",sex);
	printf("���֤��:");
	scanf("%s",id);
	printf("����ʱ��:%s\n",LocalTime());
	getch();
	printf("ѡ�񷿼�ţ�");
	scanf("%d",&Roomid);
	FILE *fp;
	fp=fopen("GuestData","a");
	fprintf(fp,"%d %s %s %s %s %s \n",Roomid,name,id,sex,LocalTime(),CheckOutTime);
	fclose(fp);
	printf("�Ǽǳɹ���\n");
	system("cls");
	MainMenu();
}

void ChangeRoom()//�����亯��
{
	char id[20];
	printf("    ����ϵͳ\n");
	printf("���֤��:");
	scanf("%s",id);//�˴����Ż����棬������鿴�ÿ���ݺ���
	struct guest *head,*p;
	p=head=Load_GuestInfo();
	int flag=0;
	int ChangeRoomNum;
	while(p!=NULL)
	{
		if(!strcmp(p->id,id))
		{
			flag=1;
			printf("����    �Ա�         ���֤��       ��ǰ�����  ����ʱ��\n");
			printf("%s    %s   %s     %d  %s   ",p->name,p->sex,p->id,p->RoomId,p->CheckInTime);
			printf("������:");
			scanf("%d",&ChangeRoomNum);
			p->RoomId=ChangeRoomNum;
			RewriteGuestData(head);
			printf("�����ɹ���");
			getch();
			system("cls");
			MainMenu();
			break;
		}
		p=p->next;
	}
	if(!flag)
	{
		printf("�Ҳ������ˣ�");
		getch();
		system("cls");
		ChangeRoom();
	}
}

void CheckOut()//�˷�����
{
	char id[20];
	printf("    �˷�ϵͳ\n");
	printf("���֤��:");
	scanf("%s",id);//�˴����Ż����棬������鿴�ÿ���ݺ���
	struct guest *head,*p;
	p=head=Load_GuestInfo();
	int flag=0;
	char choice;
	while(p!=NULL)
	{
		if(!strcmp(p->id,id))
		{
			flag=1;
			printf("����    �Ա�         ���֤��       ����ʱ��      �˷�ʱ��\n");
			printf("%s    %s   %s   %s   %s   \n",p->name,p->sex,p->id,p->CheckInTime,LocalTime());
			printf( "ȷ���˷���Y/N\n");
			fflush(stdin);
			scanf("%c",&choice);
			if(choice=='Y') {AddHistory(struct guest *p);DeleteGuestData(p,head);AddHistory(p);}
			else if(choice=='N') {
                    printf("��ȡ����");break;}
			else {
                printf("�������");
                CheckOut();
			}
			system("cls");
			MainMenu();
		}
		p=p->next;
	}
	if(!flag)
	{
		printf("�Ҳ������ˣ�");
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

char *LocalTime()//��ȡʱ�亯��
{
    FILE *fp;
    fp=fopen("temp","w");
    time_t timep;
    struct tm *p;
    time(&timep);
    p = localtime(&timep); //ȡ�õ���ʱ��
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
