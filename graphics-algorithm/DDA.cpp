#include <iostream>
#include <vector>
using namespace std;

/*
DDA算法，输入两个像素端点(x0,y0),(x1,y1)，输出构成直线点集
*/

vector<pair<int,int>> DDA(int x0,int y0,int x1,int y1)
{    
    int dx,dy,epsl,k;
    float x,y,xIncre,yIncre;
    vector<pair<int,int> > cords;
    
    dx=x1-x0;
    dy=y1-y0;
    
    x=(float)x0;
    y=(float)y0;
     
    if(abs(dx)>abs(dy))
        epsl=abs(dx);
    else
        epsl=abs(dy);
        xIncre=(float)dx/(float)epsl;
        yIncre=(float)dy/(float)epsl;
    for(k=0;k<=epsl;k++)
    {   
        pair<int,int> p((int)(x+0.5),(int)(y+0.5));
        cords.push_back(p);
        x += xIncre;
        y += yIncre;
    }
    return cords;
}