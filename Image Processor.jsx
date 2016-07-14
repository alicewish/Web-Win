﻿// c2009 Adobe Systems, Inc. All rights reserved.
// Produced and Directed by Dr. Brown ( a.k.a Russell Preston Brown )
// Written by Tom Ruark
// UI Design by Julie Meridian

/*
@@@BUILDINFO@@@ Image Processor.jsx 1.1.0.3
*/

/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/ImageProcessor/Menu=Image Processor...</name>
<category>aaaThisPutsMeAtTheTopOfTheMenu</category>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

*/

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
// $.level = 1;
// debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

// the main routine
// the ImageProcessor object does most of the work
try { 

	GlobalVariables();

	CheckVersion();
	
	if ( IsWindowsOS() ) {
		gShortFileNameLength = gShortFileNameLengthWin;
	}

	var gIP = new ImageProcessor();

	gIP.LoadParamsFromDisk( GetDefaultParamsFile() );

	gIP.CreateDialog();
	
	if ( gRunButtonID == gIP.RunDialog() ) {

		gIP.SaveParamsToDisk( GetDefaultParamsFile() );

        gIP.Execute();
		
	} else {
       	gScriptResult = 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	}
	
	gIP.ReportErrors();
	
	$.gc(); // fix crash on quit
}

// Lot's of things can go wrong
// Give a generic alert and see if they want the details
catch( e ) {
	if ( e.number != 8007 ) { // don't report error on user cancel
		if ( confirm( strSorry ) ) {
			alert( e + " : " + e.line );
		}
	}
   	gScriptResult = 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
}

// restore the dialog modes
app.displayDialogs = gSaveDialogMode;

// must be the last thing
gScriptResult; 

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////
// Function: GlobalVariables
// Usage: all of my globals
// Input: <none>
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function GlobalVariables() {

	// a version for possible expansion issues
	gVersion = 1;
	
	gScriptResult = undefined;

	// ok and cancel button
	gRunButtonID = 1;
	gCancelButtonID = 2;
	gMaxResizeTIFF = 300000;
	gMaxResize = 30000;

	// A list of file extensions and types PS can read
	gFileExtensionsToRead = app.windowsFileTypes;
	gFileTypesToRead = app.macintoshFileTypes;

	// A list of camera raw extensions, keep them upper case
	gFilesForCameraRaw = Array( "TIF", "CRW", "NEF", "RAF", "ORF", "MRW", "DCR", "MOS", "SRF", "PEF", "DCR", "CR2", "DNG", "ERF", "X3F", "RAW" );

	// limit the length of text in edit boxes by this length
	// this needs to be calculated on the fly!
	// the problem is we have non mono space fonts! 
	// 10 iiiiiiiiii != 10 MMMMMMMMMM 
	gShortFileNameLengthWin = 35;
	gShortFileNameLengthMac = 27;
	gShortFileNameLength = gShortFileNameLengthMac;

	// remember the dialog modes
	gSaveDialogMode = app.displayDialogs;
	app.displayDialogs = DialogModes.NO;

	gClassActionSet = charIDToTypeID( 'ASet' );
	gClassAction = charIDToTypeID( 'Actn' );
	gKeyName = charIDToTypeID( 'Nm  ' );
	gKeyNumberOfChildren = charIDToTypeID( 'NmbC' );
	
	gOpenedFirstCR = false;
	gFoundFileToProcess = false;

	// all the strings that need localized
	strTitle = localize( "$$$/JavaScript/ImageProcessor/Title=Image Processor" );
	strLabelSource = localize( "$$$/JavaScripts/ImageProcessor/Source=Select the images to process" );
	strNoImagesSelected = localize( "$$$/JavaScripts/ImageProcessor/NoImagesSelected=No images have been selected" );
	strNoFolderSelected = localize( "$$$/JavaScripts/ImageProcessor/NoFolderSelected=No folder has been selected" );
	strLabelSourceHelp = localize( "$$$/JavaScripts/ImageProcessor/SourceHelp=Location of files to process" );
	strLabelDestination = localize( "$$$/JavaScripts/ImageProcessor/Destination=Select location to save processed images" );
	strSaveInSameLocation = localize( "$$$/JavaScripts/ImageProcessor/SaveInSameLocation=S&ave in Same Location" );
	strSaveInSameLocationHelp = localize( "$$$/JavaScripts/ImageProcessor/SaveInSameLocationHelp=Save the new documents next to the original documents" );
	strUseOpen = localize( "$$$/JavaScripts/ImageProcessor/UseOpen=Use Open &Images" );
	strUseOpenHelp = localize( "$$$/JavaScripts/ImageProcessor/UseOpenHelp=Use the images that are currently open" );
	strButtonBrowse1 = localize( "$$$/JavaScripts/ImageProcessor/Browse1=Select &Folder..." );
	strButtonBrowse2 = localize( "$$$/JavaScripts/ImageProcessor/Browse2=Sele&ct Folder..." );
	strButtonRun = localize( "$$$/JavaScripts/ImageProcessor/Run=Run" );
	strOpenFirst = localize( "$$$/JavaScripts/ImageProcessor/OpenFirst=&Open first image to apply settings" );
	strOpenFirstHelp = localize( "$$$/JavaScripts/ImageProcessor/OpenFirstHelp=Show the Camera RAW dialog on the first image to apply settings" );
	strBridge = localize( "$$$/JavaScripts/ImageProcessor/Bridge=Process files from Bridge only" );
	strBridgeHelp = localize( "$$$/JavaScripts/ImageProcessor/BridgeHelp=Selected files from Bridge will be processed" );
	strButtonCancel = localize("$$$/JavaScripts/ImageProcessor/Cancel=Cancel");
	strButtonLoad = localize("$$$/JavaScripts/ImageProcessor/Load=&Load...");
	strButtonLoadHelp = localize("$$$/JavaScripts/ImageProcessor/LoadHelp=Load a settings file from disk");
	strButtonSave = localize("$$$/JavaScripts/ImageProcessor/Save=&Save...");
	strButtonSaveHelp = localize("$$$/JavaScripts/ImageProcessor/SaveHelp=Save the current dialog settings to disk");
	strICC = localize( "$$$/JavaScripts/ImageProcessor/ICC=Inclu&de ICC Profile" );
	strICCHelp = localize( "$$$/JavaScripts/ImageProcessor/ICCHelp=Include the ICC Profile when saving the file" );
	strFileType = localize( "$$$/JavaScripts/ImageProcessor/FileType=File Type" );
	strPreferences = localize( "$$$/JavaScripts/ImageProcessor/Preferences=Preferences" );
	strRunAction = localize( "$$$/JavaScripts/ImageProcessor/RunAction=R&un Action:" );
	strActionHelp = localize( "$$$/JavaScript/ImageProcessor/ActionHelp=Select an action set and an action" );
	strSaveAsJPEG = localize( "$$$/JavaScripts/ImageProcessor/SaveAsJPEG=Save as &JPEG" );
	strSaveAsJPEGHelp = localize( "$$$/JavaScripts/ImageProcessor/SaveAsJPEGHelp=Save a file to the JPEG format" );
	strQuality = localize( "$$$/JavaScripts/ImageProcessor/Quality=Quality:" );
	strConvertICC = localize( "$$$/JavaScripts/ImageProcessor/Convert=Con&vert Profile to sRGB" );
	strConvertICCHelp = localize( "$$$/JavaScripts/ImageProcessor/ConvertHelp=Convert the ICC profile to sRGB before saving" );
	strResizeToFit1 = localize( "$$$/JavaScripts/ImageProcessor/ResizeToFit1=&Resize to Fit" );
	strResizeToFit2 = localize( "$$$/JavaScripts/ImageProcessor/ResizeToFit2=R&esize to Fit" );
	strResizeToFit3 = localize( "$$$/JavaScripts/ImageProcessor/ResizeToFit3=Resi&ze to Fit" );
	strResizeToFitHelp = localize( "$$$/JavaScripts/ImageProcessor/ResizeToFitHelp=Select to resize for this format" );
	strSaveAsPSD = localize( "$$$/JavaScripts/ImageProcessor/SaveAsPSD=Save as &PSD" );
	strSaveAsPSDHelp = localize( "$$$/JavaScripts/ImageProcessor/SaveAsPSDHelp=Save a file to the PSD format" );
	strMaximize = localize( "$$$/JavaScripts/ImageProcessor/Maximize=&Maximize Compatibility" );
	strMaximizeHelp = localize( "$$$/JavaScripts/ImageProcessor/MaximizeHelp=Maximize compatibility when saving to PSD format" );
	strSaveAsTIFF = localize( "$$$/JavaScripts/ImageProcessor/SaveAsTIFF=Save as &TIFF" );
	strSaveAsTIFFHelp = localize( "$$$/JavaScripts/ImageProcessor/SaveAsTIFFHelp=Save a file to the TIFF format" );
	strLZW = localize( "$$$/JavaScripts/ImageProcessor/LZW=LZ&W Compression" );
	strLZWHelp = localize( "$$$/JavaScripts/ImageProcessor/LZWHelp=Use LZW compression when saving in TIFF format" );
	strCopyright = localize( "$$$/JavaScripts/ImageProcessor/Copyright=Copyright Info:" );
	strCopyrightHelp = localize( "$$$/JavaScripts/ImageProcessor/CopyrightHelp=Add copyright metadata to your images" );
	strW = localize( "$$$/JavaScripts/ImageProcessor/W=W:" );
	strWHelp = localize( "$$$/JavaScripts/ImageProcessor/WHelp=Type in a width to resize image" );
	strH = localize( "$$$/JavaScripts/ImageProcessor/H=H:" );
	strHHelp = localize( "$$$/JavaScripts/ImageProcessor/HHelp=Type in a height to resize image" );
	strPX = localize( "$$$/JavaScripts/ImageProcessor/PX=px" );
	strPickXML = localize( "$$$/JavaScripts/ImageProcessor/PickXML=Pick an XML file to load" );
	strPickXMLWin = localize( "$$$/JavaScripts/ImageProcessor/PickXMLWin=XML Files: *.xml" );
	strPickXMLSave = localize( "$$$/JavaScripts/ImageProcessor/PickXMLSave=Pick an XML file to save" );
	strPickSource = localize( "$$$/JavaScripts/ImageProcessor/PickSource=Pick a source folder" );
	strPickDest = localize( "$$$/JavaScripts/ImageProcessor/PickDest=Pick a destination folder" );
	strSpecifySource = localize( "$$$/JavaScripts/ImageProcessor/SpecifySource=Please specify a source folder." );
	strSpecifyDest = localize( "$$$/JavaScripts/ImageProcessor/SpecifyDest=Please specify a destination folder." );
	strJPEGQuality = localize( "$$$/JavaScripts/ImageProcessor/JPEGQuality=JPEG Quality must be between 0 and 12." );
	strJPEGWandH = localize( "$$$/JavaScripts/ImageProcessor/JPEGWandH=You must specify width and height when using resize image options for JPEG." );
	strTIFFWandH = localize( "$$$/JavaScripts/ImageProcessor/TIFFWandH=You must specify width and height when using resize image options for TIFF." );
	strPSDWandH = localize( "$$$/JavaScripts/ImageProcessor/PSDWandH=You must specify width and height when using resize image options for PSD." );
	strOneType = localize( "$$$/JavaScripts/ImageProcessor/OneType=You must save to at least one file type." );
	strWidthAndHeight = localize( "$$$/JavaScripts/ImageProcessor/WidthAndHeight=Width and Height must be defined to use FitImage function!" );
	strMustUse = localize( "$$$/JavaScripts/ImageProcessor/MustUse=You must use Photoshop CS 2 or later to run this script!" );
	strSorry = localize( "$$$/JavaScripts/ImageProcessor/Sorry=Sorry, something major happened and I can't continue! Would you like to see more info?" );
	strCouldNotProcess = localize( "$$$/JavaScripts/ImageProcessor/CouldNotProcess=Sorry, I could not process the following files:^r" );
	strMustSaveOpen = localize( "$$$/JavaScripts/ImageProcessor/MustSaveOpen=Open files must be saved before they can be used by the Image Processor." );
	strFollowing = localize( "$$$/JavaScripts/ImageProcessor/Following=The following files will not be saved." );
	strNoOpenableFiles = localize( "$$$/JavaScripts/ImageProcessor/NoOpenableFiles=There were no source files that could be opened by Photoshop." );
	strCannotWriteToFolder = localize( "$$$/JavaScripts/ImageProcessor/CannotWriteToFolder=I am unable to create a file in this folder. Please check your access rights to this location " );
	strKeepStructure = localize( "$$$/JavaScripts/ImageProcessor/KeepStructure=Keep folder structure" );
	strIncludeAllSubfolders = localize( "$$$/JavaScripts/ImageProcessor/IncludeAll=Include All sub-folders" );
	strIncludeAllSubfoldersHelp =  localize( "$$$/JavaScripts/ImageProcessor/IncludeAllHelp=Process all the folders within the source folder" );
	strFileAlreadyExists =  localize( "$$$/JavaScripts/ImageProcessor/FileAlreadyExists=The file already exists. Do you want to replace?" );
	
	// some strings that need localized to define the preferred sizes of items for different languages
	// strwAndhEtLength = localize( "$$$/locale_specific/JavaScripts/ImageProcessor/EditTextWandHLength=40" );
	// strqEtLength = localize( "$$$/locale_specific/JavaScripts/ImageProcessor/QEditTextLength=30" );
	strsourceAndDestLength = localize( "$$$/locale_specific/JavaScripts/ImageProcessor/SourceAndDestLength=210" );
	stractionDropDownLength = localize( "$$$/locale_specific/JavaScripts/ImageProcessor/ActionDropDownLength=140" );

}

