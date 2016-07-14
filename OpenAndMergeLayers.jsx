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
 
OpenAndMergeLayers.jsx

DESCRIPTION

Opens an AutoCAD DWG file and merges all layers.

**********************************************************/

var fileRef = File.openDialog ("Select the AutoCAD (DWG) file to open:", "*.dwg", false);
if(fileRef.exists) {
	var autoCADOpenOptions = app.preferences.AutoCADFileOptions;
	autoCADOpenOptions.mergeLayers = true;
	var currentInteractionLevel = app.userInteractionLevel;
	app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
	app.open (fileRef, DocumentColorSpace.CMYK);
	app.userInteractionLevel = currentInteractionLevel;
}