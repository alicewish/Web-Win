// (c) Copyright 2005.  Adobe Systems, Incorporated.  All rights reserved.

//
// MergeToHDR automation in JavaScript
//

/*
@@@BUILDINFO@@@ Merge to HDR.jsx 2.0.0.1
*/

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/Merge2HDR/Menu=Merge to HDR Pro...</name>
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
										+ localize("$$$/private/Exposuremerge/StackScriptOnly=Stack Scripts Only/");

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
const kMergeToHDRUIResponseCurve	= app.charIDToTypeID( 'EmCV' );
const kMergeToHDRDeghostParam	= app.charIDToTypeID( 'EmDg' );
const kMergeToHDROutputBitDepth	= app.charIDToTypeID('EmOD');

// These must match defs in PResponseCurves.h
const kMergeToHDRDeghostOff = -1;
const kMergeToHDRDeghostBest = -2;

/************************************************************/
// mergeToHDR routines

mergeToHDR = new ImageStackCreator( localize("$$$/AdobePlugin/Shared/Exposuremerge/Process/Name=Merge to HDR Pro"),
										  localize('$$$/AdobePlugin/Shared/Exposuremerge/Auto/untitled=Untitled_HDR' ) );

// Set flag for Camera raw asking for linear response files.
mergeToHDR.linearizeCamRawFiles = true;

// Merge to HDR opens a new output file created by the filter plugin.
mergeToHDR.outputClonedFromFirstFile = false;

// Set to the deghosting base image index, or to kMergeToHDRDeghostOff or kMergeToHDRDeghostBest
mergeToHDR.deghostSetting = null;

// If this is uncommented, you'll be given the option of
// "Open layered document" in the source pop-up menu if you have a layered document.
// The layers on that document are processed as opposed to opening separate files.
//mergeToHDR.allowLayeredDocument = true;

// "Sticky" options are handled here.
mergeToHDR.useAlignment	= getPSCustomOption( "MergeToHDRFlags001", "Boolean", kMergeToHDRAlignmentFlag, true );
mergeToHDR.outputBitDepth  = getPSCustomOption( "MergeToHDRFlags001", "Integer", kMergeToHDROutputBitDepth, 16 );

