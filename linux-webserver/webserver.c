#include <stdio.h>
#include <sys/stat.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>


void server_thread(int);
void read_til_crnl(FILE*) ;
void process_rq(char *, int );
void header( FILE *, char * );
void cannot_do(int );
void do_404(char *, int );
int isadir(char *);
int not_exist(char *);
int is_php_rq(char *);
void do_ls(char *, int );
char * file_type(char *);
int ends_in_cgi(char *);
void do_exec( char *, int );
void do_cat(char *, int );
void do_php(char *,int );

int make_server_socket_q(int , int );//declare
int make_server_socket(int );
int connect_to_server(char *, int );


int main(int ac, char *av[])
{
    int sock, fd;
    FILE *fpin;
    char request[BUFSIZ];
    if (ac == 1){
        fprintf(stderr,"usage: ws portnum\n");
        exit(1);
    }
    printf("starting web server...\n");
    sock = make_server_socket(atoi(av[1]));
    if (sock == -1) {
        printf("start failed.\n");
        exit(2);
    }
    else {
        printf("started.\n");
    }
    
    /* main loop here */
    while(1){
        /* take a call and buffer it */
        fd = accept(sock, NULL, NULL);

        pthread_t th;
        int ret;
        ret = pthread_create(&th, NULL, (void *)server_thread, fd);
        if(ret!=0) {
            printf("a thread create fail!\n");
        }
        //else printf("a thread create success！\n");
    }

    return 0;
}

void server_thread(int fd) {
    int sock;
    FILE *fpin;
    char request[BUFSIZ];

    fpin = fdopen(fd, "r" );

    /* read request */
    fgets(request,BUFSIZ,fpin);
    printf("got request = %s", request);
    read_til_crnl(fpin);
    
    /* do what client asks */
    process_rq(request, fd);
    fclose(fpin);
}


/* ------------------------------------------------------ *
read_til_crnl(FILE *)
skip over all request info until a CRNL is seen
------------------------------------------------------ */


void read_til_crnl(FILE*fp) 
{
    char buf[BUFSIZ];
    while(fgets(buf,BUFSIZ,fp)!= NULL && strcmp(buf,"\r\n") != 0 );
}

/* ------------------------------------------------------ *
process_rq( char *rq, int fd )
do what the request asks for and write reply to fd
handles request in a new process
rq is HTTP command: GET /foo/bar.html HTTP/1.0
------------------------------------------------------ */

void process_rq(char *rq, int fd)
{
    char cmd[BUFSIZ], arg[BUFSIZ];
    
    /* create a new process and return if not the child */
    if(fork()!= 0)
        return;
    strcpy(arg, "./");/* precede args with ./ */
    if(sscanf(rq,"%s%s",cmd,arg+2)!= 2)
        return;

    if(strcmp(cmd,"GET")!=0) //only support GET now
        cannot_do(fd);
    else if(is_php_rq(arg)) //dynamic request
        do_php(arg,fd);
    else if(not_exist(arg)) //static file
        do_404(arg,fd);
    else if(isadir(arg))
        do_ls(arg,fd);
    else if(ends_in_cgi(arg))
        do_exec(arg,fd);
    else
        do_cat(arg,fd);
}

/* ------------------------------------------------------ *
the reply header thing: all functions need one
if content_type is NULL then don't send content type
------------------------------------------------------ */
 
void header( FILE *fp, char *content_type )
{
    fprintf(fp, "HTTP/1.0 200 OK\r\n");
    if(content_type)
        fprintf(fp, "Content-type: %s\r\n", content_type );
}

/* ------------------------------------------------------ *
simple functions first:
cannot_do(fd)
 unimplemented HTTP command
and do_404(item,fd)
 no such object
------------------------------------------------------ */

void cannot_do(int fd)
{
    FILE *fp = fdopen(fd,"w");
    fprintf(fp, "HTTP/1.0 501 Not Implemented\r\n");
    fprintf(fp, "Content-type: text/plain\r\n");
    fprintf(fp, "\r\n");
    
    fprintf(fp, "That command is not yet implemented\r\n");
    fclose(fp);
}

