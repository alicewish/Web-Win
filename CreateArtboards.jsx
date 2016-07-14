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
 
CreateArtboards.jsx

DESCRIPTION

Creates a new document containing 6 artboards, adds a 
rectangle spread across all artboards, adds star objects 
randomly across the artboards, as well as 2 larger stars 
that spread across artboards.
 
**********************************************************/

// Create new document with 6 artboards
var docRef = app.documents.add(DocumentColorSpace.CMYK, 612.0, 792.0, 6, DocumentArtboardLayout.GridByRow, 20.0, 3);

// Create rectangle
var artboardRef = docRef.artboards[0];
var rect = docRef.pathItems.rectangle (artboardRef.artboardRect[1] - 20, artboardRef.artboardRect[0] + 20, 1200, 2350, false);
var rectColor = new CMYKColor();
rectColor.cyan = 0;
rectColor.magenta = 0;
rectColor.yellow = 20;
rectColor.black = 0;
rect.fillColor = rectColor;

// Create first star
var star1 = docRef.pathItems.star(620, 1610, 200, 100, 7, false);
var starColor = new CMYKColor();
starColor.cyan = 50;
starColor.magenta = 50;
starColor.yellow = 0;
starColor.black = 0;
star1.fillColor = starColor;

// Create second star
var star2 = docRef.pathItems.star(620, 795, 200, 100, 7, false);
starColor.cyan = 0;
starColor.yellow = 50;
star2.fillColor = starColor;

// Create 50 random stars
for (var i = 0; i < 50; i++) {
		var centerX = (Math.random() * 1200) + 40;
		var centerY = (Math.random() * 2300) + 40;
		var randomStar = docRef.pathItems.star (centerX, centerY, 50, 20, 9, false);
		// create a random CMYK color and assign as the fill color
		starColor.cyan = Math.random() * 100;
		starColor.yellow = Math.random() * 100;
		starColor.magenta = Math.random() * 100;
		randomStar.fillColor = starColor;
}