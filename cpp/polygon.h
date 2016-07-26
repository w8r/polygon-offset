#include <iostream>
#include "point.h"
#include <Vector>
using namespace std;
#ifndef H_POLYGON
#define H_POLYGON
class polygon
{
public:
  polygon(){sense = -1;}; //updated by Xiaorui
  int sense;  //updated by Xiaorui
  int size;
  vector<int> v;  // pointer to vertices
  int GetNextPoint(int i)  // Function that returns the id of the next vertex..wraps around if the index exceeds number of points
  {
    int cnt=0;
    for(;cnt<v.size();cnt++)
    {
      if(v[cnt]==i)
        break;
    }

    if(cnt+1==v.size())
      cnt=-1;
    return v[cnt+1];
  };
  int GetPrevPoint(int i)  // Function that returns the id of the previous vertex..wraps around if the index exceeds number of points
  {
    int cnt=0;
    for(;cnt<v.size();cnt++)
    {
      if(v[cnt]==i)
        break;
    }
    if(cnt==0)
      cnt=v.size();
    return v[cnt-1];
  };
   void write(FILE *OUTPUT)
   {

     for(int cnt=0;cnt<v.size();cnt++)
       fprintf(OUTPUT,"%d ",v[cnt]);
     fprintf(OUTPUT,"\n");
   };
};
//std::vector<polygon> Faces1;
#endif H_POLYGON

//vector<polygon> Polys;