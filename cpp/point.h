#include <iostream>
#include <GL/glut.h>
#include <vector>
#include "stdio.h"
#ifndef H_POINT
#define H_POINT

//#include<GL/gl.h>


using namespace std;
class point{
public:
  point(){
    for(int cnt=0;cnt<4;cnt++)
      x[cnt]=0.;
    crossing=0;  // pointer to crossing
    mark=0;
    open_boundary = 0; //added by Xiaorui
  };
   GLfloat x[4]; // xyz coordinates
   int mark;
   int crossing; // // pointer to crossing
   int open_boundary; //Added by Xiaorui, 0: not an open boundary, 1: an open boundary
   vector<int> polys;  // polygons the point is shared in
   void write(FILE *OUTPUT)
   {
     fprintf(OUTPUT,"\n\n%lf %lf %lf \n ",x[0],x[1],x[2]);
     fprintf(OUTPUT,"cross %d\n",crossing);
     for(int cnt=0;cnt<polys.size();cnt++)
       fprintf(OUTPUT,"%d ",polys[cnt]);
   };
};



#endif
