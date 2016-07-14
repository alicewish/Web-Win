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
 
TextOnPath.jsx

DESCRIPTION

This Sample creates different pathItem objects and writes
text on them.
 
**********************************************************/

// Main Code [Execution of script begins here]

var thisDoc = app.documents.add( DocumentColorSpace.RGB );
textOnHalfCircle();
areaTextInRectangle();
pointText();
textOnLinePath();



/**********************************************************

Functions used by this script

**********************************************************/


/*********************************************************
 
textOnHalfCircle: Function to Create a Path Text on a half 
circle pathItem.

**********************************************************/

function textOnHalfCircle()
{
	// First we draw a circle and then remove the last point to convert it
	// into a half circle

	var theCircle = thisDoc.pathItems.ellipse( 750, 200, 250, 250 ); // top, left, width, height

	// To convert this ellipse to a half-ellipse we delete the last point
	// and make it an open path item.
	var lastPoint = theCircle.pathPoints.length-1;

	// Delete the last point to make it a semi circle
	theCircle.pathPoints[lastPoint].remove(); 

	// Keep the path open since it is a half circle
	theCircle.closed = false;
	
	// You can obtain the path points in the half circle if needed
	var halfCirclePath = theCircle.pathPoints;

	// Now let's write a text on this pathItem
	var circleText = thisDoc.textFrames.pathText(theCircle, 400, 750, TextOrientation.HORIZONTAL); 
	circleText.textPath = theCircle;
	/* Use pathText constructor. The default constructor creates a point text. 
	There are additional parameters that you can pass in. */

	circleText.contents = "This is an example of text on a half ellipse pathItem.";
	
	// Set some other attributes for the text like center align, size is 14 etc.
	circleText.kind = "pathText";
	circleText.name = "Path 1";
	circleText.closed = false;
	
	// Call function applyTextFormats to apply the formats to the text
	applyTextFormats(circleText);
}

/*********************************************************
 
areaTextInRectangle: Function to Create a Path Text on a 
rectangle pathItem.

**********************************************************/

function areaTextInRectangle()
{
	// create an Area Text
	var rectObj = thisDoc.pathItems.rectangle(600, 200, 100, 120);
	var areaText = thisDoc.textFrames.areaText(rectObj);
	areaText.contents = "This is an Area Text in a rectangle. See how it flows to the next line.";
	applyTextFormats(areaText);
}


/*********************************************************
 
textOnLinePath: Function to create a path text on a Line 
pathItem.

**********************************************************/

function textOnLinePath()
{
	// 
	var lineObj = thisDoc.pathItems.add();
	lineObj.setEntirePath( Array(Array(200, 400), Array(300, 300)  ) );
	var linePathText = thisDoc.textFrames.pathText(lineObj);
	linePathText.contents = "This is text on a line pathItem.";
	applyTextFormats(linePathText);
}


/*********************************************************
 
pointText: Function to Create a Point Text.

**********************************************************/

function pointText()
{
	// Point Text
	var pointText = thisDoc.textFrames.add();
	pointText.contents = "This is a point text.";
	pointText.top = 150;
	pointText.left = 200;
	applyTextFormats(pointText);
}


/*********************************************************
 
applyTextFormats: This function applies some formats to all
text objects. This is called by all the text creating 
functions.

**********************************************************/

function applyTextFormats(thisText)
{
	thisText.spacing = 10;
	thisText.paragraphs[0].justification = Justification.CENTER;
	thisText.textRange.characterAttributes.size = 14;
}