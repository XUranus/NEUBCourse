#include "GL/freeglut.h"
#include "GL/gl.h"

#include <vector>
#include <iostream>

#include "DDA.cpp"
#include "Bresenham.cpp"

using namespace std;

int WIDTH = 800;
int HEIGHT = 800;

vector<pair<int,int> > cords;

bool judge(int x0,int y0,int x1,int y1) {
    if(x0<-WIDTH/2 || x1<-WIDTH/2) return false;
    if(x0>WIDTH/2 || x1>WIDTH/2) return false;
    if(y0>HEIGHT/2 || y1>HEIGHT/2) return false;
    if(y0<-HEIGHT/2 || y1<-HEIGHT/2) return false;
    return true; 
}

void draw()
{
    glClearColor(0.0, 0.0, 0.0, 0.0);
    glClear(GL_COLOR_BUFFER_BIT);
    //glPointSize(3);
    //绘制

    //红色画点
    glColor3f(1.0, 0.0, 0.0); //选定颜色
    glBegin(GL_POINTS);
        for(pair<int,int> p:cords) {
            float x = p.first*2.0/WIDTH;
            float y = p.second*2.0/HEIGHT;
            //cout << "(" << p.first << "," << p.second << ") --> (" << x << "," << y << ")" << endl;
            glVertex2f(x,y);    
        }
    glEnd();

    glFlush();
}

void draw_pixels(vector<pair<int,int> >point) {
    cords = point;
    glutDisplayFunc(draw);
}

int main(int argc, char **argv)
{
    WIDTH = 800;HEIGHT = 800;
    int x0,y0,x1,y1;
    cout << "(x0,y0)=";
    cin >> x0 >> y0;
    cout << "(x1,y1)=";
    cin >> x1 >> y1;

    if(!judge(x0,y0,x1,y1)) {
        cout << "out off border." << endl;
        exit(1);
    }

    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE);
    glutInitWindowSize(WIDTH,HEIGHT);
    glutInitWindowPosition(100, 100);
    glutCreateWindow("OpenGL Paint");

    //draw_pixels(DDA(x0,y0,x1,y1));
    //draw_pixels(Bresenham(x0,y0,x1,y1));
    //draw_pixels(Bresenham2(x0,y0,x1,y1));
    draw_pixels(MidBresenCircle(50));

    glutMainLoop();
    return 0;
}
