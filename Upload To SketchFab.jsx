// Copyright 2007.  Adobe Systems, Incorporated.  All rights reserved.
// ZStrings and auto layout by Tom Ruark

/*
@@@BUILDINFO@@@ Upload To SketchFab.jsx 1.0.0.23
 */
/*

// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/SimpleDialog/Menu=Share 3D Layer on Sketchfab...</name>
<category>samples</category>
<enableinfo>true</enableinfo>
<eventid>cf34b502-2013-4d07-8431-1dfd634ee0cd</eventid>
<terminology><![CDATA[<< /Version 1
/Events <<
/cf34b502-2013-4d07-8431-1dfd634ee0cd [($$$/JavaScripts/SketchFab/Action=Upload To SketchFab) /noDirectParam <<
>>]
>>
>> ]]></terminology>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING

 */

// enable double clicking from the Macintosh Finder or the Windows Explorer
//#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
//$.level = 0;
//debugger; // launch debugger on next line

/////////////////////////////////////////////////////////////////////////

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;
var debug = false; // give an exporter test button to check KMZ
//=================================================================
// Globals
//=================================================================

// UI strings to be localized
var strTitle = localize("$$$/JavaScripts/SketchFab/Title=Upload To Sketchfab");
var strTitleEmail = localize("$$$/JavaScripts/SketchFab/TitleEmail=Email Token");
var strButtonRun = localize("$$$/JavaScripts/SketchFab/Upload=Upload");
var strButtonCancel = localize("$$$/JavaScripts/SketchFab/CancelButton=Cancel");
var strButtonDone = localize("$$$/JavaScripts/SketchFab/DoneButton=Done");
var strButtonToken = localize("$$$/JavaScripts/SketchFab/TokenRequestShort=Request Token");
var strHelpText = localize("$$$/JavaScripts/SketchFab/Help=Please specify the Token for your Sketchfab account.");
var strHelpTextEmail = localize("$$$/JavaScripts/SketchFab/HelpEmail=Please specify the e-mail address associated with your Sketchfab account. Your upload token will be e-mailed to this address.");


var strLabelEmail = localize("$$$/JavaScripts/JavaScripts/Email=Email:");
var strLabelKey = localize("$$$/JavaScripts/JavaScripts/Key=Token:");
var strLabelTitle = localize("$$$/JavaScripts/JavaScripts/Title=Title:");
var strLabelDescription = localize("$$$/JavaScripts/JavaScripts/Description=Description:");
var strLabelTags = localize("$$$/JavaScripts/JavaScripts/Tags=Tags:");
var strEmpty = localize("$$$/JavaScripts/JavaScripts/Empty= ");
var strPublic = localize("$$$/JavaScripts/JavaScripts/Public=Public");
var strPrivate = localize("$$$/JavaScripts/JavaScripts/Private=Private");

var strMessage = localize("$$$/JavaScripts/SketchFab/Message=Upload to Sketchfab action settings");
var textFieldWidth=270;
var textLabelWidth=100;
var stretDestination = localize("$$$/locale_specific/JavaScripts/SketchFab/ETDestinationLength270=270");
var stretLabel = localize("$$$/locale_specific/JavaScripts/SketchFab/ETLabelLength100=100");
var strAlertDocumentMustBeOpened = localize("$$$/JavaScripts/LayerCompsToFiles/OneDocument=You must have a document open to export!");
var strAlertLayerMustBe3D = localize("$$$/JavaScripts/3D/SketchFab/MustBe3D=The selected layer must be a 3D layer in order for Sketchfab upload to work.");
var strHelpModelUploading = localize("$$$/JavaScripts/3D/SketchFab/ModelUploading=Model uploading...");
var strHelpModelUploadingWait = localize("$$$/JavaScripts/3D/SketchFab/ModelUploadingWait=Model uploading... please Wait");
var strHelpRequestToken = localize("$$$/JavaScripts/3D/SketchFab/RequestToken=Requesting token...");

var strAlertSpecifyToken = localize("$$$/JavaScripts/JavaScripts/AlertToken=You must specify the token from your Sketchfab account (dashboard).");
var strAlertSpecifyTitle = localize("$$$/JavaScripts/JavaScripts/AlertTitle=You must specify a Title.");
var strAlertSpecifyEmail = localize("$$$/JavaScripts/JavaScripts/AlertEmail=You must specify an email to get a Token");
var strAlertDescTooLong = localize("$$$/JavaScripts/JavaScripts/AlertDescription=Your description can be no longer than 160 characters.");
var strAlertTitleTooLong = localize("$$$/JavaScripts/JavaScripts/AlertTitleTooLong=Your title can be no longer than 160 characters.");
var strAlertTagsTooLong = localize("$$$/JavaScripts/JavaScripts/AlertTags=Your tags can be no longer than 160 characters.");
var strAlertClickUpload = localize("$$$/JavaScripts/JavaScripts/AlertUploadNow=Click Upload to share on Sketchfab.");

var strPresentationText = localize("$$$/JavaScripts/JavaScripts/strPresentationTextShort=Publish, share and embed interactive 3D models online without a plugin.");

