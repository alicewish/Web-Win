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
 
Symbols from Styles.jsx

DESCRIPTION

This sample script will create a symbol and symbolItem for 
every graphic style in a document

 
**********************************************************/

var rs = "Script completed without error.";
var docRef = null;
var pathRef1 = null;
var symbolRef = null;
var symbolItemRef = null;
var iCount = 0;
var y = 750;
var x = 100;
var i = 0;

try
{
  docRef = documents.add();
  iCount = docRef.graphicStyles.length;

  y = docRef.height - 70;

  // For each graphicStyle, create a rectangle and apply the style
  for(i=0; i<iCount; i++)
  {
    pathRef1 = docRef.pathItems.rectangle( y, x, 20, 20 );
    pathRef1.name = docRef.graphicStyles[i].name;
    docRef.graphicStyles[i].applyTo(pathRef1);

    // Add a symbol using the new rectangle/style
    symbolRef = docRef.symbols.add(pathRef1);
    symbolRef.name = docRef.graphicStyles[i].name;

    // Add a symbolItem using the new symbol
    symbolItemRef = docRef.symbolItems.add(symbolRef);
    symbolItemRef.top = y;
    symbolItemRef.left = x + 100;
    symbolItemRef.name = docRef.graphicStyles[i].name;

    if( (y-=50) < 100)
    {
        y = docRef.height - 70;
        x += 200;
    }
  }

  redraw();

}
catch(err)
{
    rs = "ERROR: " + (err.number & 0xFFFF) + ", " + err.description;
}
      
alert(rs);



