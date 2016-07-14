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
 
SelectTextArt.jsx

DESCRIPTION

This sample accepts a search string from user and selects 
all the text art that contains that string.

**********************************************************/


var myString = prompt('Enter the string to search: ', ' ');

if(documents.length > 0)
{
   var docRef = activeDocument;

   // clear the old selection
   activeDocument.selection = null;

   // select all text art items that contain the target string
   for (i = 0; i < docRef.textFrames.length; i++)
   {
      contentString = docRef.textFrames[i].contents;
      if (contentString.indexOf(myString) != -1)
      {
         docRef.textFrames[i].selected = true;
      }
   }
   redraw();
}
else
{
   alert("Open a document with text items.");
}
