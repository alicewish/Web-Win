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
 
MakeLinearGradient.jsx

DESCRIPTION

This Sample creates a linear gradient and adds it to the Swatches 
palette then applies it to all path item objects in the document.
It shows the use of the PathItems and GradientStops collections, 
RGBColor, Gradient and GradientStop objects.

**********************************************************/

// Check a document is open
if ( app.documents.length > 0 )
{
	var docPathItems = app.activeDocument.pathItems;

	if ( docPathItems.length > 0 )

	{
		// If the gradient already exists, display alert
        var gradientExists = false;
		var myGradients = app.activeDocument.gradients;
		var numberOfGradients = myGradients.length;
		var i;
		if (numberOfGradients > 0)
		{
		    for (i = 0; i < numberOfGradients; i++)
		    {
		        if (myGradients[i].name == "MyLinearGradient")
		        {
		            gradientExists = true;
		        }
		    }
		}   
		
		if (gradientExists == false)
		{
		    // Call createGradient function to create gradient myGradient
		    var myGradient = createGradient();

		    // Apply gradient myGradient to all objects selected 
		    // in the document
		    for ( var i=0; i < docPathItems.length ; i++ )
		    {
		    	docPathItems[i].filled = true;
		    	docPathItems[i].fillColor = myGradient;
		    }
		    redraw();
		    alert( "Note that MyLinearGradient has been added to the Swatches panel." );
		}
		else
		{
		    alert("Gradient already exists, start script from a new document.");
		}
	}
	else
	{
		alert( "No path items in the document." );
	}
}
else
{
	alert( "Please open a document with path items." );
}

/*********************************************************
 
createGradient: Function to create a new linear gradient 
with 4 GradientStops

**********************************************************/

function createGradient()
{

	// Create a new gradient
	// A new gradient always has 2 stops
	var theGradient = app.activeDocument.gradients.add();
	theGradient.name = "MyLinearGradient";
	theGradient.type = GradientType.LINEAR;	
	
	// Add 2 new gradient stops
	var newStop1 = theGradient.gradientStops.add();
	var newStop2 = theGradient.gradientStops.add();
	
	// Create color objects for all the gradient stops
	var startColor = new RGBColor();
	var newStop1Color = new RGBColor();
	var newStop2Color = new RGBColor();
	var endColor = new RGBColor();
	startColor.red = 0;
	startColor.green = 100;
	startColor.blue = 255;
	newStop1Color.red = 0;
	newStop1Color.green = 0;
	newStop1Color.blue = 120;
	newStop2Color.red = 120;
	newStop2Color.green = 0;
	newStop2Color.blue = 0;
	endColor.red = 220;
	endColor.green = 0;
	endColor.blue = 100;		
	
	// Modify the first gradient stop
	theGradient.gradientStops[0].rampPoint = 5;
	theGradient.gradientStops[0].midPoint = 50;
	theGradient.gradientStops[0].color = startColor;	
	
	// Modify newStop1
	theGradient.gradientStops[1].rampPoint = 30;
	theGradient.gradientStops[1].midPoint = 50;
	theGradient.gradientStops[1].color = newStop1Color;
	theGradient.gradientStops[1].opacity = 0.5;
	
	// Modify newStop2
	theGradient.gradientStops[2].rampPoint = 55;
	theGradient.gradientStops[2].midPoint = 50;
	theGradient.gradientStops[2].color = newStop2Color;

	// Modify the last gradient stop
	theGradient.gradientStops[3].rampPoint = 90;
	theGradient.gradientStops[3].color = endColor;	
	theGradient.gradientStops[3].opacity = 0.25
	
	// Construct an Illustrator.GradientColor object referring to the
	// newly created gradient
	var myGradientColor = new GradientColor();
	myGradientColor.gradient = theGradient;
	return myGradientColor;
}
