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
 
MoveItem.jsx

DESCRIPTION

This sample duplicates a page item and moves it to a new 
document in a new layer called "targetLayer"
 
**********************************************************/

if(documents.length > 0)
{
    sourceDoc = activeDocument;
    if(sourceDoc.pageItems.length > 0 )
    {
        targetDoc = documents.add();
        targetLayer = targetDoc.layers.add();
        targetLayer.name = "targetLayer";

        sourcePageRef = sourceDoc.pageItems[0];
        dupRef = sourcePageRef.duplicate();

        // now move the new page item to the beginning of the new layer.
        // the new layer is in a different document
        dupRef.moveToBeginning (targetLayer);
    }
    else
    {
        alert("Add at least 1 page item to the document.");
    }
}
else
{
    alert("Create a document with at least 1 page item before running this script.");
}