// given a file name and a list of extensions
// determine if this file is in the list of extensions
function IsFileOneOfThese( inFileName, inArrayOfFileExtensions ) {
	var lastDot = inFileName.toString().lastIndexOf( "." );
	if ( lastDot == -1 ) {
		return false;
	}
	var strLength = inFileName.toString().length;
	var extension = inFileName.toString().substr( lastDot + 1, strLength - lastDot );
	extension = extension.toUpperCase();
	for (var i = 0; i < inArrayOfFileExtensions.length; i++ ) {
		if ( extension == inArrayOfFileExtensions[i] ) {
			return true;
		}
	}
	return false;
}

// given a file name and a list of types
// determine if this file is one of the provided types. Always returns false on platforms other than Mac.
function IsFileOneOfTheseTypes( inFileName, inArrayOfFileTypes ) {
	if ( ! IsMacintoshOS() ) {
		return false;
		}
	var file = new File (inFileName);
	for (var i = 0; i < inArrayOfFileTypes.length; i++ ) {
		if ( file.type == inArrayOfFileTypes[i] ) {
			return true;
		}
	}
	return false;
}

// see if i can write to this folder by making a temp file then deleting it
// what I really need is a "readonly" on the Folder object but that only exists
// on the File object
function IsFolderWritable( inFolder ) {
	var isWritable = false;
	var f = File( inFolder + "deleteme.txt" );
	if ( f.open( "w", "TEXT", "????" ) ) {
		if ( f.write( "delete me" ) ) {
			if ( f.close() ) {
				if ( f.remove() ) {
					isWritable = true;
				}
			}
		}
	}
	return isWritable;
}

