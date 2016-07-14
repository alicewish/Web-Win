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
 
AddArtboards.jsx

DESCRIPTION

Add a new artboard to an existing document.
 
**********************************************************/

if (app.documents.length > 0) {
		var docRef = app.activeDocument;
		var numArtboardsBefore = docRef.artboards.length;
		docRef.artboards.add ([700,500,900,200]);
		var numArtboardsAfter = docRef.artboards.length;
		if (numArtboardsAfter = (numArtboardsBefore + 1)) {
				alert('Correct number artboards' , 'Result');
		}
		else {
				alert('Incorrect number artboards', 'Result');
		}
}
else {
		alert('Open a document before running this script', 'Error running AddArtboards.jsx');
}