var strConnectionError = localize("$$$/JavaScripts/SketchFab/strConnectionError=No connection to ");
var strErrorGeneral = localize("$$$/JavaScripts/SketchFab/strErrorGeneral=Error: ");
var strErrorInavlidEmail = localize("$$$/JavaScripts/SketchFab/strErrorInavlidEmail=Cannot find the Sketchfab account with the e-mail address ");
var strErrorInavlidToken = localize("$$$/JavaScripts/SketchFab/strErrorInavlidToken=You have entered an incorrect token.");
var strStatusGeneral = localize("$$$/JavaScripts/SketchFab/strStatusGeneral=Status: ");
var strPacking = localize("$$$/JavaScripts/SketchFab/strPacking=Preparing model for upload...");

var strYour  = localize("$$$/JavaScripts/SketchFab/strYour=Your ");
var strTo  = localize("$$$/JavaScripts/SketchFab/strTo= to ");

var strEmailTo=localize("$$$/JavaScripts/SketchFab/successResults_address/strEmailTo=Email sent to: ");
var strStatusFrom  = localize("$$$/JavaScripts/SketchFab/successResults_msg/stringStatusFrom=\r\rResponse from Sketchfab: ");

var strPeriod = localize("$$$/punctuation/endOfSentence/period=.");
var dlgMain, dlgEmail;

//////////////////////////////////////////////////////////////

// ok and cancel button
var runButtonID = 1;
var cancelButtonID = 2;
var tokenButtonID = 3;

///////////////////////////////////////////////////////////////////////////////
// Dispatch
///////////////////////////////////////////////////////////////////////////////
main();
///////////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
// Function: main
// Usage: the core routine for this script
// Input: <none>
// Return: <none>
///////////////////////////////////////////////////////////////////////////////
function main() {

	if (app.documents.length <= 0) {
		if (DialogModes.NO != app.playbackDisplayDialogs) {
			alert(strAlertDocumentMustBeOpened);
		}
		return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	}
	
	

	if (activeDocument.activeLayer.kind != 'LayerKind.LAYER3D') {
		if (DialogModes.NO != app.playbackDisplayDialogs) {
			alert(strAlertLayerMustBe3D);
		}
		return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	}
	
	var exportInfo = new Object();

	initExportInfo(exportInfo);

	// see if I am getting descriptor parameters
	descriptorToObject(exportInfo, app.playbackParameters, strMessage, postProcessExportInfo);

	while (DialogModes.ALL == app.playbackDisplayDialogs) {
		var dialogAnswer = cancelButtonID;
		
		while(1) {
			dialogAnswer = settingDialog(exportInfo);
			
			if (cancelButtonID == dialogAnswer) {
				saveExportInfo(exportInfo);
				return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
			}
			
			if (runButtonID == dialogAnswer) {
				return;
			}
			
			if (tokenButtonID == dialogAnswer) {
				var emailAnswer = emailDialog(exportInfo);
				if(tokenButtonID == emailAnswer) {
					
				}
			}

		}
	}

	try {

		app.playbackDisplayDialogs = DialogModes.ALL;

	} catch (e) {
		if (DialogModes.NO != app.playbackDisplayDialogs) {
			alert(e);
		}
		return 'cancel'; // quit, returning 'cancel' (dont localize) makes the actions palette not record our script
	}
}

function exportKMZ(expKMZFile) {
	var idexportthreeDModel = stringIDToTypeID("export3DModel");

	var desc91 = new ActionDescriptor();
	var idFilR = charIDToTypeID("FilR");

	//var expKMZFolder = new Folder ( exportFolder.toString() + "/" + fp.name.replace(".", "") + txtFormat[x].toUpperCase());
	//expKMZFolder.create();

	desc91.putPath(idFilR, expKMZFile);

	var idkeyEcmaChoice = stringIDToTypeID("keyEcmaChoice");
	desc91.putInteger(idkeyEcmaChoice, 1);

	var idkeyFormatChoiceExtension = stringIDToTypeID("keyFormatChoiceExtension");
	desc91.putString(idkeyFormatChoiceExtension, ".jpg");

	// osx ps exec gives 8007...
	// vodoo from http://www.ps-scripts.com/bb/viewtopic.php?f=2&t=5398
	try {
		executeAction(idexportthreeDModel, desc91, DialogModes.NO);
	} catch (e) {
		if (e.number != 8007) {
			throw e;
		} else {
			try {
				executeAction(idexportthreeDModel, desc91, DialogModes.NO);
			} catch (e) {
				if (e.number != 8007) {
					throw e;
				}
			}
		}
	}
}

function checkForErrorsInDialog(dlgMain)
{
	var token = dlgMain.etKey.text;
	if (token.length == 0) {
		dlgMain.etHelp.text = strAlertSpecifyToken;
		return 1;
	}
	var title = dlgMain.etTitle.text;
	if (title.length == 0) {
		dlgMain.etHelp.text = strAlertSpecifyTitle;
		return 1;
	}
	
	var token = dlgMain.etDescription.text;
	if (token.length > 160) {
		dlgMain.etHelp.text = strAlertDescTooLong;
		return 1;
	}
	
	var token = dlgMain.etTitle.text;
	if (token.length > 160) {
		dlgMain.etHelp.text = strAlertTitleTooLong;
		return 1;
	}
	
	var token = dlgMain.etTags.text;
	if (token.length > 160) {
		dlgMain.etHelp.text = strAlertTagsTooLong;
		return 1;
	}
	dlgMain.etHelp.text = strAlertClickUpload;
	
	return 0;
}

///////////////////////////////////////////////////////////////////////////////
// Function: settingDialog
// Usage: pop the ui and get user settings
// Input: exportInfo object containing our parameters
// Return: on ok, the dialog info is set to the exportInfo object
///////////////////////////////////////////////////////////////////////////////
function settingDialog(exportInfo) {
	dlgMain = new Window("dialog", strTitle);

	// match our dialog background color to the host application
	var brush = dlgMain.graphics.newBrush(dlgMain.graphics.BrushType.THEME_COLOR, "appDialogBackground");
	dlgMain.graphics.backgroundColor = brush;
	dlgMain.graphics.disabledBackgroundColor = brush;

	dlgMain.orientation = 'column';
	dlgMain.alignChildren = 'left';

	// -- top of the dialog, first line

	// -- two groups, one for left and one for right ok, cancel
	dlgMain.grpTop = dlgMain.add("group");
	dlgMain.grpTop.orientation = 'column';
	dlgMain.grpTop.alignChildren = 'top';
	dlgMain.grpTop.alignment = 'center';
	
	dlgMain.grpTopLine = dlgMain.grpTop.add("group");
	dlgMain.grpTopLine.orientation = 'row';
	dlgMain.grpTopLine.alignChildren = 'center';
	dlgMain.grpTopLine.alignment = 'fill';
	
	dlgMain.grpTopLine.add ('image', [10,10,160,50], ($.fileName + ".png"));
	dlgMain.grpTopLine.add("statictext", undefined, strPresentationText, {
		multiline : true
	}).alignment = 'fill';

	dlgMain.grpALine = dlgMain.grpTop.add("group");
	dlgMain.grpALine.orientation = 'row';
	//dlgMain.grpALine.alignChildren = 'center';
	dlgMain.grpALine.alignment = 'fill';

//Left column
	dlgMain.grpLeft= dlgMain.grpALine.add("group");
	dlgMain.grpLeft.orientation = 'column';
	dlgMain.grpLeft.alignChildren = 'right';
	dlgMain.grpLeft.alignment = 'right';

//Labels
	dlgMain.grpLeft.add("statictext", undefined, strLabelKey).preferredSize.height = 20;
	dlgMain.grpLeft.add("statictext", undefined, strLabelTitle).preferredSize.height = 20;
	dlgMain.grpLeft.add("statictext", undefined, strLabelDescription).preferredSize.height = 20;
	dlgMain.grpLeft.add("statictext", undefined, strLabelTags).preferredSize.height = 20;
	dlgMain.grpLeft.add("statictext", undefined, strEmpty).preferredSize.height = 24;
	
	
//Right column
	dlgMain.grpRight= dlgMain.grpALine.add("group");
	dlgMain.grpRight.orientation = 'column';
	dlgMain.grpRight.alignChildren = 'fill';
	dlgMain.grpRight.alignment = 'fill';
	
//Text fields	
	
	dlgMain.etKey = dlgMain.grpRight.add("edittext", undefined, exportInfo.key.toString());
	dlgMain.etKey.preferredSize.width = StrToIntWithDefault(stretDestination, textFieldWidth);
	dlgMain.etKey.onChanging = function () {
		checkForErrorsInDialog(dlgMain);
	}
	
	dlgMain.etTitle = dlgMain.grpRight.add("edittext", undefined, exportInfo.title.toString());
	dlgMain.etTitle.preferredSize.width = StrToIntWithDefault(stretDestination, textFieldWidth);
	dlgMain.etTitle.onChanging = function () {
		checkForErrorsInDialog(dlgMain);
	}
	
	dlgMain.etDescription = dlgMain.grpRight.add("edittext", undefined, exportInfo.description.toString());
	dlgMain.etDescription.preferredSize.width = StrToIntWithDefault(stretDestination, textFieldWidth);
	dlgMain.etDescription.onChanging = function () {
		checkForErrorsInDialog(dlgMain);
	}

	dlgMain.etTags = dlgMain.grpRight.add("edittext", undefined, exportInfo.tags.toString());
	dlgMain.etTags.preferredSize.width = StrToIntWithDefault(stretDestination, textFieldWidth);
	dlgMain.etTags.onChanging = function () {
		checkForErrorsInDialog(dlgMain);
	}
	
	
// Buttons 1
	dlgMain.grpDLine = dlgMain.grpRight.add("group");
	dlgMain.grpDLine.orientation = 'row';
	dlgMain.grpDLine.alignChildren = 'fill';
	dlgMain.grpDLine.alignment = 'fill';

	dlgMain.privateModelPopup = dlgMain.grpDLine.add("dropdownlist", undefined, "Hello");
	dlgMain.privateModelPopup.add ('item', strPublic);
	dlgMain.privateModelPopup.add ('item', strPrivate);
	if(exportInfo.isPrivate == "0")
		dlgMain.privateModelPopup.items[0].selected=true;
	else
		dlgMain.privateModelPopup.items[1].selected=true;
	dlgMain.privateModelPopup.preferredSize.width=100;
	dlgMain.privateModelPopup.alignment='left';
	
    // Tricky.
    // 50 is not enough for some languages. So here I use the testedit width - 2*popup width below.
    // Refer to bug @3212243 @3669847.
	//dlgMain.grpDLine.add("statictext", undefined, strEmpty).preferredSize.width = 50;
    dlgMain.grpDLine.add("statictext", undefined, strEmpty).preferredSize.width = StrToIntWithDefault(stretDestination, textFieldWidth) - 200;
	
	dlgMain.btnToken = dlgMain.grpDLine.add("button", undefined, strButtonToken);
	dlgMain.btnToken.alignment='right';
	dlgMain.btnToken.onClick = function () {

		dlgMain.close(tokenButtonID);

	}
// Description
	dlgMain.grpBottom = dlgMain.add("group");
	dlgMain.grpBottom.orientation = 'column';
	dlgMain.grpBottom.alignChildren = 'left';
	dlgMain.grpBottom.alignment = 'fill';

	dlgMain.pnlHelp = dlgMain.grpBottom.add("panel");
	dlgMain.pnlHelp.alignment = 'fill';

	dlgMain.etHelp = dlgMain.pnlHelp.add("statictext", undefined, strHelpText, {
			multiline : true
		});
	dlgMain.etHelp.alignment = 'fill';
	
// Buttons
	dlgMain.grpELine = dlgMain.add("group");
	dlgMain.grpELine.orientation = 'row';
	dlgMain.grpELine.alignChildren = 'right';
	dlgMain.grpELine.alignment = 'right';

	
	dlgMain.btnCancel = dlgMain.grpELine.add("button", undefined, strButtonCancel);
	dlgMain.btnCancel.onClick = function () {
		dlgMain.close(cancelButtonID);
	}

	dlgMain.btnRun = dlgMain.grpELine.add("button", undefined, strButtonRun);
	dlgMain.btnRun.onClick = function () {
		// check if the setting is properly
		if(checkForErrorsInDialog(dlgMain))
			return;
		
		var docName = app.activeDocument.name; // save the app.activeDocument name before duplicate.

		app.activeDocument = app.documents[docName];
		docRef = app.activeDocument;

		dlgMain.etHelp.text = strPacking;
		//$.writeln("Model packing... please Wait");
		//Export 3D Layer to temp
		var expKMZFolder = Folder.temp;
		//alert (expKMZFolder);

		var expKMZFilePath = new File(expKMZFolder.toString() + "/" + docName.replace(".", "") + ".kmz");
		exportKMZ(expKMZFilePath);

		dlgMain.etHelp.text = strHelpModelUploading;
		//$.writeln( "Model uploading...");
		//Upload file - Progress would be nice...
		var url = UploadToSkectchFab(exportInfo, expKMZFilePath, dlgMain);

		//Delete temp file
		expKMZFilePath.remove();
		if(url != "error")
			{
			dlgMain.close(cancelButtonID);
			LaunchWebPage(url);
			}
	}
	dlgMain.defaultElement = dlgMain.btnRun;
	dlgMain.cancelElement = dlgMain.btnCancel;

	

	dlgMain.onShow = function () {
		// yourself
	}

	// in case we double clicked the file
	// ? might be the 8007 error thing root there
	app.bringToFront();

	dlgMain.center();

	checkForErrorsInDialog(dlgMain);

	var result = dlgMain.show();

	if (cancelButtonID == result) {
		return result; // close to quit
	}

	// get setting from dialog
	//exportInfo.key = dlgMain.etKey.text;
	//exportInfo.title = dlgMain.etTitle.text;
	//exportInfo.description = dlgMain.etDescription.text;
	//exportInfo.tags = dlgMain.etTags.text;

	return result;
}


