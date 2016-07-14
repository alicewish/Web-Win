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
 
Variables and Datasets.jsx

DESCRIPTION

This sample script will create 2 variables (text and visiblity)
and 10 datasets (alternating between visible and hidden). The
variables are then exported and the document is closed.
The document is re-opened and the saved variables are imported.
 
**********************************************************/

var rs = "OK";
var textRef;
var textVar;
var pathRef;
var aiFilePath = Folder.desktop + '/DS_and_V.ai'
var xmlFilePath = Folder.desktop + '/DS_and_V.xml'

try
{
   var docRef = documents.add();

   // add a text item and variable
   var textRef = docRef.textFrames.add();
   textRef.contents = "Visible"
   textRef.top = 400;
   textRef.left = 100;
   
   var textVar = docRef.variables.add();
   textVar.kind = VariableKind.TEXTUAL;
   textRef.contentVariable = textVar;
  

   // add a pageItem and visibility variable
   pathRef = docRef.pathItems.rectangle(450, 300, 100, 100);
   docRef.graphicStyles[1].applyTo(pathRef);
   
   var visibilityVar = docRef.variables.add();
   visibilityVar.kind = VariableKind.VISIBILITY;
   pathRef.visibilityVariable = visibilityVar;

   alert("Variables created, saving document.");
   docRef.saveAs(new File(aiFilePath));


   // add 10 datasets, alternating between hidden and visible
   alert("Creating and exporting 10 datasets.");
   var i = 1
   for (i=1; i<11; i++)
   {
      if ((i%2) == 0)
      {
         pathRef.hidden = false;
         textRef.contents = "Dataset #" + i + ", Visible";
      }
      else
      {
         pathRef.hidden = true;
         textRef.contents = "Dataset #" + i + ", Hidden";
      }
      dsRef = docRef.dataSets.add();
   }

 
   // Export the datasets and variables and close the file
   docRef.exportVariables(new File(xmlFilePath));
   alert("Closing and reopening the document.");
   docRef.close(SaveOptions.DONOTSAVECHANGES);

   // Open the file and import the datasets and variables from xml file
   docRef = open(new File(aiFilePath));
   
   alert("Importing the datasets.");
   docRef.importVariables(new File(xmlFilePath));

   rs = "OK";
}
catch (err)
{
   rs = ("ERROR: " + (err.number & 0xFFFF) + ", " + err.description);
   alert(rs);
}

rs;


