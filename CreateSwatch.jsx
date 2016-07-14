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
 
CreateSwatch.jsx

DESCRIPTION

Create a new swatch added to the general swatch group.
 
**********************************************************/

var docRef = app.documents.add();

// Create the new color for the swatch
var cmykColor = new CMYKColor();
cmykColor.cyan = 75;
cmykColor.magenta = 50;
cmykColor.yellow = 20;
cmykColor.black = 5;

// Create the new swatch using the above color
var swatch = docRef.swatches.add();
swatch.color = cmykColor;
swatch.name = "CreateSwatch";

// Apply the swatch to a new path item
var pathRef = docRef.pathItems.star (300, 300, 100, 30, 4, false);
pathRef.filled = true;
pathRef.fillColor = swatch.color;
pathRef.stroked = true;
pathRef.strokeColor = swatch.color;