///////////////////////////////////////////////////////////////////////////////
// Function: settingDialog
// Usage: pop the ui and get user settings
// Input: exportInfo object containing our parameters
// Return: on ok, the dialog info is set to the exportInfo object
///////////////////////////////////////////////////////////////////////////////
function emailDialog(exportInfo) {

	dlgEmail = new Window("dialog", strTitleEmail);

	// match our dialog background color to the host application
	var brush = dlgEmail.graphics.newBrush(dlgEmail.graphics.BrushType.THEME_COLOR, "appDialogBackground");
	dlgEmail.graphics.backgroundColor = brush;
	dlgEmail.graphics.disabledBackgroundColor = brush;

	dlgEmail.orientation = 'column';
	dlgEmail.alignChildren = 'left';

	// -- top of the dialog, first line

	// -- two groups, one for left and one for right ok, cancel
	dlgEmail.grpTop = dlgEmail.add("group");
	dlgEmail.grpTop.orientation = 'column';
	dlgEmail.grpTop.alignChildren = 'top';
	dlgEmail.grpTop.alignment = 'center';

	dlgEmail.grpAbisLine = dlgEmail.grpTop.add("group");
	dlgEmail.grpAbisLine.orientation = 'row';
	dlgEmail.grpAbisLine.alignChildren = 'center';
	dlgEmail.grpAbisLine.alignment = 'fill';

	dlgEmail.grpAbisLine.add("statictext", undefined, strLabelEmail);
	dlgEmail.etEmail = dlgEmail.grpAbisLine.add("edittext", undefined, exportInfo.email.toString());
	dlgEmail.etEmail.preferredSize.width = StrToIntWithDefault(stretDestination, 160);

	
	// -- group top left
	dlgEmail.grpELine = dlgEmail.grpTop.add("group");
	dlgEmail.grpELine.orientation = 'row';
	dlgEmail.grpELine.alignChildren = 'center';
	dlgEmail.grpELine.alignment = 'right';
	
	dlgEmail.btnCancel = dlgEmail.grpELine.add("button", undefined, strButtonDone);
	dlgEmail.btnCancel.onClick = function () {
		dlgEmail.close(cancelButtonID);
	}

	dlgEmail.btnRun = dlgEmail.grpELine.add("button", undefined, strButtonToken);
	dlgEmail.btnRun.onClick = function () {
		var email = dlgEmail.etEmail.text;
		if (email.length == 0) {
			alert(strAlertSpecifyEmail);
		}
		else
			requestToken(exportInfo, dlgEmail);

	}
	dlgEmail.defaultElement = dlgEmail.btnRun;
	dlgEmail.cancelElement = dlgEmail.btnCancel;

	// the bottom of the dialog
	dlgEmail.grpBottom = dlgEmail.add("group");
	dlgEmail.grpBottom.orientation = 'column';
	dlgEmail.grpBottom.alignChildren = 'left';
	dlgEmail.grpBottom.alignment = 'fill';

	dlgEmail.pnlHelp = dlgEmail.grpBottom.add("panel");
	dlgEmail.pnlHelp.alignment = 'fill';

	dlgEmail.etHelp = dlgEmail.pnlHelp.add("statictext", undefined, strHelpTextEmail, {
			multiline : true
		});
	dlgEmail.etHelp.alignment = 'fill';

	dlgEmail.onShow = function () {
		// yourself
	}

	// in case we double clicked the file
	// ? might be the 8007 error thing root there
	app.bringToFront();

	dlgEmail.center();

	//checkForErrorsInDialog(dlgMain);

	var result = dlgEmail.show();

	if (cancelButtonID == result) {
		return result; // close to quit
	}

	// get setting from dialog
	exportInfo.email = dlgEmail.etEmail.text;

	return result;
}