void do_404(char *item, int fd)
{
    printf("Not Found: %s\n",item);
    FILE *fp = fdopen(fd,"w");

    fprintf(fp, "HTTP/1.0 404 Not Found\r\n");
    fprintf(fp, "Content-type: text/plain\r\n");
    fprintf(fp, "\r\n");
    
    fprintf(fp, "The item you requested: %s\r\nis not found\r\n",item);
    fclose(fp);
}

/* ------------------------------------------------------ *
the directory listing section
isadir() uses stat, not_exist() uses stat
do_ls runs ls. It should not
------------------------------------------------------ */

int isadir(char *f)
{
    struct stat info;
    return ( stat(f, &info) != -1 && S_ISDIR(info.st_mode) );
}

int not_exist(char *f)
{
    struct stat info;
    return( stat(f,&info) == -1 );
}

void do_ls(char *dir, int fd)
{
    FILE *fp ;

    fp = fdopen(fd,"w");
    header(fp, "text/plain");
    fprintf(fp,"\r\n");
    fflush(fp);

    dup2(fd,1);
    dup2(fd,2);
    close(fd);
    execlp("ls","ls","-l",dir,NULL);
    perror(dir);
    exit(1);
}

/* ------------------------------------------------------ *
the cgi stuff. function to check extension and
one to run the program.
------------------------------------------------------ */

char * file_type(char *f)/* returns 'extension' of file */
{
    char *cp;
    if ( (cp = strrchr(f, '.' )) != NULL )
        return cp+1;
    return "";
}

int ends_in_cgi(char *f)
{
    return ( strcmp( file_type(f), "cgi" ) == 0 );
}

void do_exec( char *prog, int fd )
{
    FILE *fp ;
    fp = fdopen(fd,"w");
    header(fp, NULL);
    fflush(fp);
    dup2(fd, 1);
    dup2(fd, 2);
    close(fd);
    execl(prog,prog,NULL);
    perror(prog);
}

/* ------------------------------------------------------ *
do_cat(filename,fd)
sends back contents after a header
------------------------------------------------------ */

void do_cat(char *f, int fd)
{
    char *extension = file_type(f);
    char *content = "text/plain";
    FILE *fpsock, *fpfile;
    int c;

    if ( strcmp(extension,"html") == 0 )
        content = "text/html";
    else if ( strcmp(extension, "gif") == 0 )
        content = "image/gif";
    else if ( strcmp(extension, "jpg") == 0 )
        content = "image/jpeg";
    else if ( strcmp(extension, "jpeg") == 0 )
        content = "image/jpeg";
    
    fpsock = fdopen(fd, "w");
    fpfile = fopen( f , "r");
    if(fpsock != NULL && fpfile != NULL)
    {
        header( fpsock, content );
        fprintf(fpsock, "\r\n");
        while( (c = getc(fpfile) ) != EOF )
        putc(c, fpsock);
        fclose(fpfile);
        fclose(fpsock);
    }
    exit(0);
}

/**************************  dynamic server ******************************/

int is_php_rq(char *arg) {
    char *extension = file_type(arg);
    return strcmp(extension,"php") == 0;
}

void do_php(char *arg, int fd) {
    if(not_exist(arg)) {
        do_404(arg,fd);
        return;
    }
    FILE *fpsock = fdopen(fd, "w");
    char content[20] = "text/html";
    if(fpsock != NULL) {
        header( fpsock, content );  
        fprintf(fpsock, "\r\n");
    } else {
        fclose(fpsock);
        return;
    }
    char cmd[50]= "php ";
    strcat(cmd,arg);// shell cmd
    
    char str[1024] = {0};
	FILE * stream = NULL;
	if ((stream = popen(cmd, "r")) == NULL){//通过popen执行PHP代码
        fclose(fpsock);
        printf("fetch php echo error\n");
		return;
	}
	while((fgets(str, 1024, stream)) != NULL){//通过fgets获取PHP中echo输出的字符串
        fputs(str,fpsock);
	}
	pclose(stream);
    fclose(fpsock);
}