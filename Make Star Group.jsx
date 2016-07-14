/**********************************************************

ADOBE SYSTEMS INCORPORATED 
Copyright 2005-2010 Adobe Systems Incorporated 
All Rights Reserved 

NOTICE:  Adobe permits you to use, modify, and 
distribute this file in accordance with the terms
of the Adobe license agreement accompanying it.  
If you have received this file from a source 
other than Adobe, then your use, modification,
or distribution of it requires the prior 
written permission of Adobe. 

*********************************************************/

/**********************************************************
 
Make Star Groups.jsx

DESCRIPTION

This sample script creates a group of star objects
 
**********************************************************/

documents.add();

var doc_ref = documents[0];

var group_ref = doc_ref.groupItems.add();
makeUnstrokedRect( group_ref, 350, 200, 100, 100, 100, 0, 0, 0 )
makeUnstrokedRect( group_ref, 250, 300, 100, 100, 0, 100, 0, 0 )
makeUnstrokedRect( group_ref, 350, 300, 100, 100, 0, 0, 100, 0 )
makeUnstrokedRect( group_ref, 250, 200, 100, 100, 50, 50, 0, 0 )

var star_ref = group_ref.pathItems.star( 300, 250, 25, 4, 4, false );

var blkColor = new CMYKColor();
blkColor.black = 100;

star_ref.fillColor = blkColor;
star_ref.stroked = false;
star_ref.opacity = 40;

var matrix_ref = getRotationMatrix( 45.0 );

star_ref.transform( matrix_ref, true, false, false, false, 1.0, Transformation.CENTER );

star_ref = group_ref.pathItems.star( 300, 250, 100, 25, 4, false );
star_ref.filled = false;
star_ref.stroked = false;

group_ref.clipped = true;

function makeUnstrokedRect(gr,t,l,h,w,c,m,y,k)
{
	var colorRef = new CMYKColor();
	colorRef .cyan = c;
	colorRef .magenta = m;
	colorRef .yellow = y;
	colorRef .black = k;
	
	var path_ref = gr.pathItems.rectangle(t, l, h, w);
	path_ref.fillColor = colorRef ;
	path_ref.stroked = false;
}