// the main class
function ImageProcessor() {

	// load my params from the xml file on disk if it exists
	// this.params["myoptionname"] = myoptionvalue
	// I wrote a very simple xml parser, I'm sure it needs work
	this.LoadParamsFromDisk = function( loadFile ) {
		if ( loadFile.exists ) {
			loadFile.open( "r" );
			var projectSpace = ReadHeader( loadFile );
			if ( projectSpace == GetScriptNameForXML() ) {
				while ( ! loadFile.eof ) {
					var starter = ReadHeader( loadFile );
					var data = ReadData( loadFile );
					var ender = ReadHeader( loadFile );
					if ( ( "/" + starter ) == ender ) {
						this.params[starter] = data;
					}
					// force boolean values to boolean types
					if ( data == "true" || data == "false" ) {
						this.params[starter] = data == "true";
					}
				}
			}
			loadFile.close();
			if ( this.params["version"] != gVersion ) {
				// do something here to fix version conflicts
				// this should do it
				this.params["version"] = gVersion;
			}
		} 
	}

	// save out my params, this is much easier
	this.SaveParamsToDisk = function( saveFile ) {
		saveFile.encoding = "UTF8";
		saveFile.open( "w", "TEXT", "????" );
		// unicode signature, this is UTF16 but will convert to UTF8 "EF BB BF"
		saveFile.write("\uFEFF"); 
		var scriptNameForXML = GetScriptNameForXML();
		saveFile.writeln( "<" + scriptNameForXML + ">" );
		for ( var p in this.params ) {
			saveFile.writeln( "\t<" + p + ">" + this.params[p] + "</" + p + ">" );
		}
		saveFile.writeln( "</" + scriptNameForXML + ">" );
		saveFile.close();
	}

	this.CreateDialog = function() {
	
		// create the main dialog window, this holds all our data
		this.dlgMain = new Window( 'dialog', strTitle );
		
		// create a shortcut for easier typing
		var d = this.dlgMain;
		
        // match our dialog background(s) and foreground(s) with color of the host application
		var brush = d.graphics.newBrush(d.graphics.BrushType.THEME_COLOR, "appDialogBackground");
        d.graphics.backgroundColor = brush;
        d.graphics.disabledBackgroundColor = brush;
		d.graphics.foregroundColor = d.graphics.newPen(d.graphics.PenType.SOLID_COLOR, [1-brush.color[0], 1-brush.color[1], 1-brush.color[2]], brush.color[3]);
		d.graphics.disabledForegroundColor = d.graphics.newPen(d.graphics.PenType.SOLID_COLOR, [brush.color[0]/1.5, brush.color[1]/1.5, brush.color[2]/1.5], brush.color[3]);
		
		d.orientation = 'row';
		d.alignChildren = 'fill';
		
		// to keep everything as compatible as possible with Dr. Brown's Image Processor
		// I will keep most of the important dialog items at the same level
		// and use auto layout

		// some interesting numbers to help the auto layout, real numbers are in the zstrings
		// var wAndhEtLength = StrToIntWithDefault( strwAndhEtLength, 40 );
		// var qEtLength = StrToIntWithDefault( strqEtLength, 30 );
		var sourceAndDestLength = StrToIntWithDefault( strsourceAndDestLength, 210 );
		var actionDropDownLength = StrToIntWithDefault( stractionDropDownLength, 140 );
		
		var squeezePlay = 5;
		
		d.marginLeft = 15;

		// I use some hidden items to help auto layout
		// change this to see them
		var showHidden = false;
		
		d.grpLeft = d.add( 'group' );
		
		// create a shortcut for easier typing
		var l = d.grpLeft;
		
		l.orientation = 'column';
		l.alignChildren = 'fill';
		l.spacing = 3;
		
		// section 1

		l.grp1 = l.add( 'group' );
		l.grp1.orientation = 'row';
		l.grp1.alignChildren = 'center';

		d.icnOne = l.grp1.add( 'image', undefined, 'Step1Icon' );
		d.icnOne.helpTip = strLabelSource;

		d.stSourceLabel = l.grp1.add( 'statictext', undefined, strLabelSource );
		d.stSourceLabel.helpTip = strLabelSource;

		l.grp1Info = l.add( 'group' );
		l.grp1Info.orientation = 'row';
		l.grp1Info.alignChildren = 'fill';
		l.grp1Info.margins = [d.marginLeft, 0, 0, 0];

		l.grp1Info.grpLeft = l.grp1Info.add( 'group' );
		l.grp1Info.grpLeft.orientation = 'row';
		l.grp1Info.grpLeft.alignChildren = 'fill';

		d.icnSource = l.grp1Info.grpLeft.add( 'image', undefined, 'SourceFolderIcon' );
		d.icnSource.helpTip = strLabelSource;

		l.grp1Info.grpRight = l.grp1Info.add( 'group' );
		l.grp1Info.grpRight.orientation = 'column';
		l.grp1Info.grpRight.alignChildren = 'left';
		l.grp1Info.grpRight.spacing = squeezePlay;

		if ( this.runningFromBridge ) {
			d.stBridge = l.grp1Info.grpRight.add( 'statictext', undefined, strBridge + " (" + this.filesFromBridge.length + ")" );
			d.stBridge.helpTip = strBridgeHelp;
		} else {
			
			l.grpOpenOptions = l.grp1Info.grpRight.add( 'group' );
			l.grpOpenOptions.orientation = 'row';
			l.grpOpenOptions.alignChildren = 'center';

			d.rbUseOpen = l.grpOpenOptions.add( 'radiobutton', undefined, strUseOpen );
			d.rbUseOpen.helpTip = strUseOpenHelp;
			
			d.cbIncludeSubFolders = l.grpOpenOptions.add( 'checkbox', undefined, strIncludeAllSubfolders );
	        d.cbIncludeSubFolders.helpTip = strIncludeAllSubfoldersHelp;

			l.grpSelect = l.grp1Info.grpRight.add( 'group' );
			l.grpSelect.orientation = 'row';
			l.grpSelect.alignChildren = 'center';

			d.rbUseFolder = l.grpSelect.add( 'radiobutton', undefined, '' );
			d.rbUseFolder.helpTip = strUseOpenHelp;
			
			d.btnSource = l.grpSelect.add( 'button', undefined, strButtonBrowse1 );
			d.btnSource.helpTip = strLabelSource;
			
			d.stSource = l.grpSelect.add( 'statictext', undefined, strNoImagesSelected, { truncate:'middle' } );
			d.stSource.helpTip = strLabelSourceHelp;
			d.stSource.preferredSize.width = sourceAndDestLength;
		}

		d.cbOpenFirst = l.grp1Info.grpRight.add( 'checkbox', undefined, strOpenFirst );
		d.cbOpenFirst.helpTip = strOpenFirstHelp;

		d.line1 = l.add( 'panel', undefined, undefined, {borderStyle: 'sunken'} );
		
		// section 2

		l.grp2 = l.add( 'group' );
		l.grp2.orientation = 'row';
		l.grp2.alignChildren = 'center';

		d.icnTwo = l.grp2.add( 'image', undefined, 'Step2Icon' );
		d.icnTwo.helpTip = strLabelDestination;

		d.stDestination = l.grp2.add( 'statictext', undefined, strLabelDestination );
		d.stDestination.helpTip = strLabelDestination;

		l.grp2Info = l.add( 'group' );
		l.grp2Info.orientation = 'row';
		l.grp2Info.alignChildren = 'fill';
		l.grp2Info.margins = [d.marginLeft, 0, 0, 0];

		l.grp2Info.grpLeft = l.grp2Info.add( 'group' );
		l.grp2Info.grpLeft.orientation = 'row';
		l.grp2Info.grpLeft.alignChildren = 'left';

		d.icnDest = l.grp2Info.grpLeft.add( 'image', undefined, 'DestinationFolderIcon' );
		d.icnDest.helpTip = strLabelDestination;

		l.grp2Info.grpRight = l.grp2Info.add( 'group' );
		l.grp2Info.grpRight.orientation = 'column';
		l.grp2Info.grpRight.alignChildren = 'left';
		l.grp2Info.grpRight.spacing = squeezePlay;

		l.grpSaveOptions = l.grp2Info.grpRight.add( 'group' );
		l.grpSaveOptions.orientation = 'row';
		l.grpSaveOptions.alignChildren = 'center';

		d.rbSaveInSame = l.grpSaveOptions.add( 'radiobutton', undefined, strSaveInSameLocation );
		d.rbSaveInSame.helpTip = strSaveInSameLocationHelp;

		if ( ! this.runningFromBridge ) {
			
			d.cbKeepStructure = l.grpSaveOptions.add( 'checkbox', undefined, strKeepStructure );
			d.cbKeepStructure.helpTip = strKeepStructure;
		}
	
		l.grpDestBrowse = l.grp2Info.grpRight.add( 'group' );
		l.grpDestBrowse.orientation = 'row';
		l.grpDestBrowse.alignChildren = 'center';

		d.rbSaveInNew = l.grpDestBrowse.add( 'radiobutton', undefined, '' );
		d.rbSaveInNew.helpTip = strLabelDestination;

		d.btnDest = l.grpDestBrowse.add( 'button', undefined, strButtonBrowse2 );
		d.btnDest.helpTip = strLabelDestination;
		
		d.stDest = l.grpDestBrowse.add( 'statictext', undefined, strNoFolderSelected, { truncate:'middle' } );
		d.stDest.helpTip = strLabelDestination;
		d.stDest.preferredSize.width = sourceAndDestLength;

		d.line2 = l.add( 'panel', undefined, undefined, {borderStyle: 'sunken'} );
		
		// section 3
		
		l.grp3 = l.add( 'group' );
		l.grp3.orientation = 'row';
		l.grp3.alignChildren = 'center';

		d.icnThree = l.grp3.add( 'image', undefined, 'Step3Icon' );
		d.icnThree.helpTip = strFileType;

		d.stFileType = l.grp3.add( 'statictext', undefined, strFileType );
		d.stFileType.helpTip = strFileType;

		l.grp3Info = l.add( 'group' );
		l.grp3Info.orientation = 'row';
		l.grp3Info.alignChildren = 'fill';
		l.grp3Info.margins = [d.marginLeft, 0, 0, 0];

		l.grp3Info.grpLeft = l.grp3Info.add( 'group' );
		l.grp3Info.grpLeft.orientation = 'column';
		l.grp3Info.grpLeft.alignChildren = 'left';
		l.grp3Info.grpLeft.spacing = squeezePlay;

		d.icnSpace = l.grp3Info.grpLeft.add( 'image', undefined, 'DestinationFolderIcon' );
		d.icnSpace.helpTip = strLabelDestination;
		d.icnSpace.visible = showHidden;

		l.grp3Info.grpRight = l.grp3Info.add( 'group' );
		l.grp3Info.grpRight.orientation = 'column';
		l.grp3Info.grpRight.alignChildren = 'left';
		l.grp3Info.grpRight.spacing = squeezePlay;

		d.grpFileType = l.grp3Info.grpRight.add( 'group', undefined, strFileType );
		
		// more shortcuts
		var p = d.grpFileType;
		
		p.orientation = 'column';
		p.alignChildren = 'fill';
		p.spacing = squeezePlay;
		
		p.grpJPEG = p.add( 'group' );
		p.grpJPEG.orientation = 'row';
		p.grpJPEG.alignChildren = 'fill';

		p.grpJPEG.grpLeft = p.grpJPEG.add( 'group' );
		p.grpJPEG.grpLeft.orientation = 'column';
		p.grpJPEG.grpLeft.alignChildren = 'fill';

		d.cbJPEG = p.grpJPEG.grpLeft.add( 'checkbox', undefined, strSaveAsJPEG );
		d.cbJPEG.helpTip = strSaveAsJPEGHelp;

		p.grpJPEG.grpLeft.grpJPEG = p.grpJPEG.grpLeft.add( 'group' );
		p.grpJPEG.grpLeft.grpJPEG.orientation = 'column';
		p.grpJPEG.grpLeft.grpJPEG.alignChildren = 'left';
		p.grpJPEG.grpLeft.grpJPEG.margins = [d.marginLeft, 0, 0, 0];

		p.grpJPEG.grpLeft.grpQ = p.grpJPEG.grpLeft.grpJPEG.add( 'group' );
		p.grpJPEG.grpLeft.grpQ.orientation = 'row';
		p.grpJPEG.grpLeft.grpQ.alignChildren = 'center';

		d.stQuality = p.grpJPEG.grpLeft.grpQ.add( 'statictext', undefined, strQuality );
		d.etQuality = p.grpJPEG.grpLeft.grpQ.add( 'edittext' );
		// d.etQuality.preferredSize.width = qEtLength;
		d.etQuality.characters = 3;
		d.etQuality.graphics.disabledBackgroundColor = brush;
		
		p.grpJPEG.grpLeft.grpJPEG.grpICC = p.grpJPEG.grpLeft.grpJPEG.add( 'group' );
		p.grpJPEG.grpLeft.grpJPEG.grpICC.orientation = 'row';
		p.grpJPEG.grpLeft.grpJPEG.grpICC.alignChildren = 'center';
		
		d.cbConvertICC = p.grpJPEG.grpLeft.grpJPEG.grpICC.add( 'checkbox', undefined, strConvertICC );
		d.cbConvertICC.helpTip = strConvertICCHelp;
		
		d.hidden1 = p.grpJPEG.grpLeft.grpJPEG.grpICC.add( 'edittext' );
		d.hidden1.preferredSize.width = 1;
		d.hidden1.visible = showHidden;

		p.grpJPEG.grpRight = p.grpJPEG.add( 'group' );
		p.grpJPEG.grpRight.orientation = 'column';
		p.grpJPEG.grpRight.alignChildren = 'left';
		
		d.cbResizeJPEG = p.grpJPEG.grpRight.add( 'checkbox', undefined, strResizeToFit1 );
		d.cbResizeJPEG.helpTip = strResizeToFitHelp;

		p.grpJPEG.grpRight.grpW = p.grpJPEG.grpRight.add( 'group' );
		p.grpJPEG.grpRight.grpW.orientation = 'row';
		p.grpJPEG.grpRight.grpW.alignChildren = 'center';
		p.grpJPEG.grpRight.grpW.spacing = 1;
		p.grpJPEG.grpRight.grpW.margins = [d.marginLeft, 0, 0, 0];

		d.stResizeJPEGW = p.grpJPEG.grpRight.grpW.add( 'statictext', undefined, strW );
		d.stResizeJPEGW.helpTip = strWHelp;
		d.stResizeJPEGW.justify = 'right';
		d.etResizeJPEGW = p.grpJPEG.grpRight.grpW.add( 'edittext' );
		d.etResizeJPEGW.helpTip = strWHelp;
		// d.etResizeJPEGW.preferredSize.width = wAndhEtLength;
		d.etResizeJPEGW.characters = 4;
		d.etResizeJPEGW.graphics.disabledBackgroundColor = brush;
		d.stResizeJPEGPXW = p.grpJPEG.grpRight.grpW.add( 'statictext', undefined, strPX );

		p.grpJPEG.grpRight.grpH = p.grpJPEG.grpRight.add( 'group' );
		p.grpJPEG.grpRight.grpH.orientation = 'row';
		p.grpJPEG.grpRight.grpH.alignChildren = 'center';
		p.grpJPEG.grpRight.grpH.spacing = 1;
		p.grpJPEG.grpRight.grpH.margins = [d.marginLeft, 0, 0, 0];

		d.stResizeJPEGH = p.grpJPEG.grpRight.grpH.add( 'statictext', undefined, strH );
		d.stResizeJPEGH.helpTip = strHHelp;
		d.stResizeJPEGH.justify = 'right';
		d.etResizeJPEGH = p.grpJPEG.grpRight.grpH.add( 'edittext' );
		d.etResizeJPEGH.helpTip = strHHelp;
		// d.etResizeJPEGH.preferredSize.width = wAndhEtLength;
		d.etResizeJPEGH.characters = 4;
		d.etResizeJPEGH.graphics.disabledBackgroundColor = brush;
		d.stResizeJPEGPXH = p.grpJPEG.grpRight.grpH.add( 'statictext', undefined, strPX );
		
		p.line1 = p.add( 'panel', undefined, undefined, {borderStyle: 'sunken'} );
		p.line1.alignment = 'fill';
		
		p.grpPSD = p.add( 'group' );
		p.grpPSD.orientation = 'row';
		p.grpPSD.alignChildren = 'fill';

		p.grpPSD.grpLeft = p.grpPSD.add( 'group' );
		p.grpPSD.grpLeft.orientation = 'column';
		p.grpPSD.grpLeft.alignChildren = 'fill';

		d.cbPSD = p.grpPSD.grpLeft.add( 'checkbox', undefined, strSaveAsPSD );
		d.cbPSD.helpTip = strSaveAsPSDHelp;
		
		p.grpPSD.grpLeft.grpPSD = p.grpPSD.grpLeft.add( 'group' );
		p.grpPSD.grpLeft.grpPSD.orientation = 'column';
		p.grpPSD.grpLeft.grpPSD.alignChildren = 'left';
		p.grpPSD.grpLeft.grpPSD.margins = [d.marginLeft, 0, 0, 0];

		p.grpPSD.grpLeft.grpPSD.grpMax = p.grpPSD.grpLeft.grpPSD.add( 'group' );
		p.grpPSD.grpLeft.grpPSD.grpMax.orientation = 'row';
		p.grpPSD.grpLeft.grpPSD.grpMax.alignChildren = 'center';

		d.cbMaximize = p.grpPSD.grpLeft.grpPSD.grpMax.add( 'checkbox', undefined, strMaximize );
		d.cbMaximize.helpTip = strMaximizeHelp;
		
		d.hidden2 = p.grpPSD.grpLeft.grpPSD.grpMax.add( 'edittext' );
		d.hidden2.preferredSize.width = 1;
		d.hidden2.visible = showHidden;

		p.grpPSD.grpRight = p.grpPSD.add( 'group' );
		p.grpPSD.grpRight.orientation = 'column';
		p.grpPSD.grpRight.alignChildren = 'left';

		d.cbResizePSD = p.grpPSD.grpRight.add( 'checkbox', undefined, strResizeToFit2 );
		d.cbResizePSD.helpTip = strResizeToFitHelp;
		
		p.grpPSD.grpRight.grpW = p.grpPSD.grpRight.add( 'group' );
		p.grpPSD.grpRight.grpW.orientation = 'row';
		p.grpPSD.grpRight.grpW.alignChildren = 'center';
		p.grpPSD.grpRight.grpW.spacing = 1;
		p.grpPSD.grpRight.grpW.margins = [d.marginLeft, 0, 0, 0];

		d.stResizePSDW = p.grpPSD.grpRight.grpW.add( 'statictext', undefined, strW );
		d.stResizePSDW.helpTip = strWHelp;
		d.stResizePSDW.justify = 'right';
		d.etResizePSDW = p.grpPSD.grpRight.grpW.add( 'edittext' );
		d.etResizePSDW.helpTip = strWHelp;
		// d.etResizePSDW.preferredSize.width = wAndhEtLength;
		d.etResizePSDW.characters = 4;
		d.etResizePSDW.graphics.disabledBackgroundColor = brush;
		d.stResizePSDPXW = p.grpPSD.grpRight.grpW.add( 'statictext', undefined, strPX );
		
		p.grpPSD.grpRight.grpH = p.grpPSD.grpRight.add( 'group' );
		p.grpPSD.grpRight.grpH.orientation = 'row';
		p.grpPSD.grpRight.grpH.alignChildren = 'center';
		p.grpPSD.grpRight.grpH.spacing = 1;
		p.grpPSD.grpRight.grpH.margins = [d.marginLeft, 0, 0, 0];

		d.stResizePSDH = p.grpPSD.grpRight.grpH.add( 'statictext', undefined, strH );
		d.stResizePSDH.helpTip = strHHelp;
		d.stResizePSDH.justify = 'right';
		d.etResizePSDH = p.grpPSD.grpRight.grpH.add( 'edittext' );
		d.etResizePSDH.helpTip = strHHelp;
		// d.etResizePSDH.preferredSize.width = wAndhEtLength;
		d.etResizePSDH.characters = 4;
		d.etResizePSDH.graphics.disabledBackgroundColor = brush;
		d.stResizePSDPXH = p.grpPSD.grpRight.grpH.add( 'statictext', undefined, strPX );
		
		p.line2 = p.add( 'panel', undefined, undefined, {borderStyle: 'sunken'} );
		p.line2.alignment = 'fill';
		
		p.grpTIFF = p.add( 'group' );
		p.grpTIFF.orientation = 'row';
		p.grpTIFF.alignChildren = 'fill';

		p.grpTIFF.grpLeft = p.grpTIFF.add( 'group' );
		p.grpTIFF.grpLeft.orientation = 'column';
		p.grpTIFF.grpLeft.alignChildren = 'fill';

		d.cbTIFF = p.grpTIFF.grpLeft.add( 'checkbox', undefined, strSaveAsTIFF );
		d.cbTIFF.helpTip = strSaveAsTIFFHelp
		
		p.grpTIFF.grpLeft.grpTIFF = p.grpTIFF.grpLeft.add( 'group' );
		p.grpTIFF.grpLeft.grpTIFF.orientation = 'column';
		p.grpTIFF.grpLeft.grpTIFF.alignChildren = 'left';
		p.grpTIFF.grpLeft.grpTIFF.margins = [d.marginLeft, 0, 0, 0];

		p.grpTIFF.grpLeft.grpTIFF.grpLZW = p.grpTIFF.grpLeft.grpTIFF.add( 'group' );
		p.grpTIFF.grpLeft.grpTIFF.grpLZW.orientation = 'row';
		p.grpTIFF.grpLeft.grpTIFF.grpLZW.alignChildren = 'center';

		d.cbTIFFLZW = p.grpTIFF.grpLeft.grpTIFF.grpLZW.add( 'checkbox', undefined, strLZW );
		d.cbTIFFLZW.helpTip = strLZWHelp;
		
		d.hidden3 = p.grpTIFF.grpLeft.grpTIFF.grpLZW.add( 'edittext' );
		d.hidden3.preferredSize.width = 1;
		d.hidden3.visible = showHidden;

		p.grpTIFF.grpRight = p.grpTIFF.add( 'group' );
		p.grpTIFF.grpRight.orientation = 'column';
		p.grpTIFF.grpRight.alignChildren = 'left';

		d.cbResizeTIFF = p.grpTIFF.grpRight.add( 'checkbox', undefined, strResizeToFit3 );
		d.cbResizeTIFF.helpTip = strResizeToFitHelp;

		p.grpTIFF.grpRight.grpW = p.grpTIFF.grpRight.add( 'group' );
		p.grpTIFF.grpRight.grpW.orientation = 'row';
		p.grpTIFF.grpRight.grpW.alignChildren = 'center';
		p.grpTIFF.grpRight.grpW.spacing = 1;
		p.grpTIFF.grpRight.grpW.margins = [d.marginLeft, 0, 0, 0];

		d.stResizeTIFFW = p.grpTIFF.grpRight.grpW.add( 'statictext', undefined, strW );
		d.stResizeTIFFW.helpTip = strWHelp;
		d.stResizeTIFFW.justify = 'right';
		d.etResizeTIFFW = p.grpTIFF.grpRight.grpW.add( 'edittext' );
		d.etResizeTIFFW.helpTip = strWHelp;
		// d.etResizeTIFFW.preferredSize.width = wAndhEtLength;
		d.etResizeTIFFW.characters = 4;
		d.etResizeTIFFW.graphics.disabledBackgroundColor = brush;
		d.stResizeTIFFPXW = p.grpTIFF.grpRight.grpW.add( 'statictext', undefined, strPX );

		p.grpTIFF.grpRight.grpH = p.grpTIFF.grpRight.add( 'group' );
		p.grpTIFF.grpRight.grpH.orientation = 'row';
		p.grpTIFF.grpRight.grpH.alignChildren = 'center';
		p.grpTIFF.grpRight.grpH.spacing = 1;
		p.grpTIFF.grpRight.grpH.margins = [d.marginLeft, 0, 0, 0];

		d.stResizeTIFFH = p.grpTIFF.grpRight.grpH.add( 'statictext', undefined, strH );
		d.stResizeTIFFH.helpTip = strHHelp;
		d.stResizeTIFFH.justify = 'right';
		d.etResizeTIFFH = p.grpTIFF.grpRight.grpH.add( 'edittext' );
		d.etResizeTIFFH.helpTip = strHHelp;
		// d.etResizeTIFFH.preferredSize.width = wAndhEtLength;
		d.etResizeTIFFH.characters = 4;
		d.etResizeTIFFH.graphics.disabledBackgroundColor = brush;
		d.stResizeTIFFPXH = p.grpTIFF.grpRight.grpH.add( 'statictext', undefined, strPX );

		d.line3 = l.add( 'panel', undefined, undefined, {borderStyle: 'sunken'} );
		d.line3.alignment = 'fill';

		// section 4 

		l.grp4 = l.add( 'group' );
		l.grp4.orientation = 'row';
		l.grp4.alignChildren = 'top';
		
		l.grp4.grpLeft = l.grp4.add( 'group' );
		l.grp4.grpLeft.orientation = 'column';
		l.grp4.grpLeft.alignChildren = 'left';

		d.icnFour = l.grp4.grpLeft.add( 'image', undefined, 'Step4Icon' );
		d.icnFour.helpTip = strPreferences;

		l.grp4.grpRight = l.grp4.add( 'group' );
		l.grp4.grpRight.orientation = 'column';
		l.grp4.grpRight.alignChildren = 'left';

		d.stPreferences = l.grp4.grpRight.add( 'statictext', undefined, strPreferences );
		d.stPreferences.helpTip = strPreferences;

		l.grp4Info = l.grp4.grpRight.add( 'group' );
		l.grp4Info.orientation = 'row';
		l.grp4Info.alignChildren = 'top';
		
		l.grp4Info.grpLeft = l.grp4Info.add( 'group' );
		l.grp4Info.grpLeft.orientation = 'column';
		l.grp4Info.grpLeft.alignChildren = 'left';
		l.grp4Info.grpLeft.spacing = 5;

		l.grpAction = l.grp4Info.grpLeft.add( 'group' );
		l.grpAction.orientation = 'row';
		l.grpAction.alignChildren = 'center';

		d.cbAction = l.grpAction.add( 'checkbox' );
		d.cbAction.text = strRunAction;
		d.cbAction.helpTip = strActionHelp;
		
		d.hidden4 = l.grpAction.add( 'dropdownlist' );
		d.hidden4.preferredSize.width = 1;
		d.hidden4.visible = showHidden;

		l.grp4Info.grpRight = l.grp4Info.add( 'group' );
		l.grp4Info.grpRight.orientation = 'column';
		l.grp4Info.grpRight.alignChildren = 'left';
		l.grp4Info.grpRight.spacing = 5;

		l.grpDropDowns = l.grp4Info.grpRight.add( 'group' );
		l.grpDropDowns.orientation = 'row';
		l.grpDropDowns.alignChildren = 'center';

		d.ddSet = l.grpDropDowns.add( 'dropdownlist' );
		d.ddSet.helpTip = strActionHelp;
		d.ddSet.preferredSize.width = actionDropDownLength;
		
		d.ddAction = l.grpDropDowns.add( 'dropdownlist' );
		d.ddAction.helpTip = strActionHelp;
		d.ddAction.preferredSize.width = actionDropDownLength;

		l.grpCopyright = l.grp4Info.grpLeft.add( 'group' );
		l.grpCopyright.orientation = 'row';
		l.grpCopyright.alignChildren = 'center';
		
		d.stCopyrightInfo = l.grpCopyright.add( 'statictext', undefined, strCopyright );
		d.stCopyrightInfo.helpTip = strCopyrightHelp;
		
		d.hidden5 = l.grpCopyright.add( 'edittext' );
		d.hidden5.preferredSize.width = 1;
		d.hidden5.visible = showHidden;

		d.etCopyrightInfo = l.grp4Info.grpRight.add( 'edittext' );
		d.etCopyrightInfo.helpTip = strCopyrightHelp;
		d.etCopyrightInfo.alignment = 'fill';
		d.etCopyrightInfo.preferredSize.width = actionDropDownLength * 2;

		d.cbIncludeICC = l.grp4.grpRight.add( 'checkbox', undefined, strICC );
		d.cbIncludeICC.helpTip = strICCHelp;

		// buttons on the right side of the dialog
		
		d.grpRight = d.add( 'group' );
		d.grpRight.orientation = 'column';
		d.grpRight.alignChildren = 'fill';
		d.grpRight.alignment = 'fill';

		d.btnRun = d.grpRight.add( 'button', undefined, strButtonRun );
		d.btnCancel = d.grpRight.add( 'button', undefined, strButtonCancel );
		d.stFake = d.grpRight.add( 'statictext', undefined, '' );
		d.btnLoad = d.grpRight.add( 'button', undefined, strButtonLoad );
		d.btnLoad.helpTip = strButtonLoadHelp;
		d.btnSave = d.grpRight.add( 'button', undefined, strButtonSave );
		d.btnSave.helpTip = strButtonSaveHelp;

		d.defaultElement = d.btnRun;
		d.cancelElement = d.btnCancel;
	}

	this.InitParams = function() {
		var params = new Object();
		params["version"] = gVersion;
		params["useopen"] = false;
		params["includesub"] = false;
		params["source"] = "";
		params["open"] = false;
		params["saveinsame"] = true;
		params["dest"] = "";
		params["jpeg"] = true;
		params["psd"] = false;
		params["tiff"] = false;
		params["lzw"] = false;
		params["converticc"] = false;
		params["q"] = 5;
		params["max"] = true;
		params["jpegresize"] = false;
		params["jpegw"] = "";
		params["jpegh"] = "";
		params["psdresize"] = false;
		params["psdw"] = "";
		params["psdh"] = "";
		params["tiffresize"] = false;
		params["tiffw"] = "";
		params["tiffh"] = "";
		params["runaction"] = false;
		params["actionset"] = "";
		params["action"] = "";
		params["info"] = "";
		params["icc"] = true;
		params["keepstructure"] = false;
		return params;
	}

	// transfer from the default settings or settings I read off disk to the dialog widgets
	this.InitDialog = function() {

		var d = this.dlgMain;
		var p = this.params;
		
		this.dlgMain.ip = this;
		d.loadFromDisk = true;
		
		if ( ! this.runningFromBridge ) {

			if ( app.documents.length > 0 ) {
				d.rbUseOpen.value = p["useopen"];
			} else {
				d.rbUseOpen.enabled = false;
				d.rbUseOpen.value = false;
			}
			
			d.cbIncludeSubFolders.value = p["includesub"];
			
			d.cbKeepStructure.value = p["keepstructure"];

			d.rbUseFolder.value = ! d.rbUseOpen.value;

			d.stSource.text = p["source"];
			if ( d.stSource.text == "" ) {
				d.stSource.text = strNoImagesSelected;
			}
		}
		d.sourceLongText = p["source"];

		d.rbSaveInSame.value = p["saveinsame"];
		d.rbSaveInNew.value = ! d.rbSaveInSame.value;		
		d.cbOpenFirst.value = p["open"];
		d.stDest.text = p["dest"];
		if ( d.stDest.text == "" ) {
			d.stDest.text = strNoFolderSelected;
		}
		d.destLongText = p["dest"];
		d.cbJPEG.value = p["jpeg"];
		d.cbPSD.value = p["psd"];
		d.cbTIFF.value = p["tiff"];
		d.cbTIFFLZW.value = p["lzw"];
		d.cbConvertICC.value = p["converticc"];
		d.etQuality.text = p["q"];
		d.cbMaximize.value = p["max"];
		d.cbResizeJPEG.value = p["jpegresize"];
		d.etResizeJPEGH.text = p["jpegh"];
		d.etResizeJPEGW.text = p["jpegw"];
		d.cbResizePSD.value = p["psdresize"];
		d.etResizePSDH.text = p["psdh"];
		d.etResizePSDW.text = p["psdw"];
		d.cbResizeTIFF.value = p["tiffresize"];
		d.etResizeTIFFH.text = p["tiffh"];
		d.etResizeTIFFW.text = p["tiffw"];
		d.cbAction.value = p["runaction"];
		d.etCopyrightInfo.text = p["info"];
		d.cbIncludeICC.value = p["icc"];
	}

	// pretend like i clicked it to get the other items to respond to the current settings
	this.ForceDialogUpdate = function() {	
		if ( ! this.runningFromBridge ) {
			this.dlgMain.rbUseOpen.onClick();
		}
		this.dlgMain.rbSaveInSame.onClick();
		this.dlgMain.cbJPEG.onClick();
		this.dlgMain.cbPSD.onClick();
		this.dlgMain.cbTIFF.onClick();
		index = this.dlgMain.SetDropDown( this.dlgMain.ddSet, this.params["actionset"] );
		if ( this.actionInfo.length > 0 ) {
			this.dlgMain.ddSet.onChange( index );
			this.actionIndex = this.dlgMain.SetDropDown( this.dlgMain.ddAction, this.params["action"] );
		}
		this.dlgMain.cbAction.onClick();
	}

	// transfer from the dialog widgets to my internal params
	this.GetParamsFromDialog = function() {
		
		var p = this.params;
		var d = this.dlgMain;
		
		if ( ! this.runningFromBridge ) {
			p["useopen"] = d.rbUseOpen.value;
             p["source"] = d.sourceLongText;
			p["includesub"] = d.cbIncludeSubFolders.value;
			p["keepstructure"] = d.cbKeepStructure.value;
		}

		p["saveinsame"] = d.rbSaveInSame.value;
		p["dest"] = d.destLongText;
		p["open"] = d.cbOpenFirst.value;
		p["jpeg"] = d.cbJPEG.value;
		p["psd"] = d.cbPSD.value;
		p["tiff"] = d.cbTIFF.value;
		p["lzw"] = d.cbTIFFLZW.value;
		p["converticc"] = d.cbConvertICC.value;
		p["q"] = d.etQuality.text;
		p["max"] = d.cbMaximize.value;
		p["jpegresize"] = d.cbResizeJPEG.value;
		p["jpegh"] = d.etResizeJPEGH.text;
		p["jpegw"] = d.etResizeJPEGW.text;
		p["psdresize"] = d.cbResizePSD.value;
		p["psdh"] = d.etResizePSDH.text;
		p["psdw"] = d.etResizePSDW.text;
		p["tiffresize"] = d.cbResizeTIFF.value;
		p["tiffh"] = d.etResizeTIFFH.text;
		p["tiffw"] = d.etResizeTIFFW.text;
		p["runaction"] = d.cbAction.value;
		p["actionset"] = d.ddSet.selection.text;
		p["action"] = d.ddAction.selection.text;
		p["info"] = d.etCopyrightInfo.text;
		p["icc"] = d.cbIncludeICC.value;
	}
	
	// routine for running the dialog and it's interactions
	this.RunDialog = function () {

		this.dlgMain.btnCancel.onClick = function() { 
			var d = FindDialog( this );
			d.close( gCancelButtonID );
		}

		// help auto layout
		this.dlgMain.onShow = function() {
			
			this.cbOpenFirst.location.x += this.marginLeft;
			this.grpLeft.grp1Info.grpRight.bounds.right += this.marginLeft;
			
			var p = this.grpFileType;

			// align the ":" and edit text boxes for the resize numbers
			if ( p.grpJPEG.grpRight.grpH.bounds.width < p.grpJPEG.grpRight.grpW.bounds.width ) {
				var mover = p.grpJPEG.grpRight.grpW.bounds.width - p.grpJPEG.grpRight.grpH.bounds.width;

				p.grpJPEG.grpRight.grpH.bounds.right += mover;
				this.stResizeJPEGH.location.x += mover;
				this.etResizeJPEGH.location.x += mover;
				this.stResizeJPEGPXH.location.x += mover;

				p.grpPSD.grpRight.grpH.bounds.right += mover;
				this.stResizePSDH.location.x += mover;
				this.etResizePSDH.location.x += mover;
				this.stResizePSDPXH.location.x += mover;

				p.grpTIFF.grpRight.grpH.bounds.right += mover;
				this.stResizeTIFFH.location.x += mover;
				this.etResizeTIFFH.location.x += mover;
				this.stResizeTIFFPXH.location.x += mover;

			} else {
				var mover = p.grpJPEG.grpRight.grpH.bounds.width - p.grpJPEG.grpRight.grpW.bounds.width;

				p.grpJPEG.grpRight.grpW.bounds.right += mover;
				this.stResizeJPEGW.location.x += mover;
				this.etResizeJPEGW.location.x += mover;
				this.stResizeJPEGPXW.location.x += mover;

				p.grpPSD.grpRight.grpW.bounds.right += mover;
				this.stResizePSDW.location.x += mover;
				this.etResizePSDW.location.x += mover;
				this.stResizePSDPXW.location.x += mover;

				p.grpTIFF.grpRight.grpW.bounds.right += mover;
				this.stResizeTIFFW.location.x += mover;
				this.etResizeTIFFW.location.x += mover;
				this.stResizeTIFFPXW.location.x += mover;

			}
			
			// align the resize groups
			var farRight = p.grpJPEG.grpRight.location.x;
			if ( p.grpPSD.grpRight.location.x > farRight ) {
				farRight = p.grpPSD.grpRight.location.x;
			}
			if ( p.grpTIFF.grpRight.location.x > farRight ) {
				farRight = p.grpTIFF.grpRight.location.x;
			}

			p.grpJPEG.grpRight.location.x = farRight;
			p.grpPSD.grpRight.location.x = farRight;
			p.grpTIFF.grpRight.location.x = farRight;	

			// make the copyright and action drop downs as large as possible
			// and align them with the third line
			var leftAdjuster = this.etCopyrightInfo.parent.bounds.left;
			leftAdjuster += this.etCopyrightInfo.parent.parent.bounds.left;
			leftAdjuster += this.etCopyrightInfo.parent.parent.parent.bounds.left;

			var mover = this.line3.bounds.right - this.etCopyrightInfo.bounds.right;
			mover -= leftAdjuster;

			this.etCopyrightInfo.bounds.right += mover;

			// make all the parents bigger to fit the new size of the copyright
			this.etCopyrightInfo.parent.bounds.right += mover;
			this.etCopyrightInfo.parent.parent.bounds.right += mover;
			this.etCopyrightInfo.parent.parent.parent.bounds.right += mover;

			// split the adjustment above into the two dropdowns
			// make sure the right edges line up by looking at the oddness
			var halfMover = mover / 2;
			var isOdd = halfMover % 2 ? true : false;

			this.ddSet.bounds.width += halfMover;
			this.ddAction.bounds.width += halfMover;
			this.ddAction.location.x += halfMover + ( isOdd ? 1 : 0 );

			// make your parents bigger so everybody looks nice
			this.ddSet.parent.bounds.right += mover;
			this.ddSet.parent.parent.bounds.right += mover;
		}
		
		if ( ! this.runningFromBridge ) {
			this.dlgMain.rbUseOpen.onClick = function() {
				var d = FindDialog( this );
				d.rbUseFolder.value = ! this.value;
				d.cbOpenFirst.enabled = ! this.value;
				d.btnSource.enabled = ! this.value;
				d.stSource.enabled = ! this.value;
				d.cbIncludeSubFolders.enabled = ! this.value;
			}

			this.dlgMain.rbUseFolder.onClick = function() {
				var d = FindDialog( this );
				d.rbUseOpen.value = ! this.value;
				d.cbOpenFirst.enabled = this.value;
				d.btnSource.enabled = this.value;
				d.stSource.enabled = this.value;
				d.cbIncludeSubFolders.enabled = this.value;
			}

			this.dlgMain.btnSource.onClick = function() { 
				var d = FindDialog( this );
				var selFolder = Folder.selectDialog( strPickSource, d.sourceLongText );
				if ( selFolder != null ) {
					d.sourceLongText = selFolder.fsName.toString()
					d.stSource.text = d.sourceLongText;
				}
				d.defaultElement.active = true;
			}

		}

		this.dlgMain.rbSaveInSame.onClick = function() {
			var d = FindDialog( this );
			d.rbSaveInNew.value = ! this.value;
			d.btnDest.enabled = ! this.value;
			d.stDest.enabled = ! this.value;
			if ( ! d.ip.runningFromBridge ) {
				d.cbKeepStructure.enabled = ! this.value;
			}
		}
		
		this.dlgMain.rbSaveInNew.onClick = function() {
			var d = FindDialog( this );
			d.rbSaveInSame.value = ! this.value;
			d.btnDest.enabled = this.value;
			d.stDest.enabled = this.value;
			if ( ! d.ip.runningFromBridge ) {
				d.cbKeepStructure.enabled = this.value;
			}
		}

		this.dlgMain.SetDropDown = function ( dd, strSet ) {
			var index = 0;
			for ( var i = 0; i < dd.items.length; i++ ) {
				if ( dd.items[ i ].toString() == strSet ) {
					index = i;
					break;
				}
			}
			if ( dd.items.length > 0 ) {
				dd.items[ index ].selected = true;
			}
			return index;
		}

		this.dlgMain.btnLoad.onClick = function() {
 
			var d = FindDialog( this );
			var loadFile = null;
			Folder.current = Folder( "~/" );
			if ( File.fs == "Windows" ) {
				loadFile = File.openDialog( strPickXML, strPickXMLWin );
			} else {
				loadFile = File.openDialog( strPickXML, MacXMLFilter );
			}
			if ( loadFile != null ) {
				d.ip.LoadParamsFromDisk( loadFile );
				d.ip.InitDialog();
				d.loadFromDisk = true;
				d.ip.ForceDialogUpdate();
			}
			d.defaultElement.active = true;
		}
		
		this.dlgMain.btnSave.onClick = function() { 
			var d = FindDialog( this );
			var saveFile = null;
			Folder.current = Folder( "~/" );
			if ( File.fs == "Windows" ) {
				saveFile = File.saveDialog( strPickXMLSave, strPickXMLWin );
			} else {
				saveFile = File.saveDialog( strPickXMLSave, MacXMLFilter );
			}
			if ( saveFile != null ) {
				if ( saveFile.exists ) {
					if ( confirm(strFileAlreadyExists) == false) {
						return;
					}
				}
				d.ip.GetParamsFromDialog();
				d.ip.SaveParamsToDisk( saveFile );
			}
			d.defaultElement.active = true;
		}

		this.dlgMain.btnDest.onClick = function() { 
			var d = FindDialog( this );
			var selFolder = Folder.selectDialog( strPickDest, d.destLongText );
			if ( selFolder != null ) {
				d.destLongText = selFolder.fsName.toString()
				d.stDest.text = d.destLongText;
			}
			d.defaultElement.active = true;
		}
		
		this.dlgMain.cbPSD.onClick = function() {
			var d = FindDialog( this );
			d.cbMaximize.enabled = this.value;
			d.cbResizePSD.enabled = this.value;
			d.cbResizePSD.onClick();
		}
		
		this.dlgMain.cbTIFF.onClick = function() {
			var d = FindDialog( this );
			d.cbTIFFLZW.enabled = this.value;
			d.cbResizeTIFF.enabled = this.value;
			d.cbResizeTIFF.onClick();
		}
		
		this.dlgMain.cbJPEG.onClick = function() {
			var d = FindDialog( this );
			d.stQuality.enabled = this.value;
			d.etQuality.enabled = this.value;
			d.cbConvertICC.enabled = this.value;
			d.cbResizeJPEG.enabled = this.value;
			d.cbResizeJPEG.onClick();
		}

		this.dlgMain.cbResizeJPEG.onClick = function( inValue ) {
			var d = FindDialog( this );
			var realValue = this.value;
			if ( ! d.cbJPEG.value )
				realValue = false;
			d.stResizeJPEGW.enabled = realValue;
			d.etResizeJPEGW.enabled = realValue;
			d.stResizeJPEGPXW.enabled = realValue;
			d.stResizeJPEGH.enabled = realValue;
			d.etResizeJPEGH.enabled = realValue;
			d.stResizeJPEGPXH.enabled = realValue;
		}
		
		this.dlgMain.cbResizePSD.onClick = function( inValue ) {
			var d = FindDialog( this );
			var realValue = this.value;
			if ( ! d.cbPSD.value )
				realValue = false;
			d.stResizePSDW.enabled = realValue;
			d.etResizePSDW.enabled = realValue;
			d.stResizePSDPXW.enabled = realValue;
			d.stResizePSDH.enabled = realValue;
			d.etResizePSDH.enabled = realValue;
			d.stResizePSDPXH.enabled = realValue;
		}
		
		this.dlgMain.cbResizeTIFF.onClick = function( inValue ) {
			var d = FindDialog( this );
			var realValue = this.value;
			if ( ! d.cbTIFF.value )
				realValue = false;
			d.stResizeTIFFW.enabled = realValue;
			d.etResizeTIFFW.enabled = realValue;
			d.stResizeTIFFPXW.enabled = realValue;
			d.stResizeTIFFH.enabled = realValue;
			d.etResizeTIFFH.enabled = realValue;
			d.stResizeTIFFPXH.enabled = realValue;
		}

		this.dlgMain.cbAction.onClick = function() {
			var d = FindDialog( this );
			d.ddSet.enabled = this.value;
			d.ddAction.enabled = this.value;
		}

		if ( this.actionInfo.length > 0 ) {
			for ( var i = 0; i < this.actionInfo.length; i++ ) {
				this.dlgMain.ddSet.add( "item", this.actionInfo[i].name );
			}
			this.dlgMain.ddSet.items[0].selected = true;
			this.dlgMain.ddSet.onChange = function( forcedSelectionIndex ) {
				var index = 0;
				var d = FindDialog( this );
				d.ddAction.removeAll();
				if ( undefined == forcedSelectionIndex ) {
					forcedSelectionIndex = this.selection.index;
					if ( undefined != d.ip.actionIndex ) {
						index = d.ip.actionIndex;
						d.ip.actionIndex = undefined;
					}
				}
				for ( var i = 0; i < d.ip.actionInfo[ forcedSelectionIndex ].children.length; i++ ) {
					d.ddAction.add( "item", d.ip.actionInfo[ forcedSelectionIndex ].children[ i ].name );
				}
				if ( d.ddAction.items.length > 0 ) {
					d.ddAction.items[ index ].selected = true;
				}
				if ( null != this.selection ) {
					this.helpTip = this.selection.text;
				}
			}
		} else {
			this.dlgMain.grpLeft.grpAction.enabled = false;
		}
	
		this.dlgMain.ddAction.onChange = function() {
			this.helpTip = this.selection.text;
		}

		// do not allow anything except for numbers 0-9
		//this.dlgMain.etQuality.addEventListener ('keydown', NumericEditKeyboardHandler);

		// do not allow anything except for numbers 0-9
		//this.dlgMain.etResizeJPEGW.addEventListener ('keydown', NumericEditKeyboardHandler);

		// do not allow anything except for numbers 0-9
		//this.dlgMain.etResizeJPEGH.addEventListener ('keydown', NumericEditKeyboardHandler);

		// do not allow anything except for numbers 0-9
		//this.dlgMain.etResizeTIFFW.addEventListener ('keydown', NumericEditKeyboardHandler);

		// do not allow anything except for numbers 0-9
		//this.dlgMain.etResizeTIFFH.addEventListener ('keydown', NumericEditKeyboardHandler);

		// do not allow anything except for numbers 0-9
		//this.dlgMain.etResizePSDW.addEventListener ('keydown', NumericEditKeyboardHandler);

		// do not allow anything except for numbers 0-9
		//this.dlgMain.etResizePSDH.addEventListener ('keydown', NumericEditKeyboardHandler);

		this.dlgMain.btnRun.onClick = function () {
			var testFolder = null;
			var d = FindDialog( this );
			if ( ! this.runningFromBridge ) {
				if ( this.rbUseFolder ) {
					if ( d.sourceLongText.length > 0 && d.sourceLongText[0] != '.' ) {
						testFolder = new Folder( d.sourceLongText );
						if ( !testFolder.exists ) {
							alert( strSpecifySource );
							return;
						}
					} else {
						alert( strSpecifySource );
						return;
					}
				}
			}

			if ( d.rbSaveInNew.value ) {
				if ( d.destLongText.length > 0 && d.destLongText[0] != '.' ) {
					testFolder = new Folder( d.destLongText );
					if ( !testFolder.exists ) {
						alert( strSpecifyDest );
						return;
					}
				} else {
					alert( strSpecifyDest );
					return;
				}
			}
						
			if ( d.cbJPEG.value ) {
				var q = Number( d.etQuality.text );
				if ( q < 0 || q > 12 || isNaN( q ) || d.etQuality.text.length == 0 ) {
					alert( strJPEGQuality );
					return;
				}

			    if ( d.cbResizeJPEG.value ) {
				    var w = Number( d.etResizeJPEGW.text );
				    var h = Number( d.etResizeJPEGH.text );
			        if ( isNaN( w ) || w < 1 || w > gMaxResize ||
			             isNaN( h ) || h < 1 || h > gMaxResize ) {
					    alert( strJPEGWandH );
					    return;
				    }
			    }
			}

			if ( d.cbTIFF.value && d.cbResizeTIFF.value ) {
				var w = Number( d.etResizeTIFFW.text );
				var h = Number( d.etResizeTIFFH.text );
			    if ( isNaN( w ) || w < 1 || w > gMaxResizeTIFF ||
			         isNaN( h ) || h < 1 || h > gMaxResizeTIFF ) {
					alert( strTIFFWandH );
					return;
				}
			}

			if ( d.cbPSD.value && d.cbResizePSD.value ) {
				var w = Number( d.etResizePSDW.text );
				var h = Number( d.etResizePSDH.text );
			    if ( isNaN( w ) || w < 1 || w > gMaxResize ||
			         isNaN( h ) || h < 1 || h > gMaxResize ) {
					alert( strPSDWandH );
					return;
				}
			}

			// make sure they have at least one file format specified for output
			var outputCount = 0;
			if ( d.cbJPEG.value ) {
				outputCount++;
			}
			if ( d.cbPSD.value ) {
				outputCount++;
			}
			if ( d.cbTIFF.value ) {
				outputCount++;
			}

			if ( outputCount == 0 ) {
				alert( strOneType );
				return;
			}

			d.ip.GetParamsFromDialog()
			
			d.close( gRunButtonID );
		}

		this.InitDialog();

		this.ForceDialogUpdate();
		
		// in case we double clicked the file
		app.bringToFront();

		this.dlgMain.center();
		
		return this.dlgMain.show();

	}

	// if I get here then the dialog params are ok and it is time
	// to do what they want
	// the heart of the script is this routine
	// loop through all the files and save accordingly
	this.Execute = function()  {
		var cameraRawParams = new Object();
		cameraRawParams.desc = undefined;
		cameraRawParams.useDescriptor = false;
		
		var inputFiles;
		if ( this.runningFromBridge ) {
			inputFiles = this.filesFromBridge;
		} else if ( this.params["useopen"] ) {
			inputFiles = OpenDocs();
		} else if ( this.params["includesub"] ) {
			inputFiles = new Array();
			inputFiles = FindAllFiles( this.params["source"], inputFiles );
		} else {
			inputFiles = Folder ( this.params["source"] ).getFiles ();
		}

        var rememberMaximize;
        var needMaximize = this.params["max"] ? QueryStateType.ALWAYS : QueryStateType.NEVER;
        if ( this.params["psd"] && app.preferences.maximizeCompatibility != needMaximize ) {
            rememberMaximize = app.preferences.maximizeCompatibility;
            app.preferences.maximizeCompatibility = needMaximize;
        }
            
		for (var i = 0; i < inputFiles.length; i++) {

			try {
				if ( ( inputFiles[i] instanceof File && 
					! inputFiles[i].hidden ) || 
					this.params["useopen"] ) {

					if ( this.runningFromBridge ) {
						cameraRawParams.fileName = inputFiles[i].absoluteURI.toString();
						this.params["source"] = inputFiles[i].path.toString();
						// Change the source path to an URI.
						this.params["source"] = Folder(this.params["source"]).absoluteURI.toString();
					} else if ( this.params["useopen"]  ) {
						cameraRawParams.fileName = inputFiles[i].fullName.absoluteURI.toString(); 
						this.params["source"] = inputFiles[i].path.toString();
						// Change the source path to an URI.
						this.params["source"] = Folder(this.params["source"]).absoluteURI.toString();					
					} else {
						cameraRawParams.fileName = inputFiles[i].absoluteURI.toString();
						// Change the source path to an URI.
						this.params["source"] = Folder(this.params["source"]).absoluteURI.toString();
					}

					if (IsFileOneOfThese( cameraRawParams.fileName, gFileExtensionsToRead ) ||
				 		IsFileOneOfTheseTypes( cameraRawParams.fileName, gFileTypesToRead ) ) {
						gFoundFileToProcess = true;
						if ( ! this.runningFromBridge && this.params["useopen"] ) {
							app.activeDocument = inputFiles[ i ];
							app.activeDocument.duplicate();
						} else {
							if ( ! gOpenedFirstCR && this.params["open"] && IsFileOneOfThese( cameraRawParams.fileName, gFilesForCameraRaw ) ){
								// this is the first CR file and the user elected to open it and choose settings to apply to the
								// rest of the CR files
								gOpenedFirstCR = true;
								cameraRawParams.useDescriptor = true;
								this.OpenCameraRaw( cameraRawParams, true )
							} else {
								this.OpenCameraRaw( cameraRawParams, false, DialogModes.NO );
							}
						}

						this.AdjustFile( cameraRawParams );

						if ( this.params["saveinsame"] ) {
							var destFolder = inputFiles[i].parent.toString();
							if ( ! this.runningFromBridge && this.params["useopen"] ) {
								var destFolder = inputFiles[i].fullName.parent.toString();
							}
						} else {
							var destFolder = Folder(this.params["dest"]).absoluteURI.toString();
						}

						this.SaveFile( cameraRawParams.fileName, destFolder  );
						app.activeDocument.close( SaveOptions.DONOTSAVECHANGES );
					}
				}
			}
			// don't let one file spoil the party!
			// trying to stop on user cancel is a problem
			// during the open of a large file the error we get is no such element
			// and not the actual cancel 8007
			// it's all about timing, hit the cancel right after a document opens
			// and all is well and you get the cancel and everything stops
			catch( e ) {
				if ( e.number == 8007 ) { // stop only on cancel
					break;
				}
				this.fileErrors.push( inputFiles[i] );
			}
		}
		
		if ( rememberMaximize != undefined ) {
            app.preferences.maximizeCompatibility = rememberMaximize;
        }

        if ( ! gFoundFileToProcess )
			alert( strNoOpenableFiles );

		// crash on quit when running from bridge
		cameraRawParams.desc = null;
		$.gc();

	}
	
	// using the dialog adjust the active document
	this.AdjustFile = function ( inOutCameraRawParams ) {
        if (app.documents.length > 0) {
            var docRef = app.activeDocument;

            if ( this.params["info"] != "" ) {
                docRef.info.copyrightNotice = this.params["info"];
                docRef.info.copyrighted = CopyrightedType.COPYRIGHTEDWORK;
            }
        }
	}
	
	// I can save in three formats, JPEG, PSD, TIFF
	this.SaveFile = function ( inFileName, inFolderLocation ) {
		var lastDot = inFileName.lastIndexOf( "." );
		if ( lastDot == -1 ) {
			lastDot = inFileName.length;
		}
		var fileNameNoPath = inFileName.substr( 0, lastDot );
		var lastSlash = fileNameNoPath.lastIndexOf( "/" );
		fileNameNoPath = fileNameNoPath.substr( lastSlash + 1, fileNameNoPath.length );
		var filePathNoName = inFileName.substr( 0 , lastSlash );
		if ( this.params["jpeg"] ) {
			if ( ! this.runningFromBridge && this.params["keepstructure"] && ! this.params["saveinsame"] ) {
				var subFolderText = filePathNoName;
				subFolderText = subFolderText.replace( this.params["source"], inFolderLocation);
				subFolderText += "/";
			} else {
				var subFolderText = inFolderLocation + "/JPEG/";
			}
			Folder( subFolderText ).create();
			var historyState = app.activeDocument.activeHistoryState;
			app.activeDocument.flatten();
			app.activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
			RemoveAlphaChannels();
			if ( this.params["converticc"] ) {
				ConvertTosRGBProfile();
			}
			if ( this.params["jpegresize"] ) {
				FitImage( this.params["jpegw"], this.params["jpegh"] ); 
			}
			if ( this.params["runaction"] ) {
				doAction( this.params["action"], this.params["actionset"] );
                app.activeDocument.flatten();
                app.activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
                RemoveAlphaChannels();
			}
			var uniqueFileName = CreateUniqueFileName( subFolderText, fileNameNoPath, ".jpg" );
			if ( ! IsFolderWritable( subFolderText ) ) {
				alert( strCannotWriteToFolder + File( subFolderText ).fsName );
			} else {
				SaveAsJPEG( uniqueFileName, this.params["q"], this.params["icc"] );
			}
			app.activeDocument.activeHistoryState = historyState;
		}
		
		if ( this.params["psd"] ) {
			if ( ! this.runningFromBridge && this.params["keepstructure"] && ! this.params["saveinsame"] ) {
				var subFolderText = filePathNoName;
				subFolderText = subFolderText.replace( this.params["source"], inFolderLocation);
				subFolderText += "/";
			} else {
			var subFolderText = inFolderLocation + "/PSD/";
			}
			Folder( subFolderText ).create();
			var historyState = app.activeDocument.activeHistoryState;
			if ( this.params["psdresize"] ) {
				FitImage( this.params["psdw"], this.params["psdh"] ); 
			}
			if ( this.params["runaction"] ) {
				doAction( this.params["action"], this.params["actionset"] );
			}
			var uniqueFileName = CreateUniqueFileName( subFolderText, fileNameNoPath, ".psd" );
			if ( ! IsFolderWritable( subFolderText ) ) {
				alert( strCannotWriteToFolder + File( subFolderText ).fsName );
			} else {
				SaveAsPSD( uniqueFileName, this.params["icc"] );
			}
			app.activeDocument.activeHistoryState = historyState;
		}
		
		if ( this.params["tiff"] ) {
			if ( ! this.runningFromBridge && this.params["keepstructure"] && ! this.params["saveinsame"] ) {
				var subFolderText = filePathNoName;
				subFolderText = subFolderText.replace( this.params["source"], inFolderLocation);
				subFolderText += "/";
			} else {
			var subFolderText = inFolderLocation + "/TIFF/";
			}
			Folder( subFolderText ).create();
			var historyState = app.activeDocument.activeHistoryState;
			if ( this.params["tiffresize"] ) {
				FitImage( this.params["tiffw"], this.params["tiffh"] ); 
			}
			if ( this.params["runaction"] ) {
				doAction( this.params["action"], this.params["actionset"] );
			}
			var uniqueFileName = CreateUniqueFileName( subFolderText, fileNameNoPath, ".tif" );
			if ( ! IsFolderWritable( subFolderText ) ) {
				alert( strCannotWriteToFolder + File( subFolderText ).fsName );
			} else {
				SaveAsTIFF( uniqueFileName, this.params["icc"], this.params["lzw"] );
			}
			app.activeDocument.activeHistoryState = historyState;
		}
	}
		
	// open a camera raw file returning the camera raw action desc
	this.OpenCameraRaw = function( inOutCameraRawParams, updateCRDesc, inDialogMode ) {
		var keyNull = charIDToTypeID( 'null' );
		var keyAs = charIDToTypeID( 'As  ' );
		var adobeCameraRawID = stringIDToTypeID( "Adobe Camera Raw" );
		var desc = new ActionDescriptor();
		desc.putPath( keyNull, File( inOutCameraRawParams.fileName ) );
		if ( inOutCameraRawParams.desc != undefined && inOutCameraRawParams.useDescriptor &&
		     IsFileOneOfThese( inOutCameraRawParams.fileName, gFilesForCameraRaw ) ) {
			desc.putObject( keyAs, adobeCameraRawID, inOutCameraRawParams.desc );
		}
		if ( inDialogMode == undefined ) {
			inDialogMode = DialogModes.ALL;
			
			// Suppress choose file dialog.
			var overrideOpenID = stringIDToTypeID( 'overrideOpen' );
			desc.putBoolean( overrideOpenID, true );
		}
		var returnDesc = executeAction( charIDToTypeID( 'Opn ' ), desc, inDialogMode );
		if ( returnDesc.hasKey( keyAs ) ) {
			if (updateCRDesc)
				inOutCameraRawParams.desc = returnDesc.getObjectValue( keyAs, adobeCameraRawID );
			if ( returnDesc.hasKey( keyNull ) ) {
				inOutCameraRawParams.fileName = returnDesc.getPath( keyNull ).toString();
				return true;
			}
		}
		return false;
	}
	
	// given a folder return the first valid file in that folder
	this.GetFirstFile = function ( inFolder ) {
		if ( inFolder.length > 0 && inFolder[0] != '.' ) {
			var fileList = Folder( inFolder ).getFiles();
			for ( var i = 0; i < fileList.length; i++) {
				if ( fileList[i] instanceof File && ! fileList[i].hidden &&
					(IsFileOneOfThese( fileList[i], gFileExtensionsToRead ) ||
					 IsFileOneOfTheseTypes( fileList[i], gFileTypesToRead ) ) ) {
					return fileList[i].toString();
				}
			}
		}
		return "";
	}
	
	///////////////////////////////////////////////////////////////////////////
	// Function: ConfigForBridge
	// Usage: see if the Bridge app is running this script
	// Input: gFilesFromBridge is a variable that is defined in photoshop.jsx
	// Return: runningFromBridge and filesFromBridge are initialized
	///////////////////////////////////////////////////////////////////////////
	this.ConfigForBridge = function() {
		if ( typeof( gFilesFromBridge ) != "undefined" ) {
			this.filesFromBridge = gFilesFromBridge;
			if ( this.filesFromBridge.length > 0 ) {
				this.runningFromBridge = true;
			} else {
				this.runningFromBridge = false;
			}
		} else { 
			this.runningFromBridge = false;
			this.filesFromBridge = undefined;
		}
	}

	///////////////////////////////////////////////////////////////////////////
	// Function: ReportErrors
	// Usage: pop the name of the files we had trouble with
	// Input:
	// Return:
	///////////////////////////////////////////////////////////////////////////
	this.ReportErrors = function() {
		if ( this.fileErrors.length ) {
			var message = strCouldNotProcess;
			for ( var i = 0; i < this.fileErrors.length; i++ ) {
				message += File( this.fileErrors[i] ).fsName + "\r";
			}
			alert( message );
		}
	}

	// initialize properties
	this.fileErrors = new Array();

	this.params = this.InitParams();

	this.actionInfo = GetActionSetInfo();
	
	this.ConfigForBridge();
	
}


function SaveAsJPEG( inFileName, inQuality, inEmbedICC ) {
	var jpegOptions = new JPEGSaveOptions();
	jpegOptions.quality = inQuality;
	jpegOptions.embedColorProfile = inEmbedICC;
	app.activeDocument.saveAs( File( inFileName ), jpegOptions );
}
	
function SaveAsPSD( inFileName, inEmbedICC ) {
	var psdSaveOptions = new PhotoshopSaveOptions();
    psdSaveOptions.embedColorProfile = inEmbedICC;
	app.activeDocument.saveAs( File( inFileName ), psdSaveOptions );
}
	
function SaveAsTIFF( inFileName, inEmbedICC, inLZW ) {
	var tiffSaveOptions = new TiffSaveOptions();
    tiffSaveOptions.embedColorProfile = inEmbedICC;
    if ( inLZW ) {
		tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW;
	} else {
		tiffSaveOptions.imageCompression = TIFFEncoding.NONE;
	}	
	app.activeDocument.saveAs( File( inFileName ), tiffSaveOptions );
}

// use the fit image automation plug-in to do this work for me
function FitImage( inWidth, inHeight ) {
	if ( inWidth == undefined || inHeight == undefined ) {
		alert( strWidthAndHeight );
		return;
	}
	var desc = new ActionDescriptor();
	var unitPixels = charIDToTypeID( '#Pxl' );
	desc.putUnitDouble( charIDToTypeID( 'Wdth' ), unitPixels, inWidth );
	desc.putUnitDouble( charIDToTypeID( 'Hght' ), unitPixels, inHeight );
	var runtimeEventID = stringIDToTypeID( "3caa3434-cb67-11d1-bc43-0060b0a13dc4" );	
	executeAction( runtimeEventID, desc, DialogModes.NO );
}

// a very crude xml parser, this reads the "Tag" of the <Tag>Data</Tag>
function ReadHeader( inFile ) {
	var returnValue = "";
	if ( ! inFile.eof ) {
		var c = "";
		while ( c != "<" && ! inFile.eof ) {
			c = inFile.read( 1 );
		}
		while ( c != ">" && ! inFile.eof ) {
			c = inFile.read( 1 );
			if ( c != ">" ) {
				returnValue += c;
			}
		}
	} else {
		returnValue = "end of file";
	}
	return returnValue;
}

// very crude xml parser, this reads the "Data" of the <Tag>Data</Tag>
function ReadData( inFile ) {
	var returnValue = "";
	if ( ! inFile.eof ) {
		var c = "";
		while ( c != "<" && ! inFile.eof ) {
			c = inFile.read( 1 );
			if ( c != "<" ) {
				returnValue += c;
			}
		}
		inFile.seek( -1, 1 );
	}
	return returnValue;
}

///////////////////////////////////////////////////////////////////////////////
// Function: CheckVersion
// Usage: Check our minimum requirement for a host version
// Input: <none> Photoshop should be our target environment but i just look at the version
// Return: throws an error if we do not pass
///////////////////////////////////////////////////////////////////////////////
function CheckVersion() {
	var numberArray = version.split(".");
	if ( numberArray[0] < 9 ) {
		alert( strMustUse );
		throw( strMustUse );
	}
}

