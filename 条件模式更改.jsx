// 02/06/2007 14:52
// (c) Copyright 2007 Adobe Systems, Inc. All rights reserved.
// Written by Ed Rose
// based on the ADM Mode Change by Joe Ault from 1998

/*
@@@BUILDINFO@@@ Conditional Mode Change.jsx 1.0.0.7
*/

/* Special properties for a JavaScript to enable it to behave like an automation plug-in, the variable name must be exactly 
   as the following example and the variables must be defined in the top 10000 characters of the file

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/ModeChange/Name=Conditional Mode Change...</name>
<menu>automate</menu>
<about>$$$/JavaScripts/ModeChange/About=Conditional Mode Change   Version 10.0   By Quality Process^r^rCopyright 2007 Adobe Systems Incorporated. All rights reserved.^r^rConverts a document to a new color mode based on the current mode.</about>
<enableinfo>true</enableinfo>
<eventid>8cba8cd6-cb66-11d1-bc43-0060b0a13dc4</eventid>
<terminology><![CDATA[<<< /Version 1 \
                       /Events << \
                          /8cba8cd6-cb66-11d1-bc43-0060b0a13dc4 [($$$/AdobePlugin/ConditionalModeChange/Name=Conditional Mode Change)  /imageResource << \
                            /keySourceMode [($$$/AdobePlugin/ConditionalModeChange/SourceMode=source mode(s)) /typeSourceMode] \
                            /keyDestinationMode [($$$/AdobePlugin/ConditionalModeChange/TargetMode=target mode) /typeClass] \
                            /keyMerge [($$$/AdobePlugin/ConditionalModeChange/Merge=merge) /typeBoolean] \
                           >>] \
                        >> \
                       /Enums << \
            		     /typeSourceMode << \
                           /enumUIBitmap ($$$/AdobePlugin/ConditionalModeChange/Bitmap=Bitmap) \
                           /enumUIGrayscale ($$$/AdobePlugin/ConditionalModeChange/Grayscale=Grayscale) \
                           /enumUIDuotone ($$$/AdobePlugin/ConditionalModeChange/Duotone=Duotone) \
                           /enumUIIndexed ($$$/AdobePlugin/ConditionalModeChange/Indexed=Indexed) \
                           /enumUIRGB ($$$/AdobePlugin/ConditionalModeChange/RGB=RGB) \
                           /enumUICMYK ($$$/AdobePlugin/ConditionalModeChange/CMYK=CMYK) \
                           /enumUILab ($$$/AdobePlugin/ConditionalModeChange/Lab=Lab) \
                           /enumUIMultichannel ($$$/AdobePlugin/ConditionalModeChange/Multichannel=Multichannel) \
                         >> \
                      >>> ]]></terminology>
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

var gScriptResult;

// ok and cancel button
var okButtonID = 1;
var cancelButtonID = 2;

// the main routine
// the ModeChange object does most of the work
try { 

	GlobalVariables();
	CheckVersion();
	
	// create our default params
	var changeInfo = new ChangeInfo();
	
	var gMC = new ModeChange();

	if ( DialogModes.ALL == app.playbackDisplayDialogs ) {
		gMC.CreateDialog();
		if (cancelButtonID == gMC.RunDialog() ) { // <- this calls MCExecute
		    gScriptResult = 'cancel';
		}
	} else {
		if ( gMC.InitVariables() ) { // only proceed if document to change
			if ( ! MCExecute() ) {
			    gScriptResult = 'cancel';
			}
		} else {
		    gScriptResult = 'cancel';
		}
	}
	
	if (!rollItBack) { // rollItBack is set false when MCExecute correctly happens
		SaveOffParameters(changeInfo);
	}
}

// Lot's of things can go wrong
// Give a generic alert and see if they want the details
catch( e ) {
    if ( DialogModes.NO != app.playbackDisplayDialogs ) {
        alert( e + " : " + e.line );
    }
    gScriptResult = 'cancel';
}

// restore the dialog modes
app.displayDialogs = gSaveDialogMode;

gScriptResult;

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

// created via new ChangeInfo(), above
function SaveOffParameters(changeInfo) {

	// save off our last run parameters
	var d = ChangeInfoToDescriptor(changeInfo);
	d.putString( app.charIDToTypeID( 'Msge' ), strMessage );
	app.putCustomOptions("85d5fff3-b16f-432c-96e6-6dbbedbbdcda", d);

	app.playbackDisplayDialogs = DialogModes.ALL;

	var dd = ChangeInfoToDescriptor(changeInfo);
	dd.putString( app.charIDToTypeID( 'Msge' ), strMessage );
	app.playbackParameters = dd;
}


function GlobalVariables() {

	// a version for possible expansion issues
	gVersion = 1;
	
	// remember the dialog modes
	gSaveDialogMode = app.displayDialogs;
	app.displayDialogs = DialogModes.NO;

	//
	// all the strings that need to be localized
	//
	// title of app
	strTitle = localize( "$$$/JavaScript/ModeChange/Title=Conditional Mode Change" );
	// buttons
	strButtonOK = localize("$$$/JavaScripts/ModeChange/OK=OK");
	strButtonCancel = localize("$$$/JavaScripts/ModeChange/Cancel=Cancel");
	strButtonAll = localize("$$$/JavaScripts/ModeChange/All=&All");
	strButtonNone = localize("$$$/JavaScripts/ModeChange/None=&None");
	// panel strings	
	strSrcMode = localize("$$$/JavaScripts/ModeChange/SrcMode=Source Mode");
	strTargMode = localize("$$$/JavaScripts/ModeChange/TargetMode=Target Mode");
	// checkbox strings
	strChkBitmap  = localize("$$$/JavaScripts/ModeChange/ChkBitmap=&Bitmap");
	strChkGraysc  = localize("$$$/JavaScripts/ModeChange/ChkGraysc=&Grayscale");
	strChkDuotone = localize("$$$/JavaScripts/ModeChange/ChkDuotone=&Duotone");
	strChkIxClr   = localize("$$$/JavaScripts/ModeChange/ChkIxClr=&Indexed Color");
	strChkRGB     = localize("$$$/JavaScripts/ModeChange/ChkRGB=&RGB Color");
	strChkCMYK = localize("$$$/JavaScripts/ModeChange/ChkCMYK=&CMYK Color");
	strChkLab = localize("$$$/JavaScripts/ModeChange/ChkLab=&Lab Color");
	strChkMChan = localize("$$$/JavaScripts/ModeChange/ChkMChan=M&ultichannel");
	// popup strings
	strPopBitmap  = localize("$$$/JavaScripts/ModeChange/PopBitmap=Bitmap");
	strPopGraysc  = localize("$$$/JavaScripts/ModeChange/PopGraysc=Grayscale");
	strPopDuotone = localize("$$$/JavaScripts/ModeChange/PopDuotone=Duotone");
	strPopIxClr   = localize("$$$/JavaScripts/ModeChange/PopIxClr=Indexed Color");
	strPopRGB     = localize("$$$/JavaScripts/ModeChange/PopRGB=RGB Color");
	strPopCMYK = localize("$$$/JavaScripts/ModeChange/PopCMYK=CMYK Color");
	strPopLab = localize("$$$/JavaScripts/ModeChange/PopLab=Lab Color");
	strPopMChan = localize("$$$/JavaScripts/ModeChange/PopMChan=Multichannel");	
	// label
	strModeLbl = localize("$$$/JavaScripts/ModeChange/ModeLbl=&Mode:");
	// alert dialog strings
	strTextNeedFile = localize("$$$/JavaScripts/ModeChange/NeedFile=You must have a file selected before using Conditional Mode Change");
	strTextModeMatch = localize("$$$/JavaScripts/ModeChange/ModeMatch=Mode of the document does not match any selected Source Modes.");
	strTextOneSrcMode = localize("$$$/JavaScripts/ModeChange/OneSrcMode=At least one Source Mode must be selected.");
	strTextErrRetHist = localize("$$$/JavaScripts/ModeChange/ErrRetHist=Error retrieving history preferences.");
	strTextErrSetHist = localize("$$$/JavaScripts/ModeChange/ErrSetHist=Error setting history preferences.");
	strTextErrDocAttr = localize("$$$/JavaScripts/ModeChange/ErrDocAttr=Error retrieving document attributes.  No conversion performed.");
	strTextErrIntCnv8 = localize("$$$/JavaScripts/ModeChange/ErrIntCnv8=Error with intermediate conversion to 8-bit color.");
	strTextErrCvtRGB = localize("$$$/JavaScripts/ModeChange/ErrCvtRGB=Error with conversion to RGB color mode.");
	strTextErrCvtGray = localize("$$$/JavaScripts/ModeChange/ErrCvtGray=Error with conversion to Grayscale mode.");
	strTextErrCvtTarg = localize("$$$/JavaScripts/ModeChange/ErrCvtTarg=Error with converting to Target Mode.");
	strTextModeSame = localize("$$$/JavaScripts/ModeChange/ModeSame=Mode of the document is the same as the Target Mode.  No conversion performed.");
	strTextErrIntCnv16 = localize("$$$/JavaScripts/ModeChange/ErrIntCnv16=Error with intermediate conversion to 16-bit color.");
	strMessage = localize("$$$/JavaScripts/ModeChange/Message=Conditional Mode Change action settings");
	strMustUse = localize( "$$$/JavaScripts/ImageProcessor/MustUse=You must use Photoshop CS 2 or later to run this script!" );

    // bit flags for checkboxes
	FLAG_BITMAP = false;
	FLAG_GRAYSCALE = false;
	FLAG_DUOTONE = false;
	FLAG_INDEXED = false;
	FLAG_RGB = true;
	FLAG_CMYK = false;
	FLAG_LAB = false;
	FLAG_MULTICHANNEL = false;

    // constants
	FLATTEN_UNUSED = 99;	// flattening unspecified
	DEPTH_UNSET = 99;		// depth of the document unset
	classNull = charIDToTypeID( 'null' ); // ain't nothing here (error)
	classBitmapMode = charIDToTypeID( 'BtmM' );
	classGrayscaleMode = charIDToTypeID( 'Grys' );
	classDuotoneMode = charIDToTypeID( 'DtnM' );
	classIndexedColorMode = charIDToTypeID( 'IndC' );
	classRGBColorMode = charIDToTypeID( 'RGBM' );
	classCMYKColorMode = charIDToTypeID( 'CMYM' );
	classLabColorMode = charIDToTypeID( 'LbCM' );
	classMultichannelMode = charIDToTypeID( 'MltC' );
	enumUIMultichannel = charIDToTypeID( 'UMlt' );
    enumUILab = charIDToTypeID( 'ULab' );
	enumUICMYK = charIDToTypeID( 'UCMY' );
	enumUIRGB = charIDToTypeID( 'URGB' );
	enumUIIndexed = charIDToTypeID( 'UInd' );
	enumUIDuotone = charIDToTypeID( 'UDtn' );
	enumUIGrayscale = charIDToTypeID( 'UGry' );
	enumUIBitmap = charIDToTypeID( 'UBtm' );
    keySourceMode = charIDToTypeID( 'SrcM' );
	typeSourceMode = charIDToTypeID( 'Cndn' );
	keyDestinationMode = charIDToTypeID( 'DstM' );
	keyMerge = charIDToTypeID( 'Mrge' );

    // variables
	rollItBack = true;		// flag to tell whether to roll back (assumed true until valid MCExecute)

}


// the main class
function ModeChange() {

	this.CreateDialog = function() {
	
		var res =
			"dialog { \
				ModesOKCancel: Group { orientation: 'row', \
					STModes: Group { orientation: 'column',  \
						src: Panel { orientation: 'row', \
							text: '" + strSrcMode +"', \
							L1: Group { orientation: 'column', \
								bmp: Checkbox { text:'" + strChkBitmap +"', alignment:'left'}, \
								gry: Checkbox { text:'" + strChkGraysc + "', alignment:'left'}, \
								duo: Checkbox { text:'" + strChkDuotone + "', alignment:'left'}, \
								ixc: Checkbox { text:'" + strChkIxClr + "', alignment:'left'}, \
								AORN: Group { orientation: 'row', \
									all: Button { text:'" + strButtonAll +"', properties:{name:'all'} }, \
									non: Button { text:'" + strButtonNone +"', properties:{name:'none'} } \
								} \
							}, \
							L2: Group { orientation: 'column', alignment: 'top', \
								rgb: Checkbox { text:'" + strChkRGB + "', alignment:'left'}, \
								cmy: Checkbox { text:'" + strChkCMYK + "', alignment:'left'}, \
								lab: Checkbox { text:'" + strChkLab + "', alignment:'left'}, \
								mch: Checkbox { text:'" + strChkMChan + "', alignment:'left'} \
							} \
						}, \
						targ: Panel { orientation: 'column', \
							text: '" + strTargMode +"', \
							w: Group { orientation: 'row', \
								mod: StaticText { text:'" + strModeLbl +"' }, \
								drp: DropDownList {alignment:'left'} \
							}, \
						}, \
					}, \
					buttons: Group { orientation: 'column', alignment: 'top', \
						okBtn: Button { text:'" + strButtonOK +"', properties:{name:'ok'} }, \
						cancelBtn: Button { text:'" + strButtonCancel + "', properties:{name:'cancel'} } \
					} \
				} \
			}";

		// create the main dialog window, this holds all our data
		this.dlgMain = new Window(res,strTitle);
		
		// create a shortcut for easier typing
		var d = this.dlgMain;
                
		var drop = d.ModesOKCancel.STModes.targ.w.drp; // for easier typing
		drop.add('item',strPopBitmap); // 0
		drop.add('item',strPopGraysc); // 1
		drop.add('item',strPopDuotone); // 2
		drop.add('item',strPopIxClr); // 3
		drop.add('item',strPopRGB); // 4
		drop.add('item',strPopCMYK); // 5
		drop.add('item',strPopLab); // 6
		drop.add('item',strPopMChan); // 7
		drop.selection = drop.items[5]; // CMYK
		changeInfo.destinationMode = 5;
		changeInfo.destMode = IndexToMode(changeInfo.destinationMode);
		d.ModesOKCancel.STModes.src.L2.rgb.value = true;
				
		d.defaultElement = d.ModesOKCancel.buttons.okBtn;
		d.cancelElement = d.ModesOKCancel.buttons.cancelBtn;
	} // end of CreateDialog
	
	// initialize variables of dialog
	// return false if no document to change, true if found document to change
	this.InitVariables = function() {
    				
		// look for last used params via Photoshop registry, getCustomOptions will throw if none exist
		try {
			var desc = app.getCustomOptions("85d5fff3-b16f-432c-96e6-6dbbedbbdcda");
			DescriptorToChangeInfo(changeInfo, desc);
		}
		catch(e) {
			// it's ok if we don't have any options, continue with defaults
		}

		// see if I am getting descriptor parameters
		DescriptorToChangeInfo(changeInfo, app.playbackParameters);
		
		// make internal state reflect saved parameters
		changeInfo.destMode = IndexToMode(changeInfo.destinationMode);
		FLAG_BITMAP = changeInfo.flagBITMAP;
		FLAG_GRAYSCALE = changeInfo.flagGRAYSCALE;
		FLAG_DUOTONE = changeInfo.flagDUOTONE;
		FLAG_INDEXED = changeInfo.flagINDEXED;
		FLAG_RGB = changeInfo.flagRGB;
		FLAG_CMYK = changeInfo.flagCMYK;
		FLAG_LAB = changeInfo.flagLAB;
		FLAG_MULTICHANNEL = changeInfo.flagMULTICHANNEL;

		// make sure to do this after get parameters
		if (app.documents.length <= 0) // count of documents viewed
		{
			if ( DialogModes.NO != app.playbackDisplayDialogs ) {
				alert(strTextNeedFile);
			}
			return false; // error, don't proceed
		}
		
		if ( DialogModes.ALL == app.playbackDisplayDialogs ) {
			var d = this.dlgMain;
			var drop = d.ModesOKCancel.STModes.targ.w.drp; // for easier typing
			
			// make dialog reflect saved parameters
			drop.selection = drop.items[changeInfo.destinationMode];
			d.ModesOKCancel.STModes.src.L1.bmp.value = changeInfo.flagBITMAP;
			d.ModesOKCancel.STModes.src.L1.gry.value = changeInfo.flagGRAYSCALE;
			d.ModesOKCancel.STModes.src.L1.duo.value = changeInfo.flagDUOTONE;
			d.ModesOKCancel.STModes.src.L1.ixc.value = changeInfo.flagINDEXED;
			d.ModesOKCancel.STModes.src.L2.rgb.value = changeInfo.flagRGB;
			d.ModesOKCancel.STModes.src.L2.cmy.value = changeInfo.flagCMYK;
			d.ModesOKCancel.STModes.src.L2.lab.value = changeInfo.flagLAB;
			d.ModesOKCancel.STModes.src.L2.mch.value = changeInfo.flagMULTICHANNEL;
		}
		return true; // all is good, continue
	}

	// routine for running the dialog and it's interactions
	this.RunDialog = function () {	
		var d = this.dlgMain;

		// in case hit cancel button, don't close
		d.ModesOKCancel.buttons.cancelBtn.onClick = function() { 
			var dToCancel = FindDialog( this );
			dToCancel.close( cancelButtonID );
			rollItBack = true;
		}
		
		// nothing for now
		d.onShow = function() {
			
		}
		
		// destination dropdown handler
         d.ModesOKCancel.STModes.targ.w.drp.onChange = function() {
         	var theSelection = this.selection.text;
			var theSelectionIndex = this.selection.index;
              if (theSelection != null) { // only change if selection made
				changeInfo.destinationMode = theSelectionIndex;
				changeInfo.destMode = IndexToMode(changeInfo.destinationMode);
			  }
         }
		
		// the source mode buttons
		d.ModesOKCancel.STModes.src.L1.bmp.onClick = function() {
			FLAG_BITMAP = ! FLAG_BITMAP;
			changeInfo.flagBITMAP = FLAG_BITMAP;
		}
		d.ModesOKCancel.STModes.src.L1.gry.onClick = function() {
			FLAG_GRAYSCALE = ! FLAG_GRAYSCALE;
			changeInfo.flagGRAYSCALE = FLAG_GRAYSCALE;
		}
		d.ModesOKCancel.STModes.src.L1.duo.onClick = function() {
			FLAG_DUOTONE = ! FLAG_DUOTONE;
			changeInfo.flagDUOTONE = FLAG_DUOTONE;
		}
		d.ModesOKCancel.STModes.src.L1.ixc.onClick = function() {
			FLAG_INDEXED = ! FLAG_INDEXED;
			changeInfo.flagINDEXED = FLAG_INDEXED;
		}
		d.ModesOKCancel.STModes.src.L2.rgb.onClick = function() {
			FLAG_RGB = ! FLAG_RGB;
			changeInfo.flagRGB = FLAG_RGB;
		}
		d.ModesOKCancel.STModes.src.L2.cmy.onClick = function() {
			FLAG_CMYK = ! FLAG_CMYK;
			changeInfo.flagCMYK = FLAG_CMYK;
		}
		d.ModesOKCancel.STModes.src.L2.lab.onClick = function() {
			FLAG_LAB = ! FLAG_LAB;
			changeInfo.flagLAB = FLAG_LAB;
		}
		d.ModesOKCancel.STModes.src.L2.mch.onClick = function() {
			FLAG_MULTICHANNEL = ! FLAG_MULTICHANNEL;
			changeInfo.flagMULTICHANNEL = FLAG_MULTICHANNEL;
		}
		
		// all or nothing
		d.ModesOKCancel.STModes.src.L1.AORN.all.onClick = function() {
			var dThis = FindDialog( this );
			SetButtons(dThis, true)
		}
		
		d.ModesOKCancel.STModes.src.L1.AORN.non.onClick = function() {
			var dThis = FindDialog( this );
			SetButtons(dThis, false)
		}
		
		// hit OK, do mode convert
		d.ModesOKCancel.buttons.okBtn.onClick = function () {	
			var dThis = FindDialog( this );
			if (gMC.saveDest != changeInfo.destMode && changeInfo.modeObject != undefined ) {
			    changeInfo.modeObject = undefined;
			    changeInfo.modeClass = undefined;
			}
			var OKflag = MCExecute();
			if (OKflag) {
				dThis.close(okButtonID);
			}
		}
	
		if (!this.InitVariables())
		{
			return true; // no document to change, kick out now
		}

		// remember our starting mode
		this.saveDest = changeInfo.destMode;

		// give the hosting app the focus before showing the dialog
		app.bringToFront();

		this.dlgMain.center();
		
		return d.show();

	}
}

// set all buttons on or off
function SetButtons(d, OnOrOff) {

	FLAG_BITMAP = OnOrOff;
	changeInfo.flagBITMAP = FLAG_BITMAP;
	d.ModesOKCancel.STModes.src.L1.bmp.value = OnOrOff;
	FLAG_GRAYSCALE = OnOrOff;
	changeInfo.flagGRAYSCALE = FLAG_GRAYSCALE;
	d.ModesOKCancel.STModes.src.L1.gry.value = OnOrOff;
	FLAG_DUOTONE = OnOrOff;
	changeInfo.flagDUOTONE = FLAG_DUOTONE;
	d.ModesOKCancel.STModes.src.L1.duo.value = OnOrOff;
	FLAG_INDEXED = OnOrOff;
	changeInfo.flagINDEXED = FLAG_INDEXED;
	d.ModesOKCancel.STModes.src.L1.ixc.value = OnOrOff;
	FLAG_RGB = OnOrOff;
	changeInfo.flagRGB = FLAG_RGB;
	d.ModesOKCancel.STModes.src.L2.rgb.value = OnOrOff;
	FLAG_CMYK = OnOrOff;
	changeInfo.flagCMYK = FLAG_CMYK;
	d.ModesOKCancel.STModes.src.L2.cmy.value = OnOrOff;
	FLAG_LAB = OnOrOff;
	changeInfo.flagLAB = FLAG_LAB;
	d.ModesOKCancel.STModes.src.L2.lab.value = OnOrOff;
	FLAG_MULTICHANNEL = OnOrOff;
	changeInfo.flagMULTICHANNEL = FLAG_MULTICHANNEL;
	d.ModesOKCancel.STModes.src.L2.mch.value = OnOrOff;
}

function MCExecute() {

	var docRef = app.activeDocument; // for easier typing
	
	var numChannels = docRef.componentChannels.length;		// number of channels in the source doc
	var doConversion = false;		// do the mode conversion?
	var preConvertRGB = false;		// convert to image to RGB before final conversion?
	var preConvertGray = false;		// convert to grayscale before final?
	var preConvert8bit = false;		// convert to 8-bit color before final?
	var preConvert16bit = false;	// convert to 16-bit color before final?
	var depth = 8;					// bit-depth of the current doc
	var userCancel = false;
	var hasErrorMessage = false;
	var errorMessage = "";
	var keyTo = charIDToTypeID( 'T   ' );
	var eventConvertMode = charIDToTypeID( 'CnvM' );
	var keyDepth = charIDToTypeID( 'Dpth' );
	
	
	var colorDepthType = docRef.bitsPerChannel; // Retrieve the color depth
	var channels = docRef.channels; // all channels in the documentl
	var docMode = docRef.mode; // Retrieve the mode (DocumentMode.RGB, etc)	
	
	// get bits per channel
	if (colorDepthType == BitsPerChannelType.EIGHT) {
		depth = 8;
	} else if (colorDepthType == BitsPerChannelType.ONE) {
		depth = 1;
	} else if (colorDepthType == BitsPerChannelType.SIXTEEN) {
		depth = 16;
	} else if (colorDepthType == BitsPerChannelType.THIRTYTWO) {
		depth = 32;
	}
	depth *= numChannels;  // number of bits per pixel
	var targetClass = ModeUIToClass(changeInfo.destMode);
	if (targetClass == classNull) {
		return -1;
	}
	
	// if the doc is already in the destination mode, don't bother
	if (changeInfo.destMode == docMode)
	{
        if ( DialogModes.NO != app.playbackDisplayDialogs ) {
	    	alert(strTextModeSame);
	    }
		return false;
	}
	
	// tell them they have to supply at least one input mode
	if (!FLAG_BITMAP && !FLAG_GRAYSCALE && !FLAG_DUOTONE && !FLAG_INDEXED
		&& !FLAG_RGB && !FLAG_CMYK && !FLAG_LAB && !FLAG_MULTICHANNEL)
	{
		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
            alert(strTextOneSrcMode);
        }
		return false;
	}

	
	// See if the source doc mode matches any of our source switches
	switch(docMode)
	{
		case DocumentMode.BITMAP: 
			if (FLAG_BITMAP) 
			{
				doConversion = true; 
				preConvertGray = true;	
			}
			break;
				
		case DocumentMode.GRAYSCALE: 
			if (FLAG_GRAYSCALE) 
			{
				doConversion = true;
			}
			break;
				
			case DocumentMode.DUOTONE: 
			if (FLAG_DUOTONE) 
				doConversion = true; 
			break;
				
			case DocumentMode.INDEXEDCOLOR:
			if (FLAG_INDEXED)
			{
				doConversion = true;
				if (changeInfo.destMode == DocumentMode.BITMAP || changeInfo.destMode == DocumentMode.DUOTONE)
					preConvertGray = true;
				else if (changeInfo.destMode == DocumentMode.MULTICHANNEL)
					preConvertRGB = true;
			}
			break;
				
			case DocumentMode.RGB:
			if (FLAG_RGB)
			{
				doConversion = true;
				if (changeInfo.destMode == DocumentMode.BITMAP || changeInfo.destMode == DocumentMode.DUOTONE)
					preConvertGray = true;
			}
			break;
				
			case DocumentMode.CMYK:
			if (FLAG_CMYK)
			{
				doConversion = true;
				if (changeInfo.destMode == DocumentMode.BITMAP || changeInfo.destMode == DocumentMode.DUOTONE)
					preConvertGray = true;
				else if (changeInfo.destMode == DocumentMode.INDEXEDCOLOR)
					preConvertRGB = true;
			}
			break;
			case DocumentMode.LAB:
			if (FLAG_LAB)
			{
				doConversion = true;
				if (changeInfo.destMode == DocumentMode.BITMAP || changeInfo.destMode == DocumentMode.DUOTONE)
					preConvertGray = true;
				else if (changeInfo.destMode == DocumentMode.INDEXEDCOLOR)
					preConvertRGB = true;
			}
			break;
			case DocumentMode.MULTICHANNEL:
			if (FLAG_MULTICHANNEL)
			{
				doConversion = true;
					
				// if we don't have at least 3 channels, we're going to grayscale regardless
				if (numChannels < 3)
					preConvertGray = true;
				else
				{
					if (changeInfo.destMode == DocumentMode.DUOTONE)
						preConvertGray = true;
					else if (changeInfo.destMode == DocumentMode.CMYK) 
					{
						if (numChannels < 4)
							preConvertRGB = true;
					}
						
					else if (changeInfo.destMode == DocumentMode.INDEXEDCOLOR)
					{
						preConvertRGB = true;
					}
				}
			}
			break;
		}

	// only convert depth if we have to
	if (depth >= 16 && 
		(changeInfo.destMode == DocumentMode.BITMAP
		|| changeInfo.destMode == DocumentMode.DUOTONE 
		|| changeInfo.destMode == DocumentMode.INDEXEDCOLOR) )
		preConvert8bit = true;

	if (!preConvert8bit && depth >= 32 &&
		(changeInfo.destMode == DocumentMode.CMYK
		|| changeInfo.destMode == DocumentMode.LAB
		|| changeInfo.destMode == DocumentMode.MULTICHANNEL) )
		preConvert16bit = true;

	// condition wasn't met, so just return
	if (!doConversion) {
		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
            alert(strTextModeMatch);
        }
		return false; // fauxSPHandledErr;
	}	
	
	var historyState = app.activeDocument.activeHistoryState; // remember current state
	rollItBack = false;
		
	// Force the image to 8-bit mode, if required
	// always do this first
	if (preConvert8bit) {
		var modeDesc8Bit = new ActionDescriptor();
		modeDesc8Bit.putInteger(keyDepth, 8);
		var returnDesc = executeAction( eventConvertMode, modeDesc8Bit, DialogModes.NO );
		if (returnDesc == classNull) {
			if ( DialogModes.NO != app.playbackDisplayDialogs ) {
                alert(strTextErrIntCnv8);
            }
			rollItBack = true;
    		return false;
		}
	}
	
	
	// always do this second
	if (preConvert16bit) {
		var modeDesc16Bit = new ActionDescriptor();
		modeDesc16Bit.putInteger(keyDepth, 16);
		var returnDesc = executeAction( eventConvertMode, modeDesc16Bit, DialogModes.NO );
		if (returnDesc == classNull) {
    		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
    		    alert(strTextErrIntCnv16);
    		}
			rollItBack = true;
    		return false;
		}
	}

	
	// Force the image into RGB, if required
	if (preConvertRGB) {
		var modeDescRGB = new ActionDescriptor();
		modeDescRGB.putClass(keyTo, classRGBColorMode);
		var returnDesc = executeAction( eventConvertMode, modeDescRGB, DialogModes.NO );
		if (returnDesc == classNull) {
    		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
    		    alert(strTextErrCvtRGB);
    		}
			rollItBack = true;
    		return false;
		}
	}
	
	// Force the image into grayscale, if required
	if (preConvertGray) {
		var modeDescGray = new ActionDescriptor();
		modeDescGray.putClass(keyTo, classGrayscaleMode);
		var returnDesc = executeAction( eventConvertMode, modeDescGray, DialogModes.NO );
		if (returnDesc == classNull) {
    		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
    		    alert(strTextErrCvtGray);
    		}
			rollItBack = true;
    		return false;
		}
	}
	
	var modeDesc = new ActionDescriptor();
	if (changeInfo.modeObject != undefined) {
		modeDesc.putObject(keyTo, changeInfo.modeClass, changeInfo.modeObject); 
	}
	else {
		modeDesc.putClass(keyTo, targetClass);
	}
	if (changeInfo.flatten != FLATTEN_UNUSED) {
		modeDesc.putBoolean(keyMerge, changeInfo.flatten);
	}
	var cancelFlag = false;
	try { 
	  var returnDesc = executeAction( eventConvertMode, modeDesc, app.playbackDisplayDialogs );
	}
	catch (e) {
		rollItBack = true;
		cancelFlag = true; // assume cancel
	}
	if (returnDesc == classNull) { // error, no returned descriptor (TO DO: IS THIS CORRECT?)
        if ( DialogModes.NO != app.playbackDisplayDialogs ) {		
            alert(strTextErrCvtTarg);
        }
		rollItBack = true;
	}
	else if (!rollItBack) { // if completed successfully...
		// check for error message in returned descriptor
		var keyMessage = charIDToTypeID( 'Msge' );
		var messageStr = "";
		var hasErrorMessage = returnDesc.hasKey( keyMessage);
		if (hasErrorMessage) {
			messageStr = returnDesc.getString( keyMessage );
			if ( DialogModes.NO != app.playbackDisplayDialogs ) {
			    alert(messageStr);
			}
			rollItBack = true;
		}
		else if ( returnDesc.hasKey( keyTo ) ) {
			changeInfo.modeObject = returnDesc.getObjectValue(keyTo);
			changeInfo.modeClass = returnDesc.getObjectType(keyTo);
		}
	}
	// check for cancel, error
	if (rollItBack) {
		app.activeDocument.activeHistoryState = historyState; // rollback state of document
		return cancelFlag; // kill dialog box if cancel
	}
	return true;
}


function IndexToMode(modeIndex) {
	var	uiMode = 0;
	switch (modeIndex) {
		case 0: uiMode = DocumentMode.BITMAP; break;
		case 1: uiMode = DocumentMode.GRAYSCALE; break;
		case 2: uiMode = DocumentMode.DUOTONE; break;
		case 3: uiMode = DocumentMode.INDEXEDCOLOR; break;
		case 4: uiMode = DocumentMode.RGB; break;
		case 5: uiMode = DocumentMode.CMYK; break;
		case 6: uiMode = DocumentMode.LAB; break;
		case 7: uiMode = DocumentMode.MULTICHANNEL; break;	
	}
	return(uiMode);
}



function ClassToIndex(classMode) {
	var	uiMode = 0;
	switch (classMode) {
		case classBitmapMode: uiMode = 0; break;
		case classGrayscaleMode: uiMode = 1; break;
		case classDuotoneMode: uiMode = 2; break;
		case classIndexedColorMode: uiMode = 3; break;
		case classRGBColorMode: uiMode = 4; break;
    	case classCMYKColorMode: uiMode = 5; break;
		case classLabColorMode: uiMode = 6; break;
		case classMultichannelMode: uiMode = 7; break;	
	}
	return(uiMode);
}



function ModeUIToClass(uiMode) {
	var	actionType = classNull;
	switch (uiMode) {
		case DocumentMode.BITMAP: actionType = classBitmapMode; break;
		case DocumentMode.GRAYSCALE: actionType = classGrayscaleMode; break;
		case DocumentMode.DUOTONE: actionType = classDuotoneMode; break;
		case DocumentMode.INDEXEDCOLOR: actionType = classIndexedColorMode; break;
		case DocumentMode.RGB: actionType = classRGBColorMode; break;
		case DocumentMode.CMYK: actionType = classCMYKColorMode; break;
		case DocumentMode.LAB: actionType = classLabColorMode; break;
		case DocumentMode.MULTICHANNEL: actionType = classMultichannelMode; break;	
	}	
	return(actionType);
}

function CheckVersion() {
	var numberArray = version.split(".");
	if ( numberArray[0] < 9 ) {
		if ( DialogModes.NO != app.playbackDisplayDialogs ) {
		    alert( strMustUse );
		}
		throw( strMustUse );
	}
}

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
// Function: ChangeInfoToDescriptor
// Usage: create an ActionDescriptor from the ChangeInfo JavaScript Object
// Input: ChangeInfo JavaScript Object (o)
// Return: ActionDescriptor
// NOTE: We use the string id's here. They are mapped to the char id's.
///////////////////////////////////////////////////////////////////////////////
function ChangeInfoToDescriptor (o) {
	var d = new ActionDescriptor;
    var l = new ActionList;
    if (o.flagBITMAP) 
        l.putEnumerated( typeSourceMode, enumUIBitmap );
    if (o.flagGRAYSCALE) 
        l.putEnumerated( typeSourceMode, enumUIGrayscale );
    if (o.flagDUOTONE) 
        l.putEnumerated( typeSourceMode, enumUIDuotone );
    if (o.flagINDEXED) 
        l.putEnumerated( typeSourceMode, enumUIIndexed );
    if (o.flagRGB) 
        l.putEnumerated( typeSourceMode, enumUIRGB );
    if (o.flagCMYK) 
        l.putEnumerated( typeSourceMode, enumUICMYK );
    if (o.flagLAB) 
        l.putEnumerated( typeSourceMode, enumUILab );
    if (o.flagMULTICHANNEL) 
        l.putEnumerated( typeSourceMode, enumUIMultichannel );
    if (l.count) 
        d.putList( keySourceMode, l );
    if (o.modeObject instanceof ActionDescriptor) 
        d.putObject( keyDestinationMode, o.modeClass, o.modeObject );
    else 
        d.putClass( keyDestinationMode, ModeUIToClass( o.destMode ) );
    if (o.flatten != FLATTEN_UNUSED)
        d.putBoolean( keyMerge, o.flatten );
    return d;
}


///////////////////////////////////////////////////////////////////////////////
// Function: DescriptorToChangeInfo
// Usage: update a JavaScript Object from an ActionDescriptor
// Input: JavaScript Object (o), current object to update (output)
//        Photoshop ActionDescriptor (d), descriptor to pull new params for object from
// Return: Nothing, update is applied to passed in JavaScript Object (o)
///////////////////////////////////////////////////////////////////////////////
function DescriptorToChangeInfo (o, d) {
    if ( d.hasKey( keySourceMode ) ) {
        // if the value is present it means true
        // first we false out all the params
        // then read in each one in the list
   		o.flagBITMAP = false;
		o.flagGRAYSCALE = false;
		o.flagDUOTONE = false;
		o.flagINDEXED = false;
		o.flagRGB = false;
		o.flagCMYK = false;
		o.flagLAB = false;
		o.flagMULTICHANNEL = false;
        var l = d.getList( keySourceMode );
		var c = l.count;
		for ( var i = 0; i < c; i++ ) {
			switch ( l.getEnumerationValue( i ) ) {
				case enumUIMultichannel:    o.flagMULTICHANNEL = true;  break;
				case enumUILab:             o.flagLAB = true;           break;
				case enumUICMYK:            o.flagCMYK = true;          break;
				case enumUIRGB:             o.flagRGB = true;           break;
				case enumUIIndexed: 		o.flagINDEXED = true;       break;
				case enumUIDuotone: 		o.flagDUOTONE = true;       break;
				case enumUIGrayscale: 		o.flagGRAYSCALE = true;     break;
				case enumUIBitmap: 			o.flagBITMAP = true;        break;
			}
		}
    }
    if ( d.hasKey( keyMerge ) )
        o.flatten = d.getBoolean( keyMerge );
    if ( d.hasKey( keyDestinationMode ) ) {
        if ( DescValueType.CLASSTYPE == d.getType( keyDestinationMode ) ) {
            var targetClass = d.getClass( keyDestinationMode );
            o.destinationMode = ClassToIndex( targetClass );
            o.destMode = IndexToMode(o.destinationMode);
        } else {
            o.modeClass = d.getObjectType( keyDestinationMode );
            o.modeObject = d.getObjectValue( keyDestinationMode );
            o.destinationMode = ClassToIndex( o.modeClass );
            o.destMode = IndexToMode(o.destinationMode);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// Function: ChangeInfo
// Usage: object for holding the parameters
// Input: <none>
// Return: object holding the mode change parameters
///////////////////////////////////////////////////////////////////////////////
function ChangeInfo() {
    this.destinationMode = 5;
	this.destMode = IndexToMode( this.destinationMode );
	this.flagBITMAP = FLAG_BITMAP;
	this.flagGRAYSCALE = FLAG_GRAYSCALE;
	this.flagDUOTONE = FLAG_DUOTONE;
	this.flagINDEXED = FLAG_INDEXED;
	this.flagRGB = FLAG_RGB;
	this.flagCMYK = FLAG_CMYK;
	this.flagLAB = FLAG_LAB;
	this.flagMULTICHANNEL = FLAG_MULTICHANNEL;
	this.flatten = FLATTEN_UNUSED;		// Flatten the image, start in unused state
	// create these undefined
    this.modeObject;
	this.modeClass;
}
// Conditional Mode Change.jsx
