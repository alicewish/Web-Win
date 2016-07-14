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
 
SwatchGroupFromArt.jsx

DESCRIPTION

Create a new swatch group using colors in selected path item art.
 
**********************************************************/
// Check there is at least 1 document open
if (app.documents.length > 0 ) {
	var docRef = app.activeDocument;
	
	// Check there is a selection in the document
	if (docRef.selection.length > 0 ) {
		var paths = docRef.selection;
		// Add a new swatch group if it does not already exist
		var swatchGroup = null;
		var swatchGroupExists = false;
		for (var i = 0; i < docRef.swatchGroups.length; i++) {		
			if (docRef.swatchGroups[i].name == "SwatchGroupFromArt") {
				swatchGroup = docRef.swatchGroups[i];
				swatchGroupExists = true;			
			}		
		}
	
		if (!swatchGroupExists) {
			// Create new swatch group
			swatchGroup = docRef.swatchGroups.add();
			swatchGroup.name = "SwatchGroupFromArt";
		}
		
		// Iterate through selected items		
		IterateSelection(paths);
	}
	else
		alert("Select some path art with colors applied before running this script");
}
else
	alert("Open a document containing some colored path art before running this script");

function IterateSelection(selectedItems)
{
	// Get the fill color of each selected item
	for (i = 0; i < selectedItems.length; i++) {
		var pathRef = selectedItems[i];
	
		// Iterate path items within group items
		if (pathRef.typename == "GroupItem") {
			var groupPaths = pathRef.pathItems;
			IterateSelection(groupPaths);
		}
		else if (pathRef.typename == "PathItem") {
			// Do not continue if fill color is a gradient or pattern
			if (!(pathRef.fillColor.typename == "GradientColor") && !(pathRef.fillColor.typename == "PatternColor")) {
				// Iterate through existing swatches, checking if the color already exists in a swatch
				var swatchExists = false;
				for (var j = 0; j < docRef.swatches.length; j++) {
					var currentSwatchColor = docRef.swatches[j].color;
					if (ColorEquals(pathRef.fillColor, currentSwatchColor)) {
						// Add the existing swatch to the swatch group
						swatchGroup.addSwatch(docRef.swatches[j]);
						swatchExists = true;
					}
				}
				if (swatchExists == false) {
					// Create a new swatch in the swatch group
					var newSwatch = docRef.swatches.add();
					newSwatch.color = pathRef.fillColor;
					swatchGroup.addSwatch(newSwatch);
				}
			}
		}
	}
}

function ColorEquals(fillColor, swatchColor)
{
	var colorEquals = false;					
	// Compare colors
	if (fillColor.typename == swatchColor.typename) {
		switch (swatchColor.typename) {
			case "CMYKColor":
				colorEquals = CMYKColorEquals(fillColor, swatchColor);
				break;
			case "RGBColor":
				colorEquals= RGBColorEquals(fillColor, swatchColor);
				break;
			case "GrayColor":
				colorEquals = GrayColorEquals(fillColor, swatchColor);
				break;
			case "LabColor":
				colorEquals = LabColorEquals(fillColor, swatchColor);
				break;
			case "SpotColor":
				colorEquals = SpotColorEquals(fillColor, swatchColor);
				break;
			case "NoColor":
				break;
			case "PatternColor":
				break;
			case "GradientColor":
				break;
			default:
				break;
		}
	}
	return colorEquals;
}

function CMYKColorEquals(fillColor, swatchColor)
{
	var colorEquals = false;
	if ((fillColor.cyan == swatchColor.cyan) &&
		(fillColor.magenta == swatchColor.magenta)&& 
		(fillColor.yellow == swatchColor.yellow) &&
		(fillColor.black == swatchColor.black)) {
			colorEquals = true;
	}
	return colorEquals;
}

function RGBColorEquals(fillColor, swatchColor)
{
	var colorEquals = false;
	if ((fillColor.red == swatchColor.red) &&
		(fillColor.green == swatchColor.green)&& 
		(fillColor.blue == swatchColor.blue)) {
			colorEquals = true;
	}
	return colorEquals;
}

function GrayColorEquals(fillColor, swatchColor)
{
	var colorEquals = false;
	if ((fillColor.gray == swatchColor.gray)) {
			colorEquals = true;
	}
	return colorEquals;
}

function LabColorEquals(fillColor, swatchColor)
{
	var colorEquals = false;
	if ((fillColor.l == swatchColor.l) &&
		(fillColor.a == swatchColor.a)&& 
		(fillColor.b == swatchColor.b)) {
			colorEquals = true;
	}
	return colorEquals;
}

function SpotColorEquals(fillColor, swatchColor)
{
	var colorEquals = false;
	switch (swatchColor.spot.color.typename) {
		case "CMYKColor":
			colorEquals = CMYKColorEquals(fillColor.spot.color, swatchColor.spot.color);
			break;
		case "RGBColor":
			colorEquals = RGBColorEquals(fillColor.spot.color, swatchColor.spot.color);
			break;
		case "GrayColor":
			colorEquals = GrayColorEquals(fillColor.spot.color, swatchColor.spot.color);
			break;
		case "LabColor":
			colorEquals = LabColorEquals(fillColor.spot.color, swatchColor.spot.color);
			break;
		default:
			break;
	}
	return colorEquals;
}