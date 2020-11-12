#include <stdio.h>
#include <fcntl.h>
#include <stdlib.h>
int main(int args,char* argv[]) {
    int fd,n;
    char buf[512];
    if(args<2){
        printf("USE: myCat <filename>");
        exit(0);
    }
    if((fd=open(argv[1],O_RDONLY))==-1){
        perror("cannot open");
    }
    while((n = read(fd,buf,sizeof(buf)))>0) {
        fflush(stdout);
        printf("%.*s",n,buf);
    }
    return 0;
}
