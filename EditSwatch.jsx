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
 
EditSwatch.jsx

DESCRIPTION

Search for and edit the white swatch in the general swatch group.
 
**********************************************************/

var docRef = app.documents.add(DocumentColorSpace.CMYK);

// Find the first swatch in the document
var swatchIndex = 2; // white swatch
var currentSwatch = docRef.swatches[swatchIndex];

// Apply new color to the swatch
var cmykColor = currentSwatch.color;
cmykColor.cyan = 45;
cmykColor.magenta = 35;
cmykColor.yellow = 0;
cmykColor.black = 5;

// Apply new name  to the swatch
currentSwatch.name = "EditedSwatch";

// Apply the edited swatch to a new path item
var pathRef = docRef.pathItems.polygon (300, 300, 200, 8, false)
pathRef.filled = true;
pathRef.fillColor = docRef.swatches[swatchIndex].color;
pathRef.stroked = true;