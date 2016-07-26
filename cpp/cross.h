
#include <iostream>
#include "point.h"
#include <vector>

using namespace std;

class cross
{

public:
  cross(){ };
  vector<int> points; // Points defining the twisted strip
  vector<int> edges; // List of endpoints of edges ..each consecutive indices define an edge

  int Polys[2]; // Two polygons that are connected by the crossing
  int GetNextPolygon(int x)   // Return the next polygon connected by this crossing
  {
  /*  if(Polys[0]==x)
      return Polys[1];
    else if(Polys[1]==x)
      return Polys[0];
    else
    {
      cout<<"The crossing does not connect two polygons ";
      exit(1);
    }
    return 0;
  */
  };

};



