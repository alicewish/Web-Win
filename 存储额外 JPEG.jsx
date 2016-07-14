// (c) Copyright 2005.  Adobe Systems, Incorporated.  All rights reserved.

/*
@@@BUILDINFO@@@ Save Extra JPEG.jsx 1.0.0.0
*/

var begDesc = "$$$/JavaScripts/SaveExtraJPEG/Description=This script is designed to be used as a script that runs after a save event. The script will save an extra JPEG file next to the current active document. This script does not handle 'as a copy' when saving." // endDesc


// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

try {

	if ( UsingAsACopy( arguments[0] ) ) {
		alert( 	localize( '$$$/JavaScripts/SaveExtraJPEGWarning=Save used As A Copy, extra file may not save correctly.' ) );
	}
	
	var data = GetDataFromDocument( activeDocument );

	// if the current save was not a JPEG then save an extra JPEG
	// JPEG does not support Bitmap mode 	
    if ( 'jpg'  != data.extension.toLowerCase() && 
         'JPEG' != data.fileType && 
         DocumentMode.BITMAP != activeDocument.mode ) {

		SaveExtraJPEG( data );

    }

} // try end

catch( e ) {
	// always wrap your script with try/catch blocks so you don't stop production
	// remove comments below to see error for debugging 
	// alert( e );
}


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Function: SaveExtraJPEG
// Use: save the current document as a copy using JPEG options
// Input: a document must be active
// Params: folder, filename, extension
// Output: file saved as a copy next to the current active document
///////////////////////////////////////////////////////////////////////////////
function SaveExtraJPEG( data ) {
		// 'Save for Web' would be better but I'm lazy
        var jpegOptions = new JPEGSaveOptions();
        jpegOptions.quality = 2; // really low 
        jpegOptions.embedColorProfile = false; // really small
        
        // are we using extensions on this save
        var jpegExtension = '.jpg';
        if ( "" == data.extension ) {
			jpegExtension = "";
		}

        // third option is as a copy, set that to true 
        // so the activeDocument doesn't switch underneath the user
        activeDocument.saveAs( File( data.folder + 
                                     '/' + 
                                     data.fileName + 
                                     jpegExtension ), jpegOptions, true );
}

///////////////////////////////////////////////////////////////////////////////
// Function: UsingAsACopy
// Use: find out if the user used 'As A Copy'
// Input: action descriptor from the event that just occured
// Output: boolean that 'As A Copy' was checked
// Note: On script events the script gets passed in the actual action that
// occured we can look inside the action descriptor and pull information out
// in this case we are looking for the keyCopy
///////////////////////////////////////////////////////////////////////////////
function UsingAsACopy( actionDescriptor ) {
	var usingKeyCopy = false;
	if ( undefined != actionDescriptor ) {
		if ( "ActionDescriptor" == actionDescriptor.typename ) {
			var keyCopy = charIDToTypeID( "Cpy " );
			if ( actionDescriptor.hasKey( keyCopy ) ) {
				usingKeyCopy = actionDescriptor.getBoolean( keyCopy );
			}
		}
	}
	return usingKeyCopy;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetDataFromDocument
// Usage: pull data about the document passed in
// Input: document to gather data
// Output: Object containing folder, fileName, fileType, extension
///////////////////////////////////////////////////////////////////////////////
function GetDataFromDocument( inDocument ) {
	var data = new Object();
	var fullPathStr = inDocument.fullName.toString();
	var lastDot = fullPathStr.lastIndexOf( "." );
	var fileNameNoPath = fullPathStr.substr( 0, lastDot );
	data.extension = fullPathStr.substr( lastDot + 1, fullPathStr.length );
	var lastSlash = fullPathStr.lastIndexOf( "/" );
	data.fileName = fileNameNoPath.substr( lastSlash + 1, fileNameNoPath.length );
	data.folder = fileNameNoPath.substr( 0, lastSlash );
	data.fileType = inDocument.fullName.type;
	return data;
}
