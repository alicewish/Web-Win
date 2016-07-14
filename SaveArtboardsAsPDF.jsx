/**********************************************************

ADOBE SYSTEMS INCORPORATED 
Copyright 2008-2010 Adobe Systems Incorporated 
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
 
SaveArtboardsAsPDF.jsx

DESCRIPTION

Creates a new document containing several artboards then
saves the artboards to PDF.
 
**********************************************************/

var docRef = app.documents.add(DocumentColorSpace.RGB, 612.0, 792.0, 3, DocumentArtboardLayout.GridByCol, 20.0, 3);
	
// Add a star to each artboard
var artboardRef = docRef.artboards[0];
var star1 = docRef.pathItems.star (artboardRef.artboardRect[0] + 300, artboardRef.artboardRect[1] - 350, 200, 50, 5, false);
var starColor = new RGBColor();
starColor.red = 255;
starColor.green = 0;
starColor.blue = 0;
star1.fillColor = starColor;

artboardRef = docRef.artboards[1];
var star2 = docRef.pathItems.star (artboardRef.artboardRect[0] + 300, artboardRef.artboardRect[1] - 350, 200, 50, 5, false);
starColor.red = 0;
starColor.green = 255;
starColor.blue = 0;
star2.fillColor = starColor;

artboardRef = docRef.artboards[2];
var star3 = docRef.pathItems.star (artboardRef.artboardRect[0] + 300, artboardRef.artboardRect[1] - 350, 200, 50, 5, false);
starColor.red = 0;
starColor.green = 0;
starColor.blue = 255;
star3.fillColor = starColor;
	
// Save the artboards to PDF.
var destFolder = Folder.selectDialog('Select the folder to save the PDF files to:');
if (destFolder) {
	var destFile = new File(destFolder + '/Artboard');
	
	var pdfSaveOptions = new PDFSaveOptions();
	pdfSaveOptions.viewAfterSaving = true;
	docRef.saveAs (destFile,  pdfSaveOptions);	
}	

