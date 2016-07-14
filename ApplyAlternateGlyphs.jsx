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
 
ApplyAlternateGlyphs.jsx

DESCRIPTION

Adds Asian text to a new document then sets the alternate glyph
form of each Asian character.

**********************************************************/

var docRef = app.documents.add();

// Create a new text frame in the new document
var textRef = docRef.textFrames.add();
textRef.top = 100;
textRef.left = 200;

// Add Asian text to the text frame
textRef.contents = "謬廟瀕";
var char1Ref = textRef.textRange.characters[0];
var char2Ref = textRef.textRange.characters[1];
var char3Ref = textRef.textRange.characters[2];

// Set the alternate glyph of each Asian character
char1Ref.characterAttributes.alternateGlyphs = AlternateGlyphsForm.EXPERT;
char2Ref.characterAttributes.alternateGlyphs = AlternateGlyphsForm.JIS78FORM;
char3Ref.characterAttributes.alternateGlyphs = AlternateGlyphsForm.JIS04FORM;