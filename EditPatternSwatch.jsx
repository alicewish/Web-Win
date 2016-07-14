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
 
EditPatternSwatch.jsx

DESCRIPTION

Search for and edit the first pattern swatch in the general swatch group.
 
**********************************************************/

var docRef = app.documents.add();

var swatchIndex = 0;

// Iterate through the document swatches looking for patterns
// if a pattern swatch is found edit it
for (var i = 0; i < docRef.swatches.length; i++) {
	var currentSwatch = docRef.swatches[i];
	if (currentSwatch.color.typename == "PatternColor") {
		swatchIndex = i;
		// Edit the pattern swatch
		currentSwatch.color.pattern.name = "EditedPatternSwatch";
		currentSwatch.color.reflect = true;
		currentSwatch.color.reflectAngle = 10.0;
		currentSwatch.color.rotation = 45;
		currentSwatch.color.scaleFactor = new Array(150,150);
		currentSwatch.color.shearAngle = 50;
		break;
	}
}
// Apply the edited pattern swatch to a new path item
var pathRef = docRef.pathItems.star (300, 300, 100, 30, 5, false);
pathRef.filled = true;
pathRef.fillColor = docRef.swatches[swatchIndex].color;
pathRef.stroked = true;