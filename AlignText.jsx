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
 
AlignText.jsx

DESCRIPTION

This sample aligns all the text in a document to the left.
 
**********************************************************/

// Align Text
// Requires a document with multiple text items open.

if(documents.length > 0)
{
   var textRefs = activeDocument.textFrames;

   if(textRefs.length > 1)
   {
      for (var i = 0 ; i < textRefs.length; i++)
      {
         textRefs[i].left = 200;
      }

      redraw();
   }
   else
   {
      alert("Open a document with multiple text items.");
   }
}
else
{
   alert("Open a document with multiple text items.");
}

