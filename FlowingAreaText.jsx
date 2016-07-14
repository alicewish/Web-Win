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
 
FlowingAreaText.jsx

DESCRIPTION

This sample creates a new document and adds 3 area text frames at different positions 
in the document, then creates text that will flow through each text frame.
 
**********************************************************/

var docRef = documents.add();
docRef.selection = null;
var itemRef1 = docRef.pathItems.rectangle( 600, 300, 100, 50);
var textRef1 = docRef.textFrames.areaText(itemRef1);
textRef1.selected = true;

// create 2nd text frame and link it the first
var itemRef2 = docRef.pathItems.rectangle(400, 300, 100, 50);
var textRef2 = docRef.textFrames.areaText(itemRef2, TextOrientation.HORIZONTAL, textRef1);
textRef2.selected = true;

// create 3rd text frame and link it the second
var itemRef3 = docRef.pathItems.rectangle(200, 300, 100, 50);
var textRef3 = docRef.textFrames.areaText(itemRef3, TextOrientation.HORIZONTAL, textRef2);
textRef3.selected = true;

// Add enough text to the 1st TextFrame to
// cause it to flow to the 2nd and 3rd textFrames
var sText = "This is three text frames linked together as one story, with text flowing from the first to the last";
sText += "The position and size of each item is similar.";
textRef1.contents = sText;

redraw();

















