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

#ifndef OFFSET
#define OFFSET

#include <list>

#define PI 3.1415926535897932
#define ORIGINAL_POLYGON 0
#define RAW_OFFSET_CURVE 1

//vertex structure in 2D
typedef struct point2D
{
  GLdouble x;
  GLdouble y;
  int intsect;
} POINT2D;

//vertex structure in 3D
typedef struct point3D
{
  GLdouble coord[3];
  struct point3D *next;
} POINT3D;

using namespace std;
typedef std::list<POINT2D> CONTOUR; //define one contour on the original/offset polygon
typedef std::list<CONTOUR> POLYGON; //define original polygon with multiple contours

#endif