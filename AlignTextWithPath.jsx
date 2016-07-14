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
 
AlignTextWithPath.jsx

DESCRIPTION

This sample adds the selected text at the upper left
corner of the selected path item.
 
**********************************************************/
if(app.documents.length == 0)
{
    app.documents.add();
}
var items = selection;
if ( items.length != 2 )
{
	alert("Select a path and a text art before running this script.");
}
else
{
	var textArtRef = null;
	var pathRef = null;
	for ( i = 0; i != 2; ++i )
	{
		if ( items[ i ].typename == "TextFrame" )
		{
			textArtRef = items[ i ];
		}
		else if ( items[ i ].typename == "PathItem" )
		{
			pathRef = items[ i ];
		}
	}

	// we require that the selection contained a textartitem and a pathReference
	if ( ( null == textArtRef ) || ( null == pathRef ) )
	{
		alert("Select a path and a text art before running this script");
	}
	else
	{
		// Put the text art item at the top left corner of the path item	
		textArtRef.position = pathRef.position;
		redraw();
	}
}
