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
 
SelectRangeOfText.jsx

DESCRIPTION

This sample creates a text item with 3 lines and selects 
the 2nd line.
 
**********************************************************/

var docRef = documents.add();
var textRef = docRef.textFrames.add();
textRef.top = 500;
textRef.left = 200;
textRef.contents = "Line 1 \rLine 2 (selected) \rLine 3";
textRef.lines[1].select();