///////////////////////////////////////////////////////////////////////////////
// Function: initExportInfo
// Usage: create our default parameters
// Input: a new Object
// Return: a new object with params set to default
///////////////////////////////////////////////////////////////////////////////
function initExportInfo(exportInfo) {

	//token : your sketchfab API token
	//fileModel : the model you want to upload
	//title : model title
	//description (optional) : model description
	//tags (optional) : list of tags separated by space
	//private (optional) : if set to True, then the model is private
	//password (optional) : if private is set to True, you can add a password to protect your file
	exportInfo.key = new String("");
	exportInfo.title = new String("");
	exportInfo.description = new String("");
	exportInfo.tags = new String("");
	exportInfo.email = new String("");
	exportInfo.isPrivate = new String("0");
	exportInfo.password = new String("");

	// look for last used params via Photoshop registry, getCustomOptions will throw if none exist
	try {
		var d = app.getCustomOptions("d69fc733-75b4-4d5c-ae8a-c6d6f9a8aa32");
		descriptorToObject(exportInfo, d, strMessage);
	} catch (e) {
		// it's ok if we don't have any options, continue with defaults
	}
}

function saveExportInfo(exportInfo) {
	//Not going to save anything for security reasons
	return;
	
	exportInfo.key = dlgMain.etKey.text;
	if(dlgEmail != undefined && dlgEmail.etEmail != undefined)
		exportInfo.email = dlgEmail.etEmail.text;
	exportInfo.title = dlgMain.etTitle.text;
	exportInfo.description = dlgMain.etDescription.text;
	exportInfo.tags = dlgMain.etTags.text;

	//$.writeln( "saving params... ");
	// save options prior to any operations
	try {
        //app.playbackDisplayDialogs = DialogModes.ALL;
        var d = objectToDescriptor(exportInfo, strMessage);	
        
        app.putCustomOptions("d69fc733-75b4-4d5c-ae8a-c6d6f9a8aa32", d, true);
	}
	catch(e) {
         //saving is not working.
        // just do as if.
	}

}

      
///////////////////////////////////////////////////////////////////////////////
// Function: objectToDescriptor
// Usage: create an ActionDescriptor from a JavaScript Object
// Input: JavaScript Object (o)
//        object unique string (s)
//        Pre process converter (f)
// Return: ActionDescriptor
// NOTE: Only boolean, string, number and UnitValue are supported, use a pre processor
//       to convert (f) other types to one of these forms.
// REUSE: This routine is used in other scripts. Please update those if you
//        modify. I am not using include or eval statements as I want these
//        scripts self contained.
///////////////////////////////////////////////////////////////////////////////
function objectToDescriptor(o, s, f) {
	if (undefined != f) {
		o = f(o);
	}
	var d = new ActionDescriptor;
	var l = o.reflect.properties.length;
	d.putString(app.charIDToTypeID('Msge'), s);
	for (var i = 0; i < l; i++) {
		var k = o.reflect.properties[i].toString();
		if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect")
			continue;
		var v = o[k];
		var kk = app.stringIDToTypeID(k);
		switch (typeof(v)) {
		case "boolean":
			d.putBoolean( kk, v);
			break;
		case "string":
			d.putString( kk, v);
			break;
		case "number":
			d.putDouble( kk, v);
			break;
		default: {
				if (v instanceof UnitValue) {
					var uc = new Object;
					uc["px"] = charIDToTypeID("#Rlt"); // unitDistance
					uc["%"] = charIDToTypeID("#Prc"); // unitPercent
					d.putUnitDouble( kk, uc[v.type], v.value);
				} else {
                      // ignore unkown instead of breaking it all
	                  //$.writeln( "parameter ignored for now: " + k + " : " + v  + "(" +  kk + ")");
					//throw(new Error("Unsupported type in objectToDescriptor " + typeof(v)));
				}
			}
		}
	}
	return d;
}

