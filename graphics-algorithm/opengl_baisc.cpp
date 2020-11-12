#include "GL/freeglut.h"
#include "GL/gl.h"

void drawTriangle()
{
    glClearColor(0.4, 0.4, 0.4, 0.4);
    glClear(GL_COLOR_BUFFER_BIT);

    glColor3f(1.0, 1.0, 1.0);
    glOrtho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);

        glBegin(GL_TRIANGLES);
                glVertex3f(-0.7, 0.7, 0);
                glVertex3f(0.7, 0.7,2 );
                glVertex3f(0, -1,6);
        glEnd();

    glFlush();
}

void draw()
{
    glClearColor(0.0, 0.0, 0.0, 0.0);
    glClear(GL_COLOR_BUFFER_BIT);
    glPointSize(3);
    //绘制


    //红色画点
    glColor3f(1.0, 0.0, 0.0); //选定颜色
    glBegin(GL_POINTS);
        glVertex2f(0.0, 0.0);
        glVertex2f(0.5,0.5);
        glVertex2f(-0.5,0.5);
        glVertex2f(0.9,0.9);
    glEnd();

    //绿色画线
    glColor3f(0.0, 1.0, 0.0); 
    glBegin(GL_LINES);
    glVertex2f(0.0, 0.0);
    glVertex2f(0.0, -0.1);
    glVertex2f(-0.1, 0.0);
    glVertex2f(-0.1, -0.1);
    glEnd();



    //蓝色画相邻点相连，首尾不连的线
    glColor3f(0.0, 0.0, 1.0); 
    glBegin(GL_LINE_STRIP);
    glVertex2f(-0.2, 0.0);
    glVertex2f(-0.2, -0.1);
    glVertex2f(-0.3, 0.0);
    glVertex2f(-0.3, -0.1);
    glEnd();

    
    //粉色画相邻点相连，首尾连的线
    glColor3f(1.0, 0.5, 0.5); 
    glBegin(GL_LINE_LOOP);
    glVertex2f(-0.4, 0.0);
    glVertex2f(-0.4, -0.1);
    glVertex2f(-0.5, 0.0);
    glVertex2f(-0.5, -0.1);
    glEnd();


    //橘黄色画填充面
    glColor3f(1.0, 0.5, 0.25); 
    glBegin(GL_POLYGON);
    glVertex2f(-0.1, 0.1);
    glVertex2f(-0.2, 0.1);
    glVertex2f(-0.3, 0.3);
    glVertex2f(-0.2, 0.5);
    glVertex2f(-0.1, 0.3);
    glEnd();

    //碧蓝色画填充面，每四个点画一个四边形，相邻不连接
    glColor3f(0.0, 1.0, 1.0); 
    glBegin(GL_QUADS);
    glVertex2f(-0.3, 0.1);
    glVertex2f(-0.4, 0.1);
    glVertex2f(-0.5, 0.3);
    glVertex2f(-0.4, 0.5);
    glVertex2f(-0.5, 0.1);
    glVertex2f(-0.6, 0.1);
    glVertex2f(-0.7, 0.3);
    glVertex2f(-0.6, 0.5);
    glEnd();


    //彩色画填充面，每两个点构成一条线，每两个线构成一个四边形
    glBegin(GL_QUAD_STRIP);
    //线1
    glColor3f(1.0, 0.0, 0.0);
    glVertex2f(-0.3, 0.6);
    glVertex2f(-0.2, 0.8);
    //线2
    glColor3f(0.0, 1.0, 0.0);
    glVertex2f(-0.4, 0.6);
    glVertex2f(-0.5, 0.9);
    //线3
    glColor3f(0.0, 0.0, 1.0);
    glVertex2f(-0.5, 0.5);
    glVertex2f(-0.7, 0.7);
    glEnd();


    //褐色填充三角形(将每三个点围成的三角形进行填充，相邻的点之间不填充)
    glColor3f(0.5, 0.25, 0.0); 
    glBegin(GL_TRIANGLES);
    glVertex2f(0.2, 0.1);
    glVertex2f(0.3, 0.2);
    glVertex2f(0.4, 0.1);
    glVertex2f(0.5, 0.1);
    glVertex2f(0.6, 0.3);
    glVertex2f(0.7, 0.1);
    glEnd();

    //白色填充三角形(将每三个点围成的三角形进行填充，相邻的点之间填充)
    glColor3f(1.0, 1.0, 1.0);
    glBegin(GL_TRIANGLE_STRIP);
    glVertex2f(0.2, 0.4);
    glVertex2f(0.3, 0.7);
    glVertex2f(0.4, 0.4);
    glVertex2f(0.5, 0.8);
    glVertex2f(0.6, 0.4);
    glEnd();

    //淡蓝色填充三角形(将每三个点围成的三角形进行填充，相邻的点之间填充)
    glColor3f(0.5, 0.5, 1.0);
    glBegin(GL_TRIANGLE_FAN);
    glVertex2f(0.2, -0.2);
    glVertex2f(0.2, -0.5);
    glVertex2f(0.3, -0.4);
    glVertex2f(0.4, -0.3);
    glVertex2f(0.3, -0.1);
    glEnd();

    glFlush();
}


void myDisplay()
{
    glPointSize(3);//设置点大小
    glClear(GL_COLOR_BUFFER_BIT);
	glOrtho(0.0, 1.0, 0.0, 1.0, -1.0, 1.0);

        glBegin(GL_POINTS); //只绘制端点
            glColor3f(1.0,0.0,0.0);
            glVertex3f(0.25,0.25,0);
            glColor3f(0.0,1.0,0.0);
            glVertex3f(0.75,0.25,0);
            glColor3f(0.0,0.0,1.0);
            glVertex3f(0.75,0.75,0);
            glColor3f(1.0,1.0,1.0);
            glVertex3f(0.25,0.75,0);
        glEnd();

	glFlush();
}

int main(int argc, char **argv)
{
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE);
    glutInitWindowSize(500, 500);
    glutInitWindowPosition(100, 100);
    glutCreateWindow("OpenGL Paint");
    glutDisplayFunc(draw);
    glutMainLoop();
    return 0;
}