///////////////////////////////////////////////////////////////////////////
// Function: StrToIntWithDefault
// Usage: convert a string to a number, first stripping all characters
// Input: string and a default number
// Return: a number
///////////////////////////////////////////////////////////////////////////
function StrToIntWithDefault( s, n ) {
    var onlyNumbers = /[^0-9]/g;
    var t = s.replace( onlyNumbers, "" );
	t = parseInt( t );
	if ( ! isNaN( t ) ) {
        n = t;
    }
    return n;
}

///////////////////////////////////////////////////////////////////////////////
// Function: CreateUniqueFileName
// Usage: Given a folder, filename, and extension, come up with a unique file name
// using a numbering system
// Input: string for folder, fileName, and extension, extension contains the "."
// Return: string for the full path to the unique file
///////////////////////////////////////////////////////////////////////////////
function CreateUniqueFileName( inFolder, inFileName, inExtension ) {
	inFileName = inFileName.replace(/[:\/\\*\?\"\<\>\|]/g, "_");  // '/\:*?"<>|' -> '_'
	var uniqueFileName = inFolder + inFileName + inExtension;
	var fileNumber = 1;
	while ( File( uniqueFileName ).exists ) {
		uniqueFileName = inFolder + inFileName + "_" + fileNumber + inExtension;
		fileNumber++;
	}
	return uniqueFileName;
}

///////////////////////////////////////////////////////////////////////////////
// Function: IsWindowsOS
// Usage: Are we running on the Windows OS?
// Input: <none>
// Return: true if on a Windows
///////////////////////////////////////////////////////////////////////////////
function IsWindowsOS() {
	if ( $.os.search(/windows/i) != -1 ) {
		return true;
	} else {
		return false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: IsMacintoshOS
// Usage: Are we running on the Macintosh OS?
// Input: <none>
// Return: true if on a macintosh
///////////////////////////////////////////////////////////////////////////////
function IsMacintoshOS() {
	if ( $.os.search(/macintosh/i) != -1 ) {
		return true;
	} else {
		return false;
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: RemoveAlphaChannels
// Usage: Remove all of the extra channels from the current document
// Input: <none> (must be an active document)
// Return: <none> activeDocument now has only component channels
///////////////////////////////////////////////////////////////////////////////
function RemoveAlphaChannels() {
	var channels = app.activeDocument.channels;
	var channelCount = channels.length - 1;
	while ( channels[channelCount].kind != ChannelType.COMPONENT ) {
		channels[channelCount].remove();
		channelCount--;
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: ConvertTosRGBProfile
// Usage: Convert to sRGB profile
// Input: <none> (must be an active document)
// Return: activeDocument is now in sRGB profile
///////////////////////////////////////////////////////////////////////////////
function ConvertTosRGBProfile() {
	app.activeDocument.convertProfile("sRGB IEC61966-2.1", Intent.RELATIVECOLORIMETRIC, true, true);
}


///////////////////////////////////////////////////////////////////////////////
// Function: GetScriptNameForXML
// Usage: From my file name, get the XML version
// Input: <none>
// Return: String for XML version of my script, taken from strTitle which is a global
// NOTE: you can't save certain characters in xml, strip them here
// this list is not complete
///////////////////////////////////////////////////////////////////////////////
function GetScriptNameForXML () {
	var scriptNameForXML = new String( strTitle );
	var charsToStrip = Array( " ", "'", "." );
	for (var a = 0; a < charsToStrip.length; a++ )  {
		var nameArray = scriptNameForXML.split( charsToStrip[a] );
		scriptNameForXML = "";
		for ( var b = 0; b < nameArray.length; b++ ) {
			scriptNameForXML += nameArray[b];
		}
	}
	return scriptNameForXML;
}


/////////////////////////////////////////////////////////////////////
// Function: MacXMLFilter
// Input: f, file or folder to check
// Return: true or false, true if file or folder is to be displayed
/////////////////////////////////////////////////////////////////////
function MacXMLFilter( f )
{
	var xmlExtension = ".xml";
	var lCaseName = f.name;
	lCaseName.toLowerCase();
	if ( lCaseName.indexOf( xmlExtension ) == f.name.length - xmlExtension.length )
		return true;
	else if ( f.type == 'TEXT' )
		return true;
	else if ( f instanceof Folder )
		return true;
	else
		return false;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetDefaultParamsFile
// Usage: Find my default settings, this is last ran values
// Input: <none>
// Return: File to my default settings
///////////////////////////////////////////////////////////////////////////////
function GetDefaultParamsFile() {
	return ( new File( app.preferencesFolder + "/" + strTitle + ".xml" ) );
}

///////////////////////////////////////////////////////////////////////////////
// Function: FindDialog
// Usage: From a deeply grouped dialog item go up til you find the parent dialog
// Input: Current dialog item, an actual item or a group
// Return: top parent dialog
///////////////////////////////////////////////////////////////////////////////
function FindDialog( inItem ) {
	var w = inItem;
	while ( 'dialog' != w.type ) {
		if ( undefined == w.parent ) {
			w = null;
			break;
		}
		w = w.parent;
	}
	return w;
}

///////////////////////////////////////////////////////////////////////////////
// Function: GetFilesFromBridge
// Usage: Use this to retrieve the current files from the Bridge application
// Input: <none>
// Return: arary of the current documents that have file paths
// NOTE: I don't use this routine as I run differently only when called from 
// the Bridge, see photoshop.jsx
///////////////////////////////////////////////////////////////////////////////
function GetFilesFromBridge() {
	var fileList;
	if ( BridgeTalk.isRunning( "bridge" ) ) {
		var bt = new BridgeTalk();
		bt.target = "bridge";
		bt.body = "var theFiles = photoshop.getBridgeFileListForAutomateCommand();theFiles.toSource();";
		bt.onResult = function( inBT ) { fileList = eval( inBT.body ); }
		bt.onError = function( inBT ) { fileList = new Array(); }
		bt.send();
		bt.pump();
		$.sleep( 100 );
		var timeOutAt = ( new Date() ).getTime() + 5000;
		var currentTime = ( new Date() ).getTime();
		while ( ( currentTime < timeOutAt ) && ( undefined == fileList ) ) {
			bt.pump();
			$.sleep( 100 );
			currentTime = ( new Date() ).getTime();
		}
	}
	if ( undefined == fileList ) {
		fileList = new Array();
	}
	return fileList; 
}


///////////////////////////////////////////////////////////////////////////////
// Function: GetActionSetInfo
// Usage: walk all the items in the action palette and record the action set
//        names and all the action children
// Input: <none>
// Return: the array of all the ActionData
// Note: This will throw an error during a normal execution. There is a bug
// in Photoshop that makes it impossible to get an acurate count of the number
// of action sets.
///////////////////////////////////////////////////////////////////////////////
function GetActionSetInfo() {
	var actionSetInfo = new Array();
	var setCounter = 1;
  	while ( true ) {
		var ref = new ActionReference();
		ref.putIndex( gClassActionSet, setCounter );
		var desc = undefined;
		try { desc = executeActionGet( ref ); }
		catch( e ) { break; }
		var actionData = new ActionData();
		if ( desc.hasKey( gKeyName ) ) {
			actionData.name = desc.getString( gKeyName );
		}
		var numberChildren = 0;
		if ( desc.hasKey( gKeyNumberOfChildren ) ) {
			numberChildren = desc.getInteger( gKeyNumberOfChildren );
		}
		if ( numberChildren ) {
			actionData.children = GetActionInfo( setCounter, numberChildren );
			actionSetInfo.push( actionData );
		}
		setCounter++;
	}
	return actionSetInfo;
}


///////////////////////////////////////////////////////////////////////////////
// Function: GetActionInfo
// Usage: used when walking through all the actions in the action set
// Input: action set index, number of actions in this action set
// Return: true or false, true if file or folder is to be displayed
///////////////////////////////////////////////////////////////////////////////
function GetActionInfo( setIndex, numChildren ) {
	var actionInfo = new Array();
	for ( var i = 1; i <= numChildren; i++ ) {
		var ref = new ActionReference();
		ref.putIndex( gClassAction, i );
		ref.putIndex( gClassActionSet, setIndex );
		var desc = undefined;
		desc = executeActionGet( ref );
		var actionData = new ActionData();
		if ( desc.hasKey( gKeyName ) ) {
			actionData.name = desc.getString( gKeyName );
		}
		var numberChildren = 0;
		if ( desc.hasKey( gKeyNumberOfChildren ) ) {
			numberChildren = desc.getInteger( gKeyNumberOfChildren );
		}
		actionInfo.push( actionData );
	}
	return actionInfo;
}


///////////////////////////////////////////////////////////////////////////////
// Function: ActionData
// Usage: this could be an action set or an action
// Input: <none>
// Return: a new Object of ActionData
///////////////////////////////////////////////////////////////////////////////
function ActionData() {
	this.name = "";
	this.children = undefined;
	this.toString = function () {
		var strTemp = this.name;
		if ( undefined != this.children ) {
			for ( var i = 0; i < this.children.length; i++ ) {
				strTemp += " " + this.children[i].toString();
			}
		}
		return strTemp;
	}
}

///////////////////////////////////////////////////////////////////////////////
// Function: OpenDocs
// Usage: we want the current open documents that have a path
// Input: <none>
// Return: arary of the current documents that have file paths
// NOTE: We want the current open documents that have a path
// if I do inputFiles = documents then I have a reference
// and if I add documents it also adds them to my inputFiles
// I want to copy the current state
///////////////////////////////////////////////////////////////////////////////
function OpenDocs() {
	var docs = new Array();
	var i = 0;
	var docIndex = 0;
	var alertNonSavedDocs = false;
	var nonSavedDocs = new Array();
	for ( var i = 0; i < app.documents.length; i++ ) {
		try {
			var temp = app.documents[ i ].name;
			docs[ docIndex ] = app.documents[ i ];
			docIndex++;
		}
		catch( e ) {
			if ( e.number == 8103 ) { // this document has not been saved
				alertNonSavedDocs = true;
				nonSavedDocs.push( app.documents[ i ].name );
			} else {
				throw e;
			}
		}
	}
	if ( alertNonSavedDocs ) {
		alert( strMustSaveOpen + "\r" + strFollowing + "\r( " + nonSavedDocs + " )" );
	}
	return docs;
}

///////////////////////////////////////////////////////////////////////////////
// Function: ConditionalModeChangeToRGB
// Usage: Convert the front document to RGB no matter what the original space is
// Input: <none>
// Return: activeDocument is now in RGB mode, this actually is another script now
///////////////////////////////////////////////////////////////////////////////
function ConditionalModeChangeToRGB() {
	var eventModeChange = stringIDToTypeID( "8cba8cd6-cb66-11d1-bc43-0060b0a13dc4" );
	var descSource = new ActionDescriptor();
	var keySourceMode = charIDToTypeID( "SrcM" );
	var list = new ActionList();
	var keyCondition = charIDToTypeID( "Cndn" );
	var keyBitmap = charIDToTypeID( "UBtm" );
	var keyGrayscale = charIDToTypeID( "UGry" );
	var keyDuotone = charIDToTypeID( "UDtn" );
	var keyIndex = charIDToTypeID( "UInd" );
	var keyRGB = charIDToTypeID( "URGB" );
	var keyCMYK = charIDToTypeID( "UCMY" );
	var keyLab = charIDToTypeID( "ULab" );
	var keyMultichannel = charIDToTypeID( "UMlt" );
	list.putEnumerated( keyCondition, keyBitmap );
	list.putEnumerated( keyCondition, keyGrayscale );
	list.putEnumerated( keyCondition, keyDuotone );
	list.putEnumerated( keyCondition, keyIndex );
	list.putEnumerated( keyCondition, keyRGB );
	list.putEnumerated( keyCondition, keyCMYK );
	list.putEnumerated( keyCondition, keyLab );
	list.putEnumerated( keyCondition, keyMultichannel );
	descSource.putList( keySourceMode, list );
	var keyDestination = charIDToTypeID( "DstM" );
	var descDest = new ActionDescriptor();
	var keyRGB = charIDToTypeID( "RGBM" );
	descSource.putObject( keyDestination, keyRGB, descDest );
	executeAction( eventModeChange, descSource, DialogModes.NO );
}

///////////////////////////////////////////////////////////////////////////////
// Function: FindAllFiles
// Usage: Find all the files in the given folder recursively
// Input: srcFolder is a string to a folder
//		  destArray is an Array of File objects
// Return: Array of File objects, same as destArray
///////////////////////////////////////////////////////////////////////////////
function FindAllFiles( srcFolderStr, destArray ) {
	var fileFolderArray = Folder( srcFolderStr ).getFiles();

	for ( var i = 0; i < fileFolderArray.length; i++ ) {
		var fileFoldObj = fileFolderArray[i];
		if ( fileFoldObj instanceof File ) {
			destArray.push( fileFoldObj );
		} else { // folder
			FindAllFiles( fileFoldObj.toString(), destArray );
		}
	}

	return destArray;
}

///////////////////////////////////////////////////////////////////////////////
// Function: NumericEditKeyboardHandler
// Usage: Do not allow anything except for numbers 0-9
// Input: ScriptUI keydown event
// Return: <nothing> key is rejected and beep is sounded if invalid
///////////////////////////////////////////////////////////////////////////////
function NumericEditKeyboardHandler (event) {
    try {
        var keyIsOK = KeyIsNumeric (event) || 
		              KeyIsDelete (event) || 
					  KeyIsLRArrow (event) ||
					  KeyIsTabEnterEscape (event);
					  
        if (! keyIsOK) {
            //    Bad input: tell ScriptUI not to accept the keydown event
            event.preventDefault();
            /*    Notify user of invalid input: make sure NOT
                to put up an alert dialog or do anything which
                requires user interaction, because that
                interferes with preventing the 'default'
                action for the keydown event */
            app.beep();
        }
    }
    catch (e) {
        ; // alert ("Ack! bug in NumericEditKeyboardHandler: " + e);
    }
}


//    key identifier functions
function KeyHasModifier (event) {
    return event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
}

function KeyIsNumeric (event) {
    return  (event.keyName >= '0') && (event.keyName <= '9') && ! KeyHasModifier (event);
}

function KeyIsDelete (event) {
    //    Shift-delete is ok
    return ((event.keyName == 'Backspace') || (event.keyName == 'Delete')) && ! (event.ctrlKey);
}

function KeyIsLRArrow (event) {
    return ((event.keyName == 'Left') || (event.keyName == 'Right')) && ! (event.altKey || event.metaKey);
}

function KeyIsTabEnterEscape (event) {
	return event.keyName == 'Tab' || event.keyName == 'Enter' || event.keyName == 'Escape';
}

// End Image Processor.jsx