///////////////////////////////////////////////////////////////////////////////
// Function: descriptorToObject
// Usage: update a JavaScript Object from an ActionDescriptor
// Input: JavaScript Object (o), current object to update (output)
//        Photoshop ActionDescriptor (d), descriptor to pull new params for object from
//        object unique string (s)
//        JavaScript Function (f), post process converter utility to convert
// Return: Nothing, update is applied to passed in JavaScript Object (o)
// NOTE: Only boolean, string, number and UnitValue are supported, use a post processor
//       to convert (f) other types to one of these forms.
// REUSE: This routine is used in other scripts. Please update those if you
//        modify. I am not using include or eval statements as I want these
//        scripts self contained.
///////////////////////////////////////////////////////////////////////////////
function descriptorToObject(o, d, s, f) {
	var l = d.count;
	if (l) {
		var keyMessage = app.charIDToTypeID('Msge');
		if (d.hasKey(keyMessage) && (s != d.getString(keyMessage)))
			return;
	}
	for (var i = 0; i < l; i++) {
		var k = d.getKey(i); // i + 1 ?
		var t = d.getType(k);
		strk = app.typeIDToStringID(k);
		switch (t) {
		case DescValueType.BOOLEANTYPE:
			o[strk] = d.getBoolean(k);
			break;
		case DescValueType.STRINGTYPE:
			o[strk] = d.getString(k);
			break;
		case DescValueType.DOUBLETYPE:
			o[strk] = d.getDouble(k);
			break;
		case DescValueType.UNITDOUBLE: {
				var uc = new Object;
				uc[charIDToTypeID("#Rlt")] = "px"; // unitDistance
				uc[charIDToTypeID("#Prc")] = "%"; // unitPercent
				uc[charIDToTypeID("#Pxl")] = "px"; // unitPixels
				var ut = d.getUnitDoubleType(k);
				var uv = d.getUnitDoubleValue(k);
				o[strk] = new UnitValue(uv, uc[ut]);
			}
			break;
		case DescValueType.INTEGERTYPE:
		case DescValueType.ALIASTYPE:
		case DescValueType.CLASSTYPE:
		case DescValueType.ENUMERATEDTYPE:
		case DescValueType.LISTTYPE:
		case DescValueType.OBJECTTYPE:
		case DescValueType.RAWTYPE:
		case DescValueType.REFERENCETYPE:
		default:
			throw(new Error("Unsupported type in descriptorToObject " + t));
		}
	}
	if (undefined != f) {
		o = f(o);
	}
}

///////////////////////////////////////////////////////////////////////////
// Function: StrToIntWithDefault
// Usage: convert a string to a number, first stripping all characters
// Input: string and a default number
// Return: a number
///////////////////////////////////////////////////////////////////////////
function StrToIntWithDefault(s, n) {
	var onlyNumbers = /[^0-9]/g;
	var t = s.replace(onlyNumbers, "");
	t = parseInt(t);
	if (!isNaN(t)) {
		n = t;
	}
	return n;
}

///////////////////////////////////////////////////////////////////////////////
// Function: postProcessExportInfo
// Usage: convert strings from storage to Photoshop enums
// Input: JavaScript Object of my params in string form
// Return: JavaScript Object with objects in enum form
///////////////////////////////////////////////////////////////////////////////
function postProcessExportInfo(o) {
	//o.tiffCompression = eval(o.tiffCompression);
	return o;
}

///////////////////////////////////////////////////////////////////////////////
// Function: NumericEditKeyboardHandler
// Usage: Do not allow anything except for numbers 0-9
// Input: ScriptUI keydown event
// Return: <nothing> key is rejected and beep is sounded if invalid
///////////////////////////////////////////////////////////////////////////////
function NumericEditKeyboardHandler(event) {
	try {
		var keyIsOK = KeyIsNumeric(event) ||
			KeyIsDelete(event) ||
			KeyIsLRArrow(event) ||
			KeyIsTabEnterEscape(event);

		if (!keyIsOK) {
			//    Bad input: tell ScriptUI not to accept the keydown event
			event.preventDefault();
			/*    Notify user of invalid input: make sure NOT
			to put up an alert dialog or do anything which
			requires user interaction, because that
			interferes with preventing the 'default'
			action for the keydown event */
			app.beep();
		}
	} catch (e) { ; // alert ("Ack! bug in NumericEditKeyboardHandler: " + e);
	}
}

//    key identifier functions
function KeyHasModifier(event) {
	return event.shiftKey || event.ctrlKey || event.altKey || event.metaKey;
}

function KeyIsNumeric(event) {
	return (event.keyName >= '0') && (event.keyName <= '9') && !KeyHasModifier(event);
}

function KeyIsDelete(event) {
	//    Shift-delete is ok
	return ((event.keyName == 'Backspace') || (event.keyName == 'Delete')) && !(event.ctrlKey);
}

function KeyIsLRArrow(event) {
	return ((event.keyName == 'Left') || (event.keyName == 'Right')) && !(event.altKey || event.metaKey);
}

function KeyIsTabEnterEscape(event) {
	return event.keyName == 'Tab' || event.keyName == 'Enter' || event.keyName == 'Escape';
}

///////////////////////////////////////////////////////////////////////////////
// Function: jsx_XHR
// Usage: Talk to the internetz
// Input: specify all xhr url as parameters and request as concactened content
// Return: object with error member or result member depending on sucess
///////////////////////////////////////////////////////////////////////////////
function jsx_XHR(host, method, path, content, contentType) {
	var request = [];
	request.push(method, ' ', path, ' ', "HTTP/1.0\n");
	request.push('Host: ', host, "\n");
	request.push('User-Agent: ', 'PhotoshopSketchfabUploader', "\n");
	request.push('Connection: ', 'close', "\n");
	if (content) {
		request.push('Content-Length: ', content.length, "\n");
		if (contentType) {
			request.push('Content-Type: ', contentType, "\n");
		}
	}
	request.push("\n");
	if (content) {
		request.push(content);
	}
	var socket = new Socket;
	socket.timeout = 1000;

	if (!socket.open(host + ':80', 'BINARY')) {
		return {
			error : strConnectionError + host,
			status : 0
		};
	}
	
	for (var i = 0; i < request.length; i++) {
		socket.write(request[i]);
	}
	var bufferSize = 1; //  size is in kb
	var block = 1;
	var responseArray = [];
    while (socket.connected && !socket.eof) {
		var chars = socket.read(bufferSize * 1024);
		responseArray.push(chars);
		block++;
	}
	socket.close();
	var response = responseArray.join('');
	//$.writeln("begin-----");
	//$.writeln(response);
	//$.writeln("end-----");
	var statusLineOffset = response.indexOf("\r\n");
	var statusLine = response.substring(0, statusLineOffset);
	var status = statusLine.split(' ')[1];
	var resultOffset = response.indexOf("\r\n\r\n");
	var result = response.substring(resultOffset + 4);
	return {
		status : status,
		result : result
	};
}
///////////////////////////////////////////////////////////////////////////////
// Function: formatMultiPart
// Usage: url encode multiple data
// Input: specify all parameters  in an array as key->value (+filepath if it's a file)
// Return: 2 string, one specifying boundary chosen, the other being the data
///////////////////////////////////////////////////////////////////////////////
function formatMultiPart(parameters) {
	var contentArray = [];
	var boundary = Math.random();
	for (var i = 0; i < parameters.length; i++) {
		contentArray.push("--", boundary, "\r\n");
		var param = parameters[i];
		if (param.value) {
			contentArray.push("Content-Disposition: form-data; name=\"", param.key, "\"\r\n\r\n", param.value, "\r\n");
		} else if (param.filePath) {
			var file = new File(param.filePath);
			file.encoding = "BINARY";
			file.open("r")
			var buffer = file.read();
			file.close();
			contentArray.push("Content-Disposition: form-data; name=\"", param.key,
				"\"; filename=\"", param.filePath, "\"\r\n",
				"Content-Transfer-Encoding: binary\r\n",
				"Content-Type: ", param.contentType, "\r\n\r\n",
				buffer, "\r\n");
		}
	}
	contentArray.push("--", boundary, "--");
	return {
		boundary : boundary,
		content : contentArray.join('')
	};
}

///////////////////////////////////////////////////////////////////////////////
// Function: UrlEncode
// Usage: convert special chars to %% chars
// Input: key, value array
// Return: a string
///////////////////////////////////////////////////////////////////////////////
function urlEncode(value){
    value = encodeURIComponent(value).replace(/(.{0,3})(%0A)/g, function(m, p1, p2) {
        return p1 + (p1 == '%0D' ? '' : '%0D') + p2;
    });
    value = value.replace(/\!/g, "%21");
    value = value.replace(/\*/g, "%2A");
    value = value.replace(/\'/g, "%27");
    value = value.replace(/\(/g, "%28");
    value = value.replace(/\)/g, "%29");
    return value;
}
///////////////////////////////////////////////////////////////////////////////
// Function: formUrlEncode
// Usage: convert key, value array into URL encoded string
// Input: key, value array
// Return: a string
///////////////////////////////////////////////////////////////////////////////
function formUrlEncode(parameters) {
        var form = "&";
        for (var i = 0; i < parameters.length; i++) {
            var key = parameters[i].key;
            var value = parameters[i].value;
            if (value == null) value = "";
            form += urlEncode(key)+'='+ urlEncode(value);
        }
        return form;
    }
///////////////////////////////////////////////////////////////////////////////
// Function: requestToken
// Usage: gives user a way to get Token
// Input: 
// Return: not
///////////////////////////////////////////////////////////////////////////////
function requestToken(exportInfo, dlgEmail) {
	saveExportInfo(exportInfo);
	dlgEmail.etHelp.text = strHelpRequestToken;
    
    //http://sketchfab.com/v1/users/claim-token?email=<email@toto.com>
	var parameters = [{
			key : 'email',
			value : dlgEmail.etEmail.text
		}];
    var param = formUrlEncode(parameters);
	var options = {
		host : 'sketchfab.com',
		port : '80',
		path : '/v1/users/claim-token?' + param,
		proto : 'http://',
		method : 'GET',
		content : "",
		contentType : "application/x-www-form-urlencoded"
	};
	var response = jsx_XHR(options.host, options.method, options.path, options.content, options.contentType);
    
	// show results of life.
	if (response.error) {
		// total error
		//$.writeln('Error: ' + response.error);
		dlgEmail.etHelp.text = strErrorGeneral + response.error;
	} else if (response.status == 400 || response.status == 500) {
		dlgEmail.etHelp.text = strErrorInavlidEmail + dlgEmail.etEmail.text + strPeriod;
	} else if (response.status == 403) {
		//$.writeln('You have entered an incorrect token.');
		dlgEmail.etHelp.text = strErrorInavlidToken;
	} else if (response.status != 200) {
		// server  error
		//$.writeln('Status: ' + response.status);
		dlgEmail.etHelp.text = strStatusGeneral + response.status;
	} else {
		//$.writeln('OK: ' + response.result);

		var parsedResponse;
		var test = eval('parsedResponse=' + response.result); // risky business but life is risk
		if (!parsedResponse)
			parsedResponse = JSON.parse(response.result); // need valid JSON...

		if (parsedResponse.success != true) {
		//$.writeln(parsedResponse.error);
			dlgEmail.etHelp.text = parsedResponse.error;
		} else {
		//$.writeln(parsedResponse.result);
			//dlgEmail.etHelp.text = strYour + parsedResponse.result + strTo + dlgEmail.etEmail.text;
				
			dlgEmail.etHelp.text = strEmailTo + dlgEmail.etEmail.text + strStatusFrom + parsedResponse.result;
		}
	}
	return;
}


///////////////////////////////////////////////////////////////////////////////
// Function: UploadToSkectchFab
// Usage: upload a file to sketchfab
// Input: kmz file
// Return: success or not
///////////////////////////////////////////////////////////////////////////////
function UploadToSkectchFab(exportInfo, filePath, dlgMain) {
	

	exportInfo.isPrivate="False";
	//alert(dlgMain.privateModelPopup.selection.index);
	if(dlgMain.privateModelPopup.selection.index == 1) {
		exportInfo.isPrivate="True";
	}
	//alert(	exportInfo.isPrivate);
	
	saveExportInfo(exportInfo);

	dlgMain.etHelp.text = strHelpModelUploadingWait;
		//$.writeln( "Model uploading... please Wait");
	
	var parameters = [{
			key : 'title',
			value : unescape(encodeURIComponent(dlgMain.etTitle.text))
		}, {
			key : 'description',
			value : unescape(encodeURIComponent(dlgMain.etDescription.text))
		}, {
			key : 'fileModel',
			filePath : filePath,
			contentType : 'application/vnd.google-earth.kmz'
		}, {
			key : 'filenameModel',
			value : filePath
		}, {
			key : 'tags',
			value : unescape(encodeURIComponent(dlgMain.etTags.text))
		}, {
			key : 'token',
			value : dlgMain.etKey.text
		}, {
			key : 'private',
			value : exportInfo.isPrivate
		}
	];
	var request = formatMultiPart(parameters);

	var options = {
		host : 'api.sketchfab.com',
		port : '80',
		path : '/v1/models',
		proto : 'http://',
		method : 'POST',
		content : request.content,
		contentType : "multipart/form-data; boundary=" + request.boundary
	};

// could be useful if one day someone allow oAuth over http instead of https...
	var response = jsx_XHR(options.host, options.method, options.path, options.content, options.contentType);

	if (response.error) {
		// total error
		//$.writeln('Error: ' + response.error);
		dlgMain.etHelp.text = strErrorGeneral + response.error;
	} else if (response.status == 403) {
		//$.writeln('You have entered an incorrect token.');
		dlgMain.etHelp.text = strErrorInavlidToken;
	} else if (response.status != 200) {
		// server  error
		//$.writeln('Status: ' + response.status);
		dlgMain.etHelp.text = strStatusGeneral + response.status;
	} else {
		//$.writeln('OK: ' + response.result);

		var parsedResponse;
		var test = eval('parsedResponse=' + response.result); // risky business but life is risk
		if (!parsedResponse)
			parsedResponse = JSON.parse(response.result); // need valid JSON...

		if (parsedResponse.success != true) {
		//$.writeln(parsedResponse.error);
			dlgMain.etHelp.text = parsedResponse.error;
		} else {
		var url="https://www.sketchfab.com/show/" + parsedResponse.result.id;
		
		//$.writeln("Model successfully uploaded on " + url);
			
			return url;
			//dlgMain.etHelp.text = "Model successfully uploaded on https://www.sketchfab.com/show/" + parsedResponse.result.id;
		}
	}
	return "error";
}

function LaunchWebPage(myWebPage)
{
	var s = "<HTML><HEAD><META HTTP-EQUIV=REFRESH CONTENT=";
	s += '"0; URL=';
	s += myWebPage;
	s += ' ">';
	s += "</HEAD><BODY>";
	s += "<!---CENTER><BR><BR><b><i><span style='font-family:Arial'>";
	s += localize("$$$/watermark/str/redirect=redirecting to documentation...");
	s += "</span></i></b></center--->";
	s += "</BODY></HTML>";
			
	var helpFile = new File( Folder.temp.toString() + '/Temp.html' );
	if (helpFile.open('w')) {
		helpFile.write( s );
		helpFile.close();
		helpFile.execute();
	}


}

