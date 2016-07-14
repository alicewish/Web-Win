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
 
CreateSwatchGroup.jsx

DESCRIPTION

Create a new swatch group and add swatches to it from 
the general swatches group.
 
**********************************************************/

var docRef = app.documents.add(DocumentColorSpace.CMYK);

// Create a new SwatchGroup
var swatchGroup = docRef.swatchGroups.add();
swatchGroup.name = "CreateSwatchGroup";

// Get list of swatches in general swatch group
var genSwatchGroup = docRef.swatchGroups[0];

// Collect 5 random swatches from general swatch group and move to new group
var i = 0;
while (i < 5) {
	var swatches = genSwatchGroup.getAllSwatches();
	swatchCount = swatches.length;
	var swatchIndex = Math.round(Math.random() * (swatchCount - 1)); // 0-based index
	
	// New swatch group does not allow patterns or gradients
	if (swatches[swatchIndex].color.typename != "PatternColor" && swatches[swatchIndex].color.typename != "GradientColor") {
		swatchGroup.addSwatch(swatches[swatchIndex]);
		i++;
	}
}
// Updates swatch list with swatches moved to new swatch group
swatches = swatchGroup.getAllSwatches();

// Create new art in the document and apply each swatch in the new swatch group to a path item
var groupItems = docRef.groupItems;
var groupRef = groupItems.add();
var pathItems = groupRef.pathItems;

var pathRef1 = pathItems.add();
pathRef1.setEntirePath(new Array(
								new Array(52.37, 438.33),
								new Array(262.7, 395.03),
								new Array(262.7, 481.63),
								new Array(52.37, 438.33)));
pathRef1.filled = true;
pathRef1.fillColor = swatches[0].color;
								
var pathRef2 = pathItems.add();
pathRef2.setEntirePath(new Array(
								new Array(306, 691.97),
								new Array(262.7, 481.63),
								new Array(349.3, 481.63),
								new Array(306, 691.97)));
pathRef2.filled = true;
pathRef2.fillColor = swatches[1].color;
								
var pathRef3 = pathItems.add();
pathRef3.setEntirePath(new Array(
								new Array(559.63, 438.33),
								new Array(349.3, 481.63),
								new Array(349.3, 395.03),
								new Array(559.63, 438.33)));
pathRef3.filled = true;
pathRef3.fillColor = swatches[2].color;
								
var pathRef4 = pathItems.add();
pathRef4.setEntirePath(new Array(
								new Array(306, 184.7),
								new Array(349.3, 395.03),
								new Array(262.7, 395.03),
								new Array(306, 184.7)));
pathRef4.filled = true;
pathRef4.fillColor = swatches[3].color;
								
var pathRef5 = pathItems.add();
pathRef5.setEntirePath(new Array(
								new Array(262.7, 481.63),
								new Array(349.3, 481.63),
								new Array(349.3, 395.03),
								new Array(262.7, 395.03),
								new Array(262.7, 481.63)));
pathRef5.filled = true;
pathRef5.fillColor = swatches[4].color;