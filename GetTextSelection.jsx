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
 
GetTextSelection.jsx

DESCRIPTION

This sample Display the text of the selected text ranges 
or text frames.
 
**********************************************************/

// if a document is open
if(documents.length >0)
{
   // if textframes exist in the document
   if(activeDocument.textFrames.length > 0)
   {
      // check to make sure something is selected.
      selectedItems = selection
      if (selectedItems.length > 0) 
      {
         // If the user has selected characters inside a text frame then 
         // typename is TextRange. Display it contents and return.
         if (selectedItems.typename == "TextRange") 
         {
            alert ("The following text is selected: >" + selectedItems.contents + "<");
         }

         else
         {   // If we get here, there are selected text frames. Display the contents of each. 
            var itemFound = false;
            for(var i=0; i<selectedItems.length; i++)
            {
               if(selectedItems[i].typename == "TextFrame")
               {
                  itemFound = true;
                  alert ("The following text item is selected: >" + selectedItems[i].contents + "<")
               }
            }

            if(itemFound == false) alert("No text items are selected.");
         }
      }
      else
      {
         alert("Nothing is selected, select a text item(s) or a text range.");
      }

   }
   else
   {
      alert("Open a document and select 1 or more text items or a text range.");
   }
}
else
{
   alert("Open a document and select 1 or more text items or a text range.");
}

