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
 
Brushes.jsx

DESCRIPTION

This sample gets a brush from user and creates CMYK color for brush 
stroke and applies it to the selected objects.
 
**********************************************************/

// Main Code [Execution of script begins here]

//$.level = 1;
//debugger;

// If a docuement is open
if ( app.documents.length > 0 )
{
	// Get selected objects
	var selectedObjs = app.activeDocument.selection;
	
	if ( selectedObjs.length > 0 )
	{
		//Get brushes available in the current document
		var docBrushes = app.activeDocument.brushes;
		var brushList = "List of Brushes in the current Document: \n";
		
		// Get Graphic Styles in the current document
		var docGraphicStyles = app.activeDocument.graphicStyles;
		
		for ( i=0 ; i < docBrushes.length ; i++)
		{
			brushList += "\n" + i + " :" + docBrushes[i];
		}

		alert( brushList );
		var brushIndex = prompt ( "Select the brush index you want: [0-" + (docBrushes.length - 1) + "]", ' ' );
		
		// Apply a colored brush to the selected PathItem objects.
		// A brush does not have a color property. 
		// The stroke color is applied to a brush. 
		// Call function getBrushColor to get the brush color.
	    var brushColor = getBrushColor();
	    
	    // Call functino applyBrushAndColor to apply color and user selected brush.
	    applyBrushAndColor();
	}
	else
	{
		alert( "Please select some objects." );
	}
}
else
{
	alert("Please open any document and select some objects.");
}


/*********************************************************

getBrushColor: Function to get a brush stroke in 
the document and create a CMYK color for the brush stroke.

**********************************************************/

function getBrushColor()
{
	// Create a red CMYK color object for brush color
	myCMYKColor = new CMYKColor();
	myCMYKColor.cyan = 0;
	myCMYKColor.magenta = 100;
	myCMYKColor.yellow = 100;
	myCMYKColor.black = 0;
	return myCMYKColor;
}

/*********************************************************

applyBrushAndColor: Function to apply the colored brush to
all selected objects.

**********************************************************/

function applyBrushAndColor()
{
	// Apply the colored brush to all selected objects
	for ( i=0 ; i < selectedObjs.length ; i++)
	{
		selectedObjs[i].stroked = true;
		selectedObjs[i].strokeColor = brushColor;
		
		myBrush = docBrushes[brushIndex];
		// Alternatively you can also get it using the name if known using the following statement
		// myBrush = docBrushes.getByName("Brush Chalk Scribble");
		
		myBrush.applyTo(selectedObjs[i]);
	}
}