/*
* Copyright (c) 2005 The Regents of the University of California. All rights reserved.
* Permission to use, copy, modify, and distribute this software for any purpose and
* without fee is hereby granted, provided that the above copyright notice and the
* following two paragraphs appear in all copies of this software. Created by Xiaorui
* Chen, Department of Mechanical Engineering, University of California, Berkeley.
*
* IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR DIRECT,
* INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OF
* THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF THE UNIVERSITY OF CALIFORNIA HAS BEEN
* ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
* THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING,
* BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
* PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS IS" BASIS, AND
* THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT,
* UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
*/
#define GLUT_BUILDING_LIB
#include <GL/glut.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include "PolygonOffset.h"
#include "point.h"
#include "polygon.h"
using namespace std;

#ifndef CALLBACK
#define CALLBACK
#endif

POLYGON OriginPoly;     //the original polygon
POLYGON PreprocessedPoly;   //original polygon after proprocessing
POLYGON RawOffsetCurve;   //raw offset curve
POLYGON OffsetPoly;     //the offset polygon

polygon POLY;

GLdouble offset=0.0;    //offset distance

extern GLint PolyList;
extern GLint numContour;
extern GLint b_Closed;
extern POINT2D rubber_band;
extern GLint process_poly;
extern vector<point> Points;
extern vector<polygon> Faces1;
extern int* order_triangle(int plist[3],int up);


//GLU_TESS_BEGIN callback function
void CALLBACK beginCallback(GLenum which)
{
  CONTOUR NewContour;
  if (process_poly == ORIGINAL_POLYGON) {
    PreprocessedPoly.push_back(NewContour); //start a new contour
  }
  else {
    OffsetPoly.push_back(NewContour);   //start a new contour
    numContour ++;
  }
  POLY.v.clear();

  glBegin(which);
}

//GLU_TESS_ERROR callback function
void CALLBACK errorCallback(GLenum errorCode)
{
  const GLubyte *estring;
  GLint ch=1;

  estring = gluErrorString(errorCode);
  printf("Tessellation Error: %s\n", estring);
  printf("Press ENTER to terminate the program!\n");
  while (ch!='\n')
    ch = getchar();
  exit(0);
}

//GLU_TESS_END callback function
void CALLBACK endCallback(void)
{
  int* plist = new int[3];
/*  plist[0] = POLY.v[0];
  plist[1] = POLY.v[1];
  plist[2] = POLY.v[2];
  int temp = plist[2];
  plist=order_triangle(plist,1);

  if(plist[2]!=temp)
  {
    cout<<"************wrong order of polygon by GLU"<<endl;
    exit(1);
  }
*/

  Faces1.push_back(POLY);
  POLY.v.clear();
  glEnd();
}

//GLU_TESS_VERTEX callback function
void CALLBACK vertexCallback(GLvoid *vertex)
{
  const GLdouble *pointer;

  pointer = (GLdouble *) vertex;
  glColor3dv(pointer+3);
  glVertex3dv(pointer);
  //cout<<pointer[0]<<" "<<pointer[1]<<endl;
  int cnt=0;
  for(;cnt<Points.size();cnt++)
  {
  //  cout<<"returned vertices "<<pointer[0]<<" "<<pointer[1]<<endl;
    float x1 = Points[cnt].x[0]-pointer[0];
    float y1 = Points[cnt].x[1]-pointer[1];


    if(x1<.001 && x1>-.001 && y1<.001 && y1>-.001)
    {
      int FP=0;
      for(int c1=0;c1<POLY.v.size();c1++)
      {

        if(POLY.v[c1]==cnt)
        {
          FP=1;
          break;
        }
      }

      if(FP==0)
      {
      /*  if(POLY.v.size()>1)
      {
        if(Points[cnt].crossing!=Points[POLY.v[POLY.v.size()-1]].crossing)
          continue;


      }*/

        POLY.v.push_back(cnt);
        Points[cnt].polys.push_back(Faces1.size());
      }



  //    cout<<"Found point "<<endl;
      break;
    }
  }
  if(cnt==Points.size())
    cout<<"Did not find"<<endl;
   //add a vertex at the end of current contour
  POLYGON* poly;
  POINT2D NewVert;
  if (process_poly == ORIGINAL_POLYGON)
    poly = &PreprocessedPoly;
  else
    poly = &OffsetPoly;
  POLYGON::iterator iContour = poly->end();
  iContour--;
  NewVert.x=pointer[0];
  NewVert.y=pointer[1];
  iContour->push_back(NewVert);
}

//GLU_TESS_COMBINE callback function, used to create a new vertex when edges intersect
void CALLBACK combineCallback(GLdouble coords[3],
                     GLdouble *vertex_data[4],
                     GLfloat weight[4], GLdouble **dataOut )
{
  GLdouble *vertex;

  vertex = (GLdouble *) malloc(6 * sizeof(GLdouble));

  vertex[0] = coords[0];
  vertex[1] = coords[1];
  vertex[2] = coords[2];
  vertex[3] = 0.0;
  vertex[4] = 0.5;
  vertex[5] = 0.0;

  *dataOut = vertex;
}

//remove self-intersections in the original polygon or raw offset curve
void remove_self_intersections(GLint winding_rule) {
  POINT3D *p_head = NULL, *p = NULL;
  POLYGON *poly = NULL;
  POLYGON::iterator iContour;
  CONTOUR::iterator jVertex;

  GLUtesselator *tobj;  //a tessellator
  tobj = gluNewTess();

  //set callback functions
  #ifdef WIN32  //for Windiows
    gluTessCallback(tobj, GLU_TESS_VERTEX,  (GLvoid (__stdcall *) ()) &vertexCallback);
    gluTessCallback(tobj, GLU_TESS_BEGIN, (GLvoid (__stdcall *) ()) &beginCallback);
    gluTessCallback(tobj, GLU_TESS_END, (GLvoid (__stdcall *) ()) &endCallback);
    gluTessCallback(tobj, GLU_TESS_ERROR, (GLvoid (__stdcall *) ()) &errorCallback);
    gluTessCallback(tobj, GLU_TESS_COMBINE, (GLvoid (__stdcall *) ()) &combineCallback);
  #else     //for Unix
    gluTessCallback(tobj, GLU_TESS_VERTEX,  (GLvoid (*) ()) &vertexCallback);
    gluTessCallback(tobj, GLU_TESS_BEGIN, (GLvoid (*) ()) &beginCallback);
    gluTessCallback(tobj, GLU_TESS_END, (GLvoid (*) ()) &endCallback);
    gluTessCallback(tobj, GLU_TESS_ERROR, (GLvoid (*) ()) &errorCallback);
    gluTessCallback(tobj, GLU_TESS_COMBINE, (GLvoid (*) ()) &combineCallback);
  #endif

  if (process_poly == ORIGINAL_POLYGON) { //self-intersecting original polygon
    poly = &OriginPoly;
  }
  else {                  //self-intersecting raw offset curve
    poly = &RawOffsetCurve;
    numContour = 0;
  }

  //set tessellator properties
  gluTessProperty(tobj, GLU_TESS_WINDING_RULE, winding_rule);
  gluTessProperty(tobj, GLU_TESS_BOUNDARY_ONLY, GL_TRUE);
  gluTessNormal(tobj, 0, 0, 1);

  //input to the tessellator
  gluTessBeginPolygon(tobj, NULL);
  for (iContour=poly->begin(); iContour!=poly->end(); iContour++) {
    gluTessBeginContour(tobj);
    for (jVertex=iContour->begin(); jVertex!=iContour->end(); jVertex++) {
      p = new POINT3D;
      p->coord[0] = jVertex->x;
      p->coord[1] = jVertex->y;
      p->coord[2] = 0.0;
      p->next = p_head;
      p_head = p;
      gluTessVertex(tobj, p->coord, p->coord);
    }
    gluTessEndContour(tobj);
  }
  gluTessEndPolygon(tobj);

  gluDeleteTess(tobj);
  while (p_head != NULL) {
    p = p_head;
    p_head = p->next;
    delete p;
  }
}

//get normalized normal: v(edge)->n(normal)
void CalNormal(POINT2D *v, POINT2D *n)
{
  GLdouble length;
  length = sqrt(v->x*v->x+v->y*v->y);
  n->x = v->y/length;
  n->y = -v->x/length;
}

//n(normal), v(original vertex), offset -> p(offset point)
void OffsetPoints(POINT2D n, POINT2D v, GLdouble offset, POINT2D *p) //Get offset point
{
  p->x = v.x-n.x*offset;
  p->y = v.y-n.y*offset;
}

//the z coordinate of the cross product of v1 and v2
GLdouble CrossProduct(POINT2D v1, POINT2D v2)
{
  GLdouble z;
  z = v1.x*v2.y-v1.y*v2.x;
  return z;
}

