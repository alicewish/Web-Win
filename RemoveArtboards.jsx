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
 
RemoveArtboards.jsx

DESCRIPTION

Remove an artboard from an existing document.
 
**********************************************************/

if (app.documents.length > 0) {
		var docRef = app.activeDocument;
		if (docRef.artboards.length > 1) {
			// Remove last artboard
			docRef.artboards.remove(docRef.artboards.length - 1);
		}
		else {
				alert('Cannot remove the only artboard in the document', 'Error removing artboard');
		}
}
else {
		alert('Open a document with more than 1 artboard before running this script', 'Error running RemoveArtboards.jsx');
}