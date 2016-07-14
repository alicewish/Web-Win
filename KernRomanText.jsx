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
 
KernRomanText.jsx

DESCRIPTION
 
Adds a mixture of Asian and Roman text to a text item then
applies RomanOnlyKerning to demonstrate how the Asian glyphs
are unaffected by the kerning.
 
**********************************************************/
 
var docRef = app.documents.add(DocumentColorSpace.CMYK);

// Create a new text frame in the document.
var textRef = docRef.textFrames.add();
textRef.top = 100;
textRef.left = 200;

// Add Roman and Asian text to the text frame.
textRef.contents = "Roman text \u8B2C\u5EDF\u7015";
 
// Create a new character style and set the kerning method and fill color
var charStyle = docRef.characterStyles.add("KernRomanText");
charStyle.characterAttributes.kerningMethod = AutoKernType.METRICSROMANONLY;
 
var cmykColor = new CMYKColor();
cmykColor.cyan = 50;
cmykColor.magenta = 20;
cmykColor.yellow = 10;
cmykColor.black = 5;
charStyle.characterAttributes.fillColor = cmykColor; 
 
charStyle.applyTo(textRef.textRange);
