// Import DICOM folder - Photoshop CS/CS2 Script
// Description: Imports a series of images (from the designated folder)
// Author: Mark Maguire
// Version: 1.0, 10/Aug/2006

/*
@@@BUILDINFO@@@ Load DICOM.jsx 1.0.0.0
*/

//
// Load DICOM.jsx - does just that.
//

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/LoadDICOM/Menu=Load Multiple DICOM Files...</name>
<about>$$$/JavaScripts/LoadDICOM/About=Load Multiple DICOM Files^r^rCopyright 2006-2007 Adobe Systems Incorporated. All rights reserved.^r^rLoads multiple one frame DICOM files into Photoshop documents.</about>
<featureenabled>Dicom</featureenabled>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/
// debugging code
/*
debugger;
$.level = 1;
*/

// on localized builds we pull the $$$/Strings from a .dat file
$.localize = true;

// enable double-clicking from Mac Finder or Windows Explorer
#target photoshop // this command only works in Photoshop CS2 and higher

// bring application forward for double-click events
app.bringToFront();

// Please set your own values for these parameters in the importDICOMFolder function
function openDICOM( inFileName, inRows, inCols, inAnonymize, inOverlays, inWindowLevel, inWindowWidth, inReverseImage )
{
    // Get ID's for the related keys
    var keyRowsID      		= charIDToTypeID( "RoWs" );
    var keyColsID     		= charIDToTypeID( "ColM" );
    var keyAnonymizeID  	= charIDToTypeID( "OvLy" );
    var keyOverlaysID   	= charIDToTypeID( "AnYm" );
    var keyWLevelID     	= charIDToTypeID( "WleV" );
    var keyWWidthID      	= charIDToTypeID( "WWiT" );
    var keyReverseImageID   = charIDToTypeID( "RvsE" );
    var keyOpen 			= charIDToTypeID( "Opn " );
    var keyAS				= charIDToTypeID( "OpAs" );
    var keyDICOM		    = app.stringIDToTypeID( "Dicom" );
    var keyNULL				= charIDToTypeID( "null" );
     
   
    var myOpenDescriptor = new ActionDescriptor();
    myOpenDescriptor.putPath( keyNULL, new File(inFileName) );
    
    var myAsDescriptor = new ActionDescriptor();
    myAsDescriptor.putInteger( keyRowsID, inRows );
    myAsDescriptor.putInteger( keyColsID, inCols );
    myAsDescriptor.putBoolean( keyAnonymizeID, inAnonymize);
    myAsDescriptor.putBoolean( keyOverlaysID, inOverlays );
    myAsDescriptor.putInteger( keyWLevelID, inWindowLevel);
    myAsDescriptor.putInteger( keyWWidthID, inWindowWidth );
    myAsDescriptor.putBoolean( keyReverseImageID, inReverseImage );
    
    myOpenDescriptor.putObject(keyAS, keyDICOM, myAsDescriptor);

    executeAction( keyOpen, myOpenDescriptor, DialogModes.NO );
}

// determine Photoshop version number
function getCSVersion() {
	return parseInt(app.version);
}

function getFolder() {
	// display the Path Entry dialog with Browse option for Photoshop CS
	if (getCSVersion() === 8) {
		alert(localize("$$$/AdobeDicom/AdobeScripts/Shared/LoadDICOM/incompatiblePSVersion=The version of Photoshop does not support DICOM files."));
		return null;
	}
	// display only the browse dialog for Photoshop CS2+
	else {
		return Folder.selectDialog(localize("$$$/AdobeDicom/AdobeScripts/Shared/LoadDICOM/SelectFiles=Please select the folder of DICOM files to be imported:"), Folder('~'));
	}
}

function importDICOMFolder(selectedFolder) {

	// if a folder was selected continue with action, otherwise quit
	if (selectedFolder) 
	{

		// create document list from files in selected folder
		var docList = selectedFolder.getFiles();
		for (var i = 0; i < docList.length; i++) {

			// open each document in file list
			if (docList[i] instanceof File) {

				// get the file name
				var fName = docList[i].name.toLowerCase();

				// check for supported file formats - if your files do not have extensions remove this check
				//if ((fName.indexOf(".dcm") == -1) && (fName.indexOf(".dic") == -1) && (fName.indexOf(".dc3") == -1) && (fName.indexOf("   ") == -1)) {
					// skip unsupported formats
				//} else {
				    openDICOM(docList[i], 0, 0, false, false, 0, 0, false );
				//}
			}
		}

		if (docList.length <= 0) 
		{
			// display error message if no supported documents were found in the designated folder
			alert(localize("$$$/AdobeDicom/AdobeScripts/Shared/LoadDICOM/NoSupportedFiles=Sorry, but the designated folder does not contain any DICOM files.\n\nPlease choose another folder."));
			importDICOMFolder(getFolder());
		}
	} else {
		alert(localize("$$$/AdobeDicom/AdobeScripts/Shared/LoadDICOM/UserCancelled=The action has been cancelled."));
	}
}

importDICOMFolder(getFolder());
