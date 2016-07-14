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
 
ExportAsDWG.jsx

DESCRIPTION

Creates and exports a new AutoCAD DWG file.

**********************************************************/

var docRef = app.documents.add();
var groupItems = docRef.groupItems;
var groupRef = groupItems.add();
var pathItems = groupRef.pathItems;

// Create new drawing on artboard.
var pathRef1 = pathItems.add();
pathRef1.setEntirePath(new Array(
								new Array(52.37, 438.33),
								new Array(262.7, 395.03),
								new Array(262.7, 481.63),
								new Array(52.37, 438.33),
								new Array(262.7, 438.33)));
								
var pathRef2 = pathItems.add();
pathRef2.setEntirePath(new Array(
								new Array(306, 691.97),
								new Array(262.7, 481.63),
								new Array(349.3, 481.63),
								new Array(306, 691.97),
								new Array(306, 481.63)));
								
var pathRef3 = pathItems.add();
pathRef3.setEntirePath(new Array(
								new Array(559.63, 438.33),
								new Array(349.3, 481.63),
								new Array(349.3, 395.03),
								new Array(559.63, 438.33),
								new Array(349.3, 438.33)));
								
var pathRef4 = pathItems.add();
pathRef4.setEntirePath(new Array(
								new Array(306, 184.7),
								new Array(349.3, 395.03),
								new Array(262.7, 395.03),
								new Array(306, 184.7),
								new Array(306, 395.03)));
								
// Add a new layer containing more art
var layerRef = docRef.layers.add();
pathItems = layerRef.pathItems;
								
var pathRef5 = pathItems.add();
pathRef5.setEntirePath(new Array(
								new Array(262.7, 481.63),
								new Array(349.3, 395.03)));
								
var pathRef6 = pathItems.add();
pathRef6.setEntirePath(new Array(
								new Array(262.7, 395.03),
								new Array(349.3, 481.63)));
								

// Save document as AutoCAD DWG file.
var destFolder = Folder.selectDialog('Select the folder to export the AutoCAD(DWG/DXF) file to:');
if (destFolder) {
	var destFile = new File(destFolder + '/ExportAsDWG.dwg');
	var exportAutoCADOptions = new ExportOptionsAutoCAD();
	exportAutoCADOptions.exportFileFormat = AutoCADExportFileFormat.DXF;
	exportAutoCADOptions.exportOption = AutoCADExportOption.MaximumEditability;
	exportAutoCADOptions.version = AutoCADCompatibility.AutoCADRelease18;
	docRef.exportFile(destFile, ExportType.AUTOCAD, exportAutoCADOptions);
}
