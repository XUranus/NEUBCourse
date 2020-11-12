#include <stdio.h>
#include <fcntl.h>
#include <stdlib.h>
int main(int args,char* argv[]) {
    int fdin,fdout,n;
    char buf[512];
    if(args<3){
        printf("USE: myCp <src file> <dst file>");
        exit(0);
    }
    if((fdin=open(argv[1],O_RDONLY))==-1){
        perror("cannot open");
        exit(0);       
    }
    if((fdout=open(argv[2],O_WRONLY|O_CREAT,0640))==-1){
        perror("cannot open");
        exit(0);
    }
    while((n = read(fdin,buf,sizeof(buf)))>0) {
        write(fdout,buf,n);
    }
    close(fdin);
    close(fdout);
    return 0;
} 