//get the angle relative to x axis, [0,2*PI)
GLdouble CalAngle(POINT2D n)
{
  GLdouble angle;
  if (n.x >= 0 && n.y >= 0) {//0 ~ 90
    angle = asin(n.y);
  }
  else if (n.x >= 0 && n.y < 0) {//270 ~ 360
    angle = asin(n.y)+2*PI;
  }
  else if (n.x < 0 && n.y >= 0)  { //90 ~ 180
    angle = acos(n.x);
  }
  else if (n.x < 0 && n.y < 0) { //180 ~ 270
    angle = 2*PI-acos(n.x);
  }
  return angle;
}

//construct raw offset curve from the preprocessed original polygon
void ConstructRawOffsetCurve(GLdouble off) {
  GLdouble IncreAngle = 10.0;
  GLdouble angle[3];
  POINT2D v12, v23, n12, n23, p[2];
  POLYGON RawCurve;
  POLYGON::iterator iContour;
  CONTOUR::iterator iVertex, jVertex, kVertex;
  for (iContour=RawOffsetCurve.begin(); iContour!=RawOffsetCurve.end(); iContour++)
    iContour->clear();
  RawOffsetCurve.clear();

  //get the preprocessed original polygon as raw curve
  RawCurve.assign(PreprocessedPoly.begin(), PreprocessedPoly.end());

  //construct the raw offset curves
  for (iContour=RawCurve.begin(); iContour!=RawCurve.end(); iContour++) {
    if (iContour->size() < 3) //not a polygon
      continue;

    //add the 1st and 2nd vertex to the end of the vertex list
    kVertex = iContour->begin();
    kVertex ++;
    kVertex ++;
    iContour->insert(iContour->end(), iContour->begin(), kVertex);

    //add one contour to the raw offset curve
    CONTOUR NewContour;
    iVertex = iContour->begin();
    jVertex = iVertex;
    jVertex ++;
    for (; kVertex!=iContour->end(); iVertex++, jVertex++, kVertex++) {
      v12.x = jVertex->x - iVertex->x;
      v12.y = jVertex->y - iVertex->y;

      v23.x = kVertex->x - jVertex->x;
      v23.y = kVertex->y - jVertex->y;

      CalNormal(&v12, &n12); //normalized normal
      CalNormal(&v23, &n23); //normalized normal
      OffsetPoints(n12, *jVertex, off, &p[0]); //Get offset point
      OffsetPoints(n23, *jVertex, off, &p[1]);

      if ((CrossProduct(v12, v23))*offset <= 0) { //for convex vertex with outer offset or concave vertex with inner offset
        if (offset > 0) { //concave vertex with inner offset, normal is reversed
          n12.x *= -1.0;
          n12.y *= -1.0;
          n23.x *= -1.0;
          n23.y *= -1.0;
        }
        angle[1]=CalAngle(n12); //get the angle relative to x axis, [0,360)
        angle[2]=CalAngle(n23);
        if (offset <= 0 && angle[1]>angle[2]) //convex vertex
          angle[2]=2*PI+angle[2]; //make sure angle[2]>angle[1] for outer offset
        else if (offset > 0 && angle[1]<angle[2])
          angle[1]=2*PI+angle[1]; //make sure angle[1]>angle[2] for inner offset
        angle[0]=angle[1];
        while ((offset<=0 && angle[0]<=angle[2]) || (offset>0 && angle[0]>=angle[2])) { //add each point by increment angle of IncreAngle degree
          POINT2D NewVert;
          NewVert.x=jVertex->x+fabs(off)*cos(angle[0]);
          NewVert.y=jVertex->y+fabs(off)*sin(angle[0]);
          NewContour.push_back(NewVert);

          if (offset <= 0) //for outer offset
            angle[0]=angle[0]+IncreAngle*PI/180.0;
          else if (offset > 0) //for inner offset
            angle[0]=angle[0]-IncreAngle*PI/180.0;
          if (fabs(angle[0]-angle[2])<=IncreAngle*PI/360.0)
            angle[0]=angle[2];
        }
      }
      else { //for concave vertex with outer offset or convex vertex with inner offset, add two points p[0] and p[1], and the original vertex in between
        POINT2D NewVert[3];
        NewVert[0] = p[0];
        NewContour.push_back(NewVert[0]);
        NewVert[1] = *jVertex;
        NewContour.push_back(NewVert[1]);
        NewVert[2] = p[1];
        NewContour.push_back(NewVert[2]);
      }
    }
    RawOffsetCurve.push_back(NewContour);
  }

  //clear the temporary raw curve
  for (iContour=RawCurve.begin(); iContour!=RawCurve.end(); iContour++)
    iContour->clear();
  RawCurve.clear();
}