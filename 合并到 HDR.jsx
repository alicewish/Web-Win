// (c) Copyright 2005.  Adobe Systems, Incorporated.  All rights reserved.

//
// MergeToHDR automation in JavaScript
//

/*
@@@BUILDINFO@@@ Merge to HDR.jsx 2.0.0.0
*/

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/Merge2HDR/Menu=Merge to HDR...</name>
<about>$$$/JavaScripts/Merge2HDR/About=Merge to HDR^r^rCopyright 2006-2007 Adobe Systems Incorporated. All rights reserved.^r^rCombines multiple images with different exposures, capturing the dynamic range of a scene in a single HDR image.</about>
<menu>automate</menu>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING
*/

// on localized builds we pull the $$$/Strings from a .dat file
$.localize = true;


// TODO
// - Support registry flag for Camera Raw files
// - Use Photoshop "open"


// Put header files in a "Stack Scripts Only" folder.  The "...Only" tells
// PS not to place it in the menu.  For that reason, we do -not- localize that
// portion of the folder name.
var g_StackScriptFolderPath = app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/"
										+ localize("$$$/Private/Exposuremerge/StackScriptOnly=Stack Scripts Only/");

$.evalFile(g_StackScriptFolderPath + "LatteUI.jsx");

$.evalFile(g_StackScriptFolderPath + "StackSupport.jsx");

$.evalFile(g_StackScriptFolderPath + "Geometry.jsx");

$.evalFile(g_StackScriptFolderPath + "CreateImageStack.jsx");

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// Must leave at zero, otherwise trapping gFileFromBridge fails on QA's debug builds.
$.level = 0; // (Window.version.search("d") != -1) ? 1 : 0;
// debugger; // launch debugger on next line

const kMergeToHDRAlignmentFlag = app.stringIDToTypeID( "MergeToHDRAlignmentFlag" );
const kMergeToHDRCameraCurve = "MToHDRcrv";
const kMergeToHDRUIResponseCurve = app.charIDToTypeID( 'EmCV' );

/************************************************************/
// mergeToHDR routines

mergeToHDR = new ImageStackCreator( localize("$$$/AdobePlugin/Shared/Exposuremerge/Process/Name=Merge to HDR"),
										  localize('$$$/AdobePlugin/Shared/Exposuremerge/Auto/untitled=Untitled_HDR' ) );

// Set flag for Camera raw asking for linear response files.
mergeToHDR.linearizeCamRawFiles = true;
// Merge to HDR opens a new output file created by the filter plugin.
mergeToHDR.outputClonedFromFirstFile = false;

try {
	var desc = app.getCustomOptions("MergeToHDRFlags001");
	mergeToHDR.useAlignment = desc.getBoolean( kMergeToHDRAlignmentFlag );
}
catch (e)
{
	mergeToHDR.useAlignment = true;	// Enabled by default
}

mergeToHDR.customPluginArguments = function( desc )
{
	// Hack used for windows debug only.
	var p = this.stackElements[0].file.fsName;
	desc.putString( app.charIDToTypeID('EmPt'), p.slice(0,p.lastIndexOf('\\') + 1) ); 
	
	if (this.fCameraCurveDesc)
		desc.putList( kMergeToHDRUIResponseCurve, this.fCameraCurveDesc );
}

// Custom version of alignStack that crops to the area covered by
// all of the images.
mergeToHDR.alignStack = function( stackDoc )
{
	var cropRect = new TRect( -Infinity, -Infinity, Infinity, Infinity );
	
	function nudge( c, rectSide, op )
	{
		// C++ programmers use #define's and "##" for this sort of voodoo
		eval( "cropRect." + rectSide + " = Math." + op + "( cropRect." + rectSide + ", c );" );
	}
		
	selectAllLayers(stackDoc, 2);

	// If the photos are aligned, then trim the photos down
	// to the rectangular area overlapped by all of them.
	var i, j, alignInfo = getActiveDocAlignmentInfo( 'Prsp', false, true );
	if (alignInfo)
	{
		// Collect the alignment info into the stackElements
		var layerList = alignInfo.layerInfo;
		alignGroups = new Array();
		for (i = 0; i < layerList.length; ++i)
		{
			this.stackElements[i].fCorners = layerList[i].corners;
			this.stackElements[i].fBaseFlag = layerList[i].baseFlag;
		}
		
		for (i in this.stackElements)
		{
			if (! this.stackElements[i].fBaseFlag)
				this.stackElements[i].transform();
			var corners = this.stackElements[i].fCorners;
			
			// Take the corners and inset cropRect as needed
			nudge( Math.ceil(  corners[0].fX ), "fLeft",		"max" );
			nudge( Math.ceil(  corners[0].fY ), "fTop",		"max" );
			nudge( Math.floor( corners[1].fX ), "fRight",	"min" );
			nudge( Math.ceil(  corners[1].fY ), "fTop",		"max" );
			nudge( Math.floor( corners[2].fX ), "fRight",	"min" );
			nudge( Math.floor( corners[2].fY ), "fBottom",	"min" );
			nudge( Math.ceil(  corners[3].fX ), "fLeft",		"max" );
			nudge( Math.floor( corners[3].fY ), "fBottom",	"min" );
		}
		
		var cropArgs = [UnitValue( cropRect.fLeft, "px" ), UnitValue( cropRect.fTop, "px" ),UnitValue( cropRect.fRight, "px" ), UnitValue( cropRect.fBottom, "px" )];
		stackDoc.crop( cropArgs );
		
		// Reset the element's height & width
		var newWidth = cropRect.getWidth(), newHeight = cropRect.getHeight();
		for (i in this.stackElements)
		{
			this.stackElements[i].fWidth = newWidth;
			this.stackElements[i].fHeight = newHeight;
			this.stackElements[i].fString = this.stackElements[i].toString();
		}
	}
	
}

mergeToHDR.lightroomOpen = function( filename )
{
	try {
		status = photoshop.openFromLightroom( filename, null, gLightroomDocID, gBridgeTalkID, 
																	gLightroomSaveParams, DialogModes.NO );
		// On normal open status has a typeNULL key, but if it fails, it's
		// empty.  This seems to be our only clue you've whacked the escape key.
		if (status.count == 0)
			throw Error( kUserCanceledError );
	}
	catch (err)
	{
		if (err.number == kErrTempDiskFull) {
			this.scratchDiskFullAlert();
			throw err;
		}
		else if (err.number == kUserCanceledError)
			throw err;
		return null;
	}
	
	return app.activeDocument;
}

mergeToHDR.mergeStackElements = function( showDialog )
{
	// Add the Luminance values to the activeDoc's.
	function addLuminanceMetadata( luminValue )
	{
		// Extendscript's XML library doesn't like to deal with "unbound"
		// namespaces, so just hacking the string is easier for now.
		var i, xmpData = app.activeDocument.xmpMetadata.rawData.toString();
		var insertPos = xmpData.search(/<photoshop:History\/>/);
		if (insertPos > 0)
		{
			var newTag = "<photoshop:HDRLuminance>" + luminValue + "</photoshop:HDRLuminance>\n         "
			xmpData = xmpData.slice(0,insertPos) + newTag + xmpData.slice(insertPos);
			app.activeDocument.xmpMetadata.rawData = xmpData;
		}
	}
		

	var result, i, stackDoc = null;
	
	stackDoc = this.loadStackLayers();

	if (! stackDoc)
		return;
		
	var cameraID = this.stackElements[0].fCameraID;
	
	// Different cameras would be Really Strange, but check for it anyway...
	for (var i = 1; i < this.stackElements.length; ++i)
		if (this.stackElements[i].fCameraID != cameraID)
		{
			alert( this.pluginName + localize("$$$/AdobePlugin/Shared/Exposuremerge/DiffCam= - Images to merge may have been taken with different cameras"), this.pluginName, true );
			break;
		}
		
	var desc = null;
	this.fCameraCurveDesc = null;
	try {
		desc = app.getCustomOptions( kMergeToHDRCameraCurve + cameraID );
		this.fCameraCurveDesc = desc.getList( kMergeToHDRUIResponseCurve );
	}
	catch (e)
	{
	}

	// The MergeToHDR filter plugin must have an RGB document, HDR is always RGB.  
	// If we get grayscale photos, convert them back after the fact.
	var mustRestoreGray = (stackDoc.mode == DocumentMode.GRAYSCALE);

	if (stackDoc.mode != DocumentMode.RGB)
		stackDoc.changeMode( ChangeMode.RGB );

	result = this.invokeFilterPlugin( "AdobeExposureMergeUI", showDialog );
	
	var stackDocResolution = stackDoc.resolution;
	stackDoc.close(SaveOptions.DONOTSAVECHANGES);

	if (result)	// noErr
	{
		var tmpFilePath = result.getString( app.charIDToTypeID('EmTp') );
		var outputDepth = result.getInteger( app.charIDToTypeID('EmOD') );
		var exposure = result.getDouble( app.charIDToTypeID('EmEs') );
		var gamma = result.getDouble( app.charIDToTypeID('EmGm') );
		var whiteLuminance = result.getDouble( app.charIDToTypeID('EmWL') );
		this.fCameraCurveDesc = result.hasKey( kMergeToHDRUIResponseCurve ) ? result.getList( kMergeToHDRUIResponseCurve ) : null;

		// If the camera metadata was corrupted (e.g., by a Camera Raw "correction"),
		// then don't write it back out to the preferences.
		if (! this.exposureMetadataValid)
			this.fCameraCurveDesc = null;
	
		var tmpFile = File( tmpFilePath );

		// If we're invoked from Lightroom, we need to do special voodoo to open the file
		// so it has the proper tags to generate the save notification LR needs.
		if (this.checkForLightroomGlobals())
			app.activeDocument = this.lightroomOpen( tmpFile );
		else
		{
			// If not opened from Lightoom, then open the temp document, and dulicate it into
			// another that doesn't have the temp file association
			var tmpdoc = app.open( tmpFile );
			app.activeDocument = tmpdoc;
			duplicateDocument( this.newDocName() );
			tmpdoc.close(SaveOptions.DONOTSAVECHANGES);
			tmpFile.remove();
			resetFrontmostDocumentFormat();
		}
	
		// Add the HDR luminance metadata
		addLuminanceMetadata( whiteLuminance );

		if (mustRestoreGray)
			app.activeDocument.changeMode( ChangeMode.GRAYSCALE );

		setFrontmostResolution( stackDocResolution );
		if (exposure != 0.0) setFrontmostExposure( exposure, gamma );
		if (outputDepth != 32)
		{
			try {
				convertFromHDR( outputDepth );
			}
			// If the conversion fails (e.g., user cancels) just go ahead and finish up.
			catch (err)
			{}
		}
	
		var flagDesc = new ActionDescriptor();
		flagDesc.putBoolean( kMergeToHDRAlignmentFlag, mergeToHDR.useAlignment );
		app.putCustomOptions( "MergeToHDRFlags001", flagDesc, true );
		
		if (this.fCameraCurveDesc)
		{
			var curveDesc = new ActionDescriptor();
			curveDesc.putList( kMergeToHDRUIResponseCurve, this.fCameraCurveDesc );
			// Note the camera name is used in the customOptions name, not in the 
			// Descriptor, because stringIDToTypeID isn'g guarenteed to be the same
			// across launches.
			app.putCustomOptions( kMergeToHDRCameraCurve + cameraID, curveDesc, true );
		}
	}
}

// "Main" execution of Merge to HDR
mergeToHDR.doInteractiveMerge = function ()
{
	this.getFilesFromBridgeOrDialog( localize("$$$/Private/Exposuremerge/M2HDRexv=M2HDR.exv") );

	if (this.stackElements)
		this.mergeStackElements( true );
}

// Function to call from scripts
mergeToHDR.mergeFilesToHDR = function(filelist, alignFlag)
{
	if (typeof(alignFlag) == 'boolean')
		mergeToHDR.useAlignment = alignFlag;
		
	if (filelist.length < 2)
	{
		alert(localize("$$$/AdobePlugin/Shared/Exposuremerge/Auto/AtLeast2=Merge to HDR needs at least two files selected."), this.pluginName, true );
		return;
	}
	var j;
	this.stackElements = new Array();
	for (j in filelist)
	{
		var f = filelist[j];
		this.stackElements.push( new StackElement( (typeof(f) == 'string') ? File(f) : f ) );
	}
		
	if (this.stackElements.length > 1)
		this.mergeStackElements( false );
}

if (typeof(runMergeToHDRFromScript) == 'undefined')
	mergeToHDR.doInteractiveMerge();

