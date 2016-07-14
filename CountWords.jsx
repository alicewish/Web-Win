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
 
CountWords.jsx

DESCRIPTION

This sample counts the number of words in a document and 
displays a message in the end.
 
**********************************************************/

// Count Words

var numberOfWords = 0;

if(documents.length > 0)
{
   var textRefs = activeDocument.textFrames;

   if(textRefs.length > 1)
   {
      for (var i = 0 ; i < textRefs.length; i++)
      {
         numberOfWords += textRefs[i].words.length;
      }

      alert("There are " + numberOfWords + " words in the active document");
   }
   else
   {
      alert("Open a document with text items.");
   }
}
else
{
   alert("Open a document with text items.");
}
