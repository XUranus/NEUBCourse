#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <ctype.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <pwd.h>
#include <grp.h>
#include <dirent.h>
#include <time.h>
#include <string.h>

#define MAX_LENGTH 1000

char buff[80];
char *cwd = NULL;//current working directory
char *para = NULL;//parameter
char *path = NULL;//this is absolute path

void show_help() 
{
    printf("this is usage");
}

void show_path() 
{
    printf("path: %s\n",path);
}

char* uid_to_name(uid_t uid)
{
    struct passwd* getpwuid(),* pw_ptr;
    static char numstr[10];

    if((pw_ptr = getpwuid(uid)) == NULL)
    {
        sprintf(numstr,"%d",uid);

        return numstr;
    }
    else
    {
        return pw_ptr->pw_name;
    }
}

char* gid_to_name(gid_t gid)
{
    struct group* getgrgid(),* grp_ptr;
    static char numstr[10];

    if(( grp_ptr = getgrgid(gid)) == NULL)
    {
        sprintf(numstr,"%d",gid);
        return numstr;
    }
    else
    {
        return grp_ptr->gr_name;
    }
}

void mode_to_letters(int mode, char str[])
{
    strcpy(str, "----------");

    if (S_ISDIR(mode))
    {
        str[0] = 'd';
    }

    if (S_ISCHR(mode))
    {
        str[0] = 'c';
    }

    if (S_ISBLK(mode))
    {
        str[0] = 'b';
    }

    if ((mode & S_IRUSR))
    {
        str[1] = 'r';
    }

    if ((mode & S_IWUSR))
    {
        str[2] = 'w';
    }

    if ((mode & S_IXUSR))
    {
        str[3] = 'x';
    }

    if ((mode & S_IRGRP))
    {
        str[4] = 'r';
    }

    if ((mode & S_IWGRP))
    {
        str[5] = 'w';
    }

    if ((mode & S_IXGRP))
    {
        str[6] = 'x';
    }

    if ((mode & S_IROTH))
    {
        str[7] = 'r';
    }

    if ((mode & S_IWOTH))
    {
        str[8] = 'w';
    }

    if ((mode & S_IXOTH))
    {
        str[9] = 'x';
    }
}

void show_list_l() //ls -l
{
    show_path();

    DIR* dir;
    struct  dirent* ptr;
    dir = opendir(path);
    if(dir==NULL){
        perror("cannot open");
        exit(0);
    }

    while((ptr = readdir(dir)) != NULL) {
        if(strcmp(ptr->d_name,".")==0 || strcmp(ptr->d_name,"..")==0)//dismiss "." and ".."
            continue;
        else if(*(ptr->d_name) =='.')
            continue;
        /***** filter  ****/    
        /*if(ptr->d_type==8) {//file
            printf("%s\t", ptr->d_name);
        }else {//folder
            printf("\033[35m%s\033[0m\t", ptr->d_name);
        }*/
        char* file_path = (char*)malloc(MAX_LENGTH);
        struct stat file;
        strcpy(file_path,path);
        strcat(file_path,"/");
        strcat(file_path,ptr->d_name);
        if(stat(file_path,&file)<0) {
            perror("read file failed");
            exit(0);
        }

        char mode[15];
        mode_to_letters(file.st_mode,mode);

        /*
        printf("文件名: %s\t\t",ptr->d_name);
        printf("保护模式：%s",mode);
        printf("文件类型:%uc",ptr->d_type);
        printf("连接数: %d\t",file.st_nlink);
        printf("所有者: %s\t",uid_to_name(file.st_uid));
        printf("组: %s\t",gid_to_name(file.st_gid));
        printf("大小: %d\t",file.st_size);
        printf("修改时间: %s\t",ctime(&file.st_mtime));
        printf("\n");
        */

        printf("%s %d %s\t%s\t%d\t%.16s ",mode,file.st_nlink,uid_to_name(file.st_uid),gid_to_name(file.st_gid),file.st_size,ctime(&file.st_mtime));
        if(ptr->d_type==4) 
            printf("\033[35m%s\033[0m\n",ptr->d_name);
        else 
            printf("%s\n", ptr->d_name);
    }
    closedir(dir);
}

void show_list_all() //ls -a
{
    DIR* dir;
    struct  dirent* ptr;
    dir = opendir(path);
    if(dir==NULL){
        perror("cannot open");
        exit(0);
    }

    while((ptr = readdir(dir)) != NULL) {
        if(ptr->d_type==8) {//file
            printf("%s\t", ptr->d_name);
        }else {//folder
            printf("\033[35m%s\033[0m\t", ptr->d_name);
        }
    }
    closedir(dir);
}

void show_list() //ls
{
    DIR* dir;
    struct  dirent* ptr;
    dir = opendir(path);
    if(dir==NULL){
        perror("cannot open");
        exit(0);
    }

    while((ptr = readdir(dir)) != NULL) {
        if(strcmp(ptr->d_name,".")==0 || strcmp(ptr->d_name,"..")==0)//dismiss "." and ".."
            continue;
        else if(*(ptr->d_name) =='.')
            continue;

        if(ptr->d_type==8) {//file
            printf("%s\t", ptr->d_name);
        }else {//folder
            printf("\033[35m%s\033[0m\t", ptr->d_name);
        }
    }
    closedir(dir);    
}

void show_list_recur() //ls -R
{
    list_file_recur(path);
}

void list_file_recur(char *pth) {
    printf("\033[35m%s\033[0m:\n",pth);

    DIR* dir;
    struct  dirent* ptr;
    dir = opendir(pth);
    if(dir==NULL){
        perror("cannot open");
        exit(0);
    }
    //handle file
    int i=0;
    char folder[100][100];
    memset(folder,0,sizeof(folder));
    while((ptr = readdir(dir)) != NULL) {
        if(ptr->d_type==8) {//is file
            if(*(ptr->d_name)=='.') continue;//filter hide
            printf("%s\n",ptr->d_name);
        }
        else {
            if(*(ptr->d_name)=='.') continue;//filter hide & ..
            if(strcmp(ptr->d_name,".")==0||strcmp(ptr->d_name,"..")==0) continue;
            strcpy(folder[i++],ptr->d_name);
        }
    }

    printf("\n");
    //handle folder
    int j=0;
    for(j=0;j<i;j++) {
        char new_path[100];
        strcpy(new_path,path);
        strcat(new_path,"/");
        strcat(new_path,folder[j]);
        list_file_recur(new_path);
        //printf("foloder:%s \n",new_path);
    }
}

int main(int argc,char* argv[]) 
{
    getcwd(buff,sizeof(buff));
    cwd = buff;//current_working_directory

    if(argc>=2) {
        int i=0;
        para = argv[1];
        for(i=0;i<strlen(para);i++) {
            para[i]=tolower(para[i]);//pre_handle_to_lower_case
        }
    }

    if(argc==1) {//ls
        path = cwd;
        show_list();
    } else if(argc==2) { //ls <path> or ls <parameter>
        para = argv[1];
        path = cwd;
        if(strcmp(para,"-a")==0) {
            show_list_all();
        } else if(strcmp(para,"-l")==0) {
            show_list_l();
        } else if(strcmp(para,"-r")==0) {
            show_list_recur();
        } else if(strcmp(para,"-h")==0) {
            show_help();
        } else {
            if(argv[1][0]=='/') 
                path = argv[1];
            else {
                strcat(cwd,"/");
                strcat(cwd,argv[1]);
                path = cwd;
            }
            show_list();// ls <path>
        }
    } else if(argc==3) { //ls <parameter> <path>
        para = argv[1];
        path = argv[2];
        if(argv[2][0]=='/') 
            path = argv[2];
        else {
            strcat(cwd,"/");
            strcat(cwd,argv[2]);
            path = cwd;
        }

        if(strcmp(para,"-a")==0) {
            show_list_all();
        } else if(strcmp(para,"-l")==0) {
            show_list_l();
        } else if(strcmp(para,"-r")==0) {
            show_list_recur();
        } else if(strcmp(para,"-h")==0) {
            show_help();
        } else {
            printf("un support parameter: %s",para);
            exit(0);
        }
    } else {
        printf("to much argument");
        exit(0);
    }
    
    return 0;
}

