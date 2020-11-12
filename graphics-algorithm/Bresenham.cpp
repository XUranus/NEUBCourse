#include <iostream>
#include <vector>
using namespace std;

/*
bresenham算法，输入两个像素端点(x0,y0),(x1,y1)，输出构成直线点集
*/

vector<pair<int,int> > Bresenham(int x0,int y0,int x1,int y1)
{    
    int dx,dy,d,UpInce,DownInce,x,y,xend;
    vector<pair<int,int> > cords;

    if(x0 > x1)
    {
        x = x0;x0= x1;x1=x;
        y = y0;y0= y1;y1=y;
    }
    x = x0;y = y0;
    dx = x1-x0; dy = y1-y0;
    d = dx - 2*dy;
    UpInce = 2*dx - 2*dy;
    DownInce = -2*dy;
    while(x<=x1)
    {
        pair<int,int> p(x,y);
        cords.push_back(p);
        x++;
        if(d<0)
        {
            y++;
            d+=UpInce;
        }
        else
            d+=DownInce;
    }

    return cords;
}



/*
改进后的bresenham算法，输入两个像素端点(x0,y0),(x1,y1)，输出构成直线点集
*/

vector<pair<int,int> > Bresenham2(int x0,int y0,int x1,int y1) {
    int x, y, dx, dy;
    float k, e;
    vector<pair<int,int> >cords;
    
    dx = x1-x0;
    dy = y1- y0;
    
    k = dy / dx;
    e = -0.5;
    x = x0; y = y0;

    for (int i=0;i<=dx;i++)
    { 
        pair<int,int> p(x,y);
        cords.push_back(p);
        
        x = x + 1; e = e + k;
        
        if (e > 0)
        {
            y ++;
            e = e-1;
        }
    }
    return cords;
}


/* Bresen画圆算法  8分之一圆*/
vector<pair<int,int> > MidBresenCircle(int r)
{ 
    int x,y,d;
    x = 0; y = r; d = 1 - r;
    vector<pair<int,int> > cords;

    while(x<y)
    { 
        pair<int,int> p(x,y);
        cords.push_back(p);
        if(d < 0)
            d += 2*x + 3;
        else { 
            d += 2*(x-y)+5;
            y --;
        }
        x++;
    }
    
    return cords;
}
