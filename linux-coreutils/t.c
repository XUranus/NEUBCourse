#include <stdio.h>
#include<io.h>
int main(void)
{
    //文件存储信息结构体 
    struct _finddata_t fileinfo;
    //保存文件句柄 
    long fHandle;
    //文件数记录器
    int i = 0;

    if( (fHandle=_findfirst( "./test/*.txt", &fileinfo )) == -1L ) 
    {
        printf( "当前目录下没有txt文件\n");
        return 0;
    }
    else{
        do{
            i ++;
            printf( "找到文件:%s,文件大小：%d\n", fileinfo.name,fileinfo.size);
        }while( _findnext(fHandle,&fileinfo)==0);
    }
    //关闭文件 
    _findclose( fHandle );

    printf("文件数量：%d\n",i);

    return 0;
}