mergeToHDR.customPluginArguments = function( desc )
{
	// Hack used for windows debug only.
	var p;
	if (this.useLayeredDocument)
		p = app.activeDocument.name;
	else
		p = this.stackElements[0].file.fsName;

	desc.putString( app.charIDToTypeID('EmPt'), p.slice(0,p.lastIndexOf('\\') + 1) ); 
	
	if (this.deghostSetting != null)
		desc.putInteger( kMergeToHDRDeghostParam, this.deghostSetting );
	
	if (this.fCameraCurveDesc)
		desc.putList( kMergeToHDRUIResponseCurve, this.fCameraCurveDesc );
		
	desc.putInteger( kMergeToHDROutputBitDepth, this.outputBitDepth );
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
	
	selectAllLayers(stackDoc, 2 );

	// If the photos are aligned, then trim the photos down
	// to the rectangular area overlapped by all of them.
	var i, j, alignInfo = getActiveDocAlignmentInfo( 'Prsp', false, [khighQualityStr] );
	if (alignInfo)
	{
		// Collect the alignment info into the stackElements
		var layerList = alignInfo.layerInfo;
		var baseCorners;
		alignGroups = new Array();
		for (i = 0; i < layerList.length; ++i)
		{
			this.stackElements[i].fCorners = layerList[i].corners;
			this.stackElements[i].fBaseFlag = layerList[i].baseFlag;
			if (layerList[i].baseFlag)
				baseCorners = layerList[i].corners;
		}
	
		// Sanity check on the alignment.  Seriously under/over exposed images
		// may get trashed in alignment, and we should weed those out.  Anything
		// with displacement over 30% of the image is obviously crazy...
		var maxDelta = (baseCorners[2] - baseCorners[0]).vectorLength() * 0.33;
		var alignErrorMessageShown = false;
		i = 0;
		while (i < this.stackElements.length)
		{
			if (! this.stackElements[i].fBaseFlag)
			{
				var badAlign = false;
				for (j = 0; (j < 4) && ! badAlign; ++j)
				{
					if ((this.stackElements[i].fCorners[j] - baseCorners[j]).vectorLength() > maxDelta)
						badAlign = true;
				}
				if (badAlign)
				{
					selectOneLayer( app.activeDocument, this.stackElements[i].fName );
					app.activeDocument.layers[this.stackElements[i].fName].remove();
					this.stackElements.splice(i,1);
					if (! alignErrorMessageShown)
					{
						// This is a pretty vague error message, but it's too late in the game to
						// get a proper one translated, so this was stolen from Photomerge.
						alert(localize("$$$/AdobePlugin/Shared/Photomerge/Error/BadPersp1=The perspective distortion for some images is too severe to render."));
						alignErrorMessageShown = true;
					}
					i--;
				}
			}
			++i;
		}
		if (this.stackElements.length < 2)
			throw Error( kUserCanceledError );	// "Proabably" won't happen...
		
		// Trim the aligned images to the size of their overlapping area
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
		var xmpData = app.activeDocument.xmpMetadata.rawData.toString();
		var insertPos = xmpData.search(/<photoshop:History\/>/);
		if (insertPos > 0)
		{
			var newTag = "<photoshop:HDRLuminance>" + luminValue + "</photoshop:HDRLuminance>\n         "
			xmpData = xmpData.slice(0,insertPos) + newTag + xmpData.slice(insertPos);
			app.activeDocument.xmpMetadata.rawData = xmpData;
		}
	}
	
	// Pull out the exposure time, since it presumably
	// changed while taking the HDR set.
	function removeExposureMetadata()
	{
		var xmpData = app.activeDocument.xmpMetadata.rawData.toString();
		xmpData = xmpData.replace (/<exif:ShutterSpeedValue>[\d\/]+<\/exif:ShutterSpeedValue>/, "")
		xmpData = xmpData.replace (/<exif:ExposureTime>[\d\/]+<\/exif:ExposureTime>/, "")
		app.activeDocument.xmpMetadata.rawData = xmpData;
	}

	var result, i, stackDoc = null;
	
	if (this.useLayeredDocument)
		stackDoc = app.activeDocument;
	else
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
	var saveXMPData = stackDoc.xmpMetadata.rawData;
	
	if (this.useLayeredDocument)
	{
		// Nuke the "destination" layer that got created (M2HDR holdover)
		stackDoc.layers[this.pluginName].remove();
	}
	else
		stackDoc.close(SaveOptions.DONOTSAVECHANGES);

	if (result)	// noErr
	{
		var tmpFilePath = result.getString( app.charIDToTypeID('EmTp') );
		this.outputBitDepth = result.getInteger( kMergeToHDROutputBitDepth );
		var exposure = result.getDouble( app.charIDToTypeID('EmEs') );
		// This gamma is computed by Ward's code based on the camera response,
		// but applying it leaves a somewhat counter-intiutive result (two bugs
		// filed so far). Leaving it out for now.  -jp 13-jun-08
		//var gamma = result.getDouble( app.charIDToTypeID('EmGm') );
		var gamma = 1.0;
		var whiteLuminance = result.getDouble( app.charIDToTypeID('EmWL') );
		this.fCameraCurveDesc = result.hasKey( kMergeToHDRUIResponseCurve ) ? result.getList( kMergeToHDRUIResponseCurve ) : null;

		// If the camera metadata was corrupted (e.g., by a Camera Raw "correction"),
		// then don't write it back out to the preferences.
		if (! this.exposureMetadataValid)
			this.fCameraCurveDesc = null;
	
		var tmpFile = File( tmpFilePath );

		var stackElem = new StackElement( tmpFile );
		var tmpdoc = stackElem.silentOpen( false, false );
		app.activeDocument = tmpdoc;
		
		duplicateDocument( this.newDocName() );
		var newHDRDoc = app.activeDocument;
		if ((this.saveColorProfileType == ColorProfile.CUSTOM)
			&& (this.saveColorProfileName))
		{
			// Before we assign the color profile name, we need to make
			// sure it's one PS already knows about, otherwise a dialog pops up.
			var availableCustomProfiles = getColorProfileList('rStd'); // ACE_Selector_RGB_Standard
			availableCustomProfiles 								// ACE_Selector_RGB_OtherInputCapable
				= availableCustomProfiles.concat( getColorProfileList('rInp') );
			if (availableCustomProfiles.join('|').indexOf( this.saveColorProfileName ) != -1)
				// This assignment takes care of setting the colorProfileType to "CUSTOM"
				newHDRDoc.colorProfileName = this.saveColorProfileName;
			else
				newHDRDoc.colorProfileType = ColorProfile.WORKING;	// Punt - no way to assign random input name
		}
		else
		{
			// This assignment takes care of assigning the name (or lack thereof for ".NONE")
			if (this.saveColorProfileType != ColorProfile.CUSTOM)
				newHDRDoc.colorProfileType = this.saveColorProfileType;
		}
		tmpdoc.close(SaveOptions.DONOTSAVECHANGES);
		tmpFile.remove();
		// In a world of Owls and Tabs, closing "tmpdoc" can reset the activeDoc
		// to another random file that happened to be open.  This ensures we're
		// talking to the right one.  PR 1731208
		app.activeDocument = newHDRDoc;

		// If we're invoked from Lightroom, we need add special voodoo to the file
		// so it has the proper tags to generate the save notification LR needs.
		if (this.checkForLightroomGlobals())
			setLightroomFileParams( gLightroomDocID, gBridgeTalkID, gLightroomSaveParams )
		
		resetFrontmostDocumentFormat();

		// Restore the metadata from the original photos,
		// but pull out the exposure time.
		app.activeDocument.xmpMetadata.rawData = saveXMPData;
		removeExposureMetadata();
		
		// Add the HDR luminance metadata
		addLuminanceMetadata( whiteLuminance );

		if (mustRestoreGray)
			app.activeDocument.changeMode( ChangeMode.GRAYSCALE );

		setFrontmostResolution( stackDocResolution );
		if (exposure != 0.0) setFrontmostExposure( exposure, gamma );
		if (this.outputBitDepth != 32)
		{
			try {
//				convertFromHDR( this.outputBitDepth );
                   convertFromHDRNoDialog( this.outputBitDepth, result );
			}
			// If the conversion fails (e.g., user cancels) just go ahead and finish up.
			catch (err)
			{}
		}
	
		var flagDesc = new ActionDescriptor();
		flagDesc.putBoolean( kMergeToHDRAlignmentFlag, mergeToHDR.useAlignment );
		flagDesc.putInteger( kMergeToHDROutputBitDepth, mergeToHDR.outputBitDepth );
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
     // Check to make sure the required plugins are available.
    function CheckPluginOK( key, message )
    {
        var plugFile;
        if (Folder.fs == "Windows")
        {
            plugFile= new File( app.path + "/Required/Plug-Ins/" + key );
        }
        else
        {
            key = key.replace(/[.].*$/, ".plugin");     // All mac plugins use the same suffix
            plugFile = new Folder( Folder.appPackage + "/Contents/Required/Plug-Ins/" + key );
        }
        if (! plugFile.exists)
        {
            alert(message);
            return false;
         }
        return true;
    }

    if (! (CheckPluginOK( "File Formats/PBM.8BI", localize("$$$/AdobePlugin/Shared/Exposuremerge/Auto/MissingPBM=Merge to HDR: The Portable Bit Map (PBM) Plug-in is missing."))
        && CheckPluginOK( "Automate/HDRMergeUI.8BF", localize("$$$/AdobePlugin/Shared/Exposuremerge/Auto/MissingHDRPlug=Merge to HDR: The Merge to HDR Pro (HDRMergeUI) Plug-in is missing."))))
        return;

	this.getFilesFromBridgeOrDialog( localize("$$$/private/Exposuremerge/M2HDRexv=M2HDR.exv") );

	if (this.stackElements)
		this.mergeStackElements( true );
}

// Function to call from scripts
mergeToHDR.mergeFilesToHDR = function(filelist, alignFlag, deghostFlag)
{
	if (typeof(alignFlag) == 'boolean')
		mergeToHDR.useAlignment = alignFlag;
		
	if (typeof(deghostFlag) == 'number')
		mergeToHDR.deghostSetting = deghostFlag;
		
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

if ((typeof(runMergeToHDRFromScript) == 'undefined') ||
	(runMergeToHDRFromScript == false))
	mergeToHDR.doInteractiveMerge();
