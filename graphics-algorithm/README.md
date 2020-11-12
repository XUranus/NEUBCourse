# Graphics Algorithms
> 蹭了隔壁两节课,没好好学...

 - DDA
 - Bresenham

## OPENGL MODE
GL_POINTS 画离散的点  
GL_LINES 画线(每两个点连成一条线)  
GL_LINE_STRIP 画线(所有点相互相连，首尾不相连)  
GL_LINE_LOOP 画线(所有点相互相连，首尾相连)  
GL_POLYGON 填充面(将所有点围成的面进行填充)  
GL_QUADS 填充面(将每四个点围成的面进行填充,相邻点之间不填充)  
GL_QUAD_STRIP 填充面(每两个点构成一条线，每两个线构成一个四边形)  
GL_TRIANGLES 填充三角形(将每三个点围成的三角形进行填充，相邻的点之间不填充)  
GL_TRIANGLE_STRIP 填充三角形(将每三个点围成的三角形进行填充，相邻的点之间填充)  
GL_TRIANGLE_FAN 填充三角形(以第一个点为顶点，之后每两个点合起来围成的三角形进行填充，相邻的点之间填充)   