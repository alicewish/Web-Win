/*                                                              
@@@BUILDINFO@@@ MeasurementScaleMarker.jsx 1.0.0.13
*/

/**
 * Build a measurement scale marker for the current document.
 * The document must have a measurement scale.
 */

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop
// in case we double clicked the file
app.bringToFront();

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

// global for our result, send a 'cancel' back to Photoshop to not get a histor entry and to not get a recorded action
var returnResult = 'OK';

// Only run if we're in a supported version of Photoshop
// Note, removing this will not make the script work, as it depends on
// core application code, it just makes it fail better.
if (!app.featureEnabled("Measurement")) {
	if (app.playbackDisplayDialogs != DialogModes.NO)
		{
		Window.alert (localize ("$$$/JavaScripts/MeasurementScaleMarker/CommandNotAvaiable=The Measurement Scale Marker feature is not available in this version of Photoshop."));
		returnResult = 'cancel';
		}
	else
		throw( new Error(localize("$$$/JavaScripts/MeasurementScaleMarker/CommandNotAvaiable=The Measurement Scale Marker feature is not available in this version of Photoshop.")));
}

else {
	// Suspend the history for this script, so that we show it as a single, atomic
	// operation that can be undone/redone in one click, and only shows a single
	// entry in the History palette.
	try {
		app.activeDocument.suspendHistory(localize("$$$/JavaScripts/MeasurementScaleMarker/HistoryPaletteLabel=Place Measurement Scale Marker"), "makeScaleMarker();");
	} 
	catch(e) {
		if ( confirm( localize( "$$$/JavaScripts/MeasurementScaleMarker/Sorry=Sorry, something major happened and I can't continue! Would you like to see more info?" ) ) )
			alert( e + " : " + e.line );
		returnResult = 'cancel';
	}
}

// if we pass back 'cancel' to Photoshop we will not get a history entry or a recorded event in the actions palette
returnResult;

/** The main function */
function makeScaleMarker() {
	try {
		keyLength = app.stringIDToTypeID("measurementScaleMarkerLength");
		keyDisplayText = app.stringIDToTypeID("measurementScaleMarkerDisplayText");
		keyTextPositionBottom = app.stringIDToTypeID("measurementScaleMarkerTextPositionBottom");
		keyColor = app.stringIDToTypeID("measurementScaleMarkerColor");
		keyLocationBottom = app.stringIDToTypeID("measurementScaleMarkerLocationBottom");
		keyLocationLeft = app.stringIDToTypeID("measurementScaleMarkerLocationLeft");
		keyFontName = app.stringIDToTypeID("measurementScaleMarkerFont");
		keyFontSize = app.stringIDToTypeID("measurementScaleMarkerFontSize");
		keyDontRecord = app.stringIDToTypeID("dontRecord");

		scriptGUID = "359FE506-CB49-4d05-9646-B26C99789E1F";
		settings = new Object();

		deleteExistingMarkers = false;

		getScaleValues();
		setupInitialValues();
		
		// See if the document is big enough
		usableDocWidth = app.activeDocument.width.as("px"); // declare as global
		usableDocHeight = app.activeDocument.height.as("px"); // declare as global
		if (usableDocHeight  < 18 ||  usableDocWidth < 18) 
			   throw new Error (localize("$$$/JavaScripts/MeasurementScaleMarker/Alert/InvalidDocSize=This document is too small for a scale marker."));

		if (checkForExistingScaleMarkers() && doDialog()) {
		
			// Make sure we are valid (particularly for scripting)
			if (settings.scaleMarkerLength <= 0.0)
				throw new Error (localize("$$$/JavaScripts/MeasurementScaleMarker/Alert/InvalidLength=Invalid length entered - only positive real numbers are allowed."));
				
			// Clear any document selections so we don't try to do any operations
			// in the selection
			app.activeDocument.selection.deselect();

			deleteExistingScaleMarkers();
			determineLocations();

			// Determine the actual scale marker length we'll use, based on the
			// incremental number of logical units to use, using the logical length
			// of the measurement scale.  This ensures that we will always have a
			// visible, and useful scale marker length.  
			scaleMarkerActualLength = settings.scaleMarkerLength * logicalLength;

			var	layerGroup = createLayerGroup();
			var textLayer = createText(layerGroup);
			var graphicLayer = createGraphic(layerGroup);

			// Select the layer group so user can easily move the whole thing 
			// around after, and so that the last layer we just created isn't the 
			// selected layer.
			app.activeDocument.activeLayer = layerGroup;

			// Stuff the parameters we used back into an ActionDescriptor so that we
			// can return them in case this script is being recorded.  Then set this
			// as the playbackParameters.
			var params = new ActionDescriptor();
			params.putDouble(keyLength, settings.scaleMarkerLength);
			params.putBoolean(keyDisplayText, settings.displayText);
			params.putBoolean(keyTextPositionBottom, settings.textPositionBottom);
			params.putString(keyColor, settings.markerColor.rgb.hexValue);
			params.putString(keyFontName, settings.textFontName);
			params.putString(keyFontSize, settings.textFontSize);
			// We do not pass back the location when recording a script, because it
			// is dependent on the size of the document and thus a fixed point will
			// not be useful in a recorded script.  User may explicitly pick a
			// location though when writing a script that places a scale marker.  Or
			// if you do want to record the location, you can enable the next two lines.
			app.playbackParameters = params;

			// Save off any settings the user made for the next time
			var d = objectToDescriptor(settings, settingsObjectToDescriptorValues);
			app.putCustomOptions(scriptGUID, d);

			return;
		}
	} 
	// Lot's of things can go wrong
	// Give a generic alert and see if they want the details
	catch( e ) {
		if ( confirm( localize( "$$$/JavaScripts/MeasurementScaleMarker/Sorry=Sorry, something major happened and I can't continue! Would you like to see more info?" ) ) ) {
			alert( e + " : " + e.line );
		}
		returnResult = 'cancel';
	}

	// If we're here, we either got an error, or the user cancelled
	// set the global variable and then return it so suspendHistory gets undone
	returnResult = 'cancel';
	
	return returnResult;
	
}

/**
 * Get our scale values.  Values are put into global vars.
 */
function getScaleValues() {
	var scale = app.activeDocument.measurementScale
	pixelLength = scale.pixelLength; // declare as global
	logicalLength = scale.logicalLength; // declare as global
	logicalUnits = scale.logicalUnits; // declare as global
}

/**
 * Set up the initial values for various user settings.  These are defined as
 * globals.
 */
function setupInitialValues() {
	var doc = app.activeDocument;
	// Define common strings
	layerGroupName = localize("$$$/JavaScripts/MeasurementScaleMarker/LayerSetName=Measurement Scale Marker");
	dialogTitle = localize("$$$/JavaScripts/MeasurementScaleMarker/Dialogs/Title=Measurement Scale Marker");

	// Define the font to use - this will be localized appropriately.  Note that
	// the font is the same on Mac and Win for English, but not necessarily for
	// other languages.
	settings.textFontName = localize("$$$/JavaScripts/MeasurementScaleMarker/TextFont/Windows/TimesNewRoman=Times New Roman");
	if ( "Windows" != File.fs )
		settings.textFontName = localize("$$$/JavaScripts/MeasurementScaleMarker/TextFont/Mac/TimesNewRoman=Times New Roman");

	// Setup our standard/default values - most recalculated later
	settings.scaleMarkerLength = 1;
	settings.displayText = true;

	settings.markerColor = new SolidColor;
	settings.markerColor.model = ColorModel.RGB;
	settings.markerColor.rgb.red = 0;
	settings.markerColor.rgb.green = 0;
	settings.markerColor.rgb.blue = 0;

	scale = doc.resolution / 72;
	scaleFactor = doc.resolution / 72;
	if (scaleFactor >= 2) {
		scaleFactor /= 2; // Scale the graphics by half
		settings.textFontSize = UnitValue(8, "pt"); // Scale the text by 30%
	}
	else {
		settings.textFontSize = UnitValue(10, "pt");
	}
	settings.textPositionBottom = true;
	textLocation = [new UnitValue(0, "px"), new UnitValue(0, "px")];
	settings.textFontSize.baseUnit = UnitValue(1/doc.resolution, "in");
	textGraphicMargin = 5 * scaleFactor;	// Number of pixels horizontally between text and graphic
	graphicLeft = 0;
	graphicTop = 0;
	graphicHeight = 4 * scaleFactor;

	// Determine location base point that we calculate all other values from;
	// this is the bottom left point at which we position the scale marker
	var docWidth = doc.width;
	var docHeight = doc.height;
	docWidth.convert("px");
	docHeight.convert("px");
	baseBottom = Math.floor(docHeight.value * 0.95);
	baseLeft = Math.floor(docWidth.value * 0.05);

	// Look for last used params via Photoshop registry (getCustomOptions will 
	// throw if none exist) - set these up first in case parameters passed in
	// are incomplete.
	try {
		var d = app.getCustomOptions(scriptGUID);
		settings = descriptorToObject(d, settingsObjectFromDescriptorValues);
	}
	catch(e) {
		// if we don't have any options, or they're corrupted, continue with defaults
	}

	// Usa any parameters we had passed in (being driven by a script)
	var numberOfProvidedParams = 0;
	if (playbackParameters.count > 0) { 
		if (playbackParameters.hasKey(keyLength)) {
			settings.scaleMarkerLength = playbackParameters.getDouble(keyLength);
			++numberOfProvidedParams;
		}
		if (playbackParameters.hasKey(keyDisplayText)) {
			settings.displayText = playbackParameters.getBoolean(keyDisplayText);
			++numberOfProvidedParams;
		}
		if (playbackParameters.hasKey(keyTextPositionBottom)) {
			settings.textPositionBottom = playbackParameters.getBoolean(keyTextPositionBottom);
			++numberOfProvidedParams;
		}
		if (playbackParameters.hasKey(keyColor)) {
			settings.markerColor.rgb.hexValue = playbackParameters.getString(keyColor);
			++numberOfProvidedParams;
		}
		if (playbackParameters.hasKey(keyFontName)) {
			settings.textFontName = playbackParameters.getString(keyFontName);
			++numberOfProvidedParams;
		}
		if (playbackParameters.hasKey(keyFontSize)) {
			settings.textFontSize = UnitValue(playbackParameters.getString(keyFontSize));
			++numberOfProvidedParams;
		}
		if (4 <= numberOfProvidedParams) {
			// We have all the parameters that the dialog would allow adjusting,
			// so no need to show dialog
			if (app.playbackDisplayDialogs == DialogModes.ALL) {
				app.playbackDisplayDialogs = DialogModes.ERROR;
			}
		}

		// The location is only specified in script, we do not pass this back
		// when recording.
		if (playbackParameters.hasKey(keyLocationBottom)) {
			baseBottom = playbackParameters.getInteger(keyLocationBottom);
		}
		if (playbackParameters.hasKey(keyLocationLeft)) {
			baseLeft = playbackParameters.getInteger(keyLocationLeft);
		}
	}
}

/**
 * See if there is already a scale marker in the document and
 * what to do about it if so.
 * 
 * @return True if ok to proceed, false if not.
 */
function checkForExistingScaleMarkers() {
	var result = true;

	if (app.playbackDisplayDialogs != DialogModes.NO) {
		// Look for our named layer
		try {
			var layerSets = app.activeDocument.layerSets;
			var existingLayerSet = layerSets.getByName(layerGroupName);
			if (existingLayerSet) {
				var existingMarkerDialogDefinition =
					"dialog { text: '" + dialogTitle + "', orientation:'column', alignChildren:'fill', \
						alertText: StaticText { text:'$$$/JavaScripts/MeasurementScaleMarker/Alert/ExistingMarker=There are existing measurement scale marker(s).  Would you like to remove or keep these, when placing the new marker?^n^nNote: selecting Remove applies to locked scale marker layers as well.', properties:{multiline:true} }, \
						buttonGroup: Group { orientation:'row', alignment:'center', \
							removeButton: Button { text:'$$$/JavaScripts/MeasurementScaleMarker/Dialog/Remove=Remove', properties:{name:'ok'} }, \
							keepButton: Button { text:'$$$/JavaScripts/MeasurementScaleMarker/Dialog/Keep=Keep', properties:{name:'keep'} }, \
							cancelButton: Button { text:'$$$/JavaScripts/MeasurementScaleMarker/Dialog/Cancel=Cancel', properties:{name:'cancel'} } \
						} \
					}";
				var existingMarkerDialog = new Window(existingMarkerDialogDefinition);

				existingMarkerDialog.buttonGroup.keepButton.onClick = function() {
					existingMarkerDialog.close();
				}

				buttonPressed = existingMarkerDialog.show();
				if (1 == buttonPressed) {	// Remove/OK button
					deleteExistingMarkers = true;
				}
				else if (2 == buttonPressed) {	// Cancel
					// Abort out of the script altogether
					result = false;
				}
			}
		} 
		catch (e) {
			// No existing layer set
		}
	}

	return result;
}

function deleteExistingScaleMarkers() {
	if (deleteExistingMarkers) {
		try {
			var layerSets = app.activeDocument.layerSets;
			var existingLayerSet = layerSets.getByName(layerGroupName);
			do {
				existingLayerSet.allLocked = false;
				existingLayerSet.remove();   						
			} while (existingLayerSet = layerSets.getByName(layerGroupName));
		} 
		catch (e) { 
			// No more markers left to remove 
		}
	}
}

function validateLengthTextEdit (lengthEdit) {
	if (0 == lengthEdit.text.length) {
		alert(localize("$$$/JavaScripts/MeasurementScaleMarker/Alert/NoLength=No length entered - please enter a length, or cancel."));
		return false;
	}

	// Validate the value they've entered - make sure it's a number
	if ((/[^\d\.]+/.test(lengthEdit.text)) || (!/\d+/.test(lengthEdit.text)) || (/\.+.*\.+/.test(lengthEdit.text))) {
		alert(localize("$$$/JavaScripts/MeasurementScaleMarker/Alert/InvalidLength=Invalid length entered - only positive real numbers are allowed."));
		return false;
	}
	
	// Validate the value they've entered - make sure it is greater than zero
	if (lengthEdit.text <= 0.0) {
		alert(localize("$$$/JavaScripts/MeasurementScaleMarker/Alert/InvalidLength=Invalid length entered - only positive real numbers are allowed."));
		return false;
	}

	var pixelsPerLogicalUnit = pixelLength / logicalLength;
	var maxMarkerLength = Math.floor(usableDocWidth / pixelsPerLogicalUnit);
	if (maxMarkerLength < 1)
		maxMarkerLength = 1;

	if (lengthEdit.text > maxMarkerLength) {
		alert(localize("$$$/JavaScripts/MeasurementScaleMarker/Alert/LengthTooLong=The length you entered is too long for this document, it has been reset to the maximum length for this document."));
		lengthEdit.text = maxMarkerLength;
		return false;
	}

	return true;
}

/**
 * Show our dialog(s).  If we're running interactively, then the
 * options dialog will be shown.  If running scripted with no
 * dialogs, don't show the dialog.
 * 
 * @return The result of the dialog.
 */
function doDialog() {
	if ((app.playbackDisplayDialogs == DialogModes.NO) || (app.playbackDisplayDialogs == DialogModes.ERROR))
		return true;

	// Determine marker color radio button setting - anything other than white
	// will be inferred to be black - we shouldn't have anything other than
	// black or white here for the dialog, that can only be used via the
	// scripting interface.
	var textColorBlack = true;
	if ((settings.markerColor.rgb.red == 255) &&
		(settings.markerColor.rgb.green == 255) &&
		(settings.markerColor.rgb.blue == 255)) {
		textColorBlack = false;
	}

	var dropDownMacFontName = [localize('$$$/JavaScripts/MeasurementScaleMarker/TextFont/Mac/Courier=Courier'), localize('$$$/JavaScripts/MeasurementScaleMarker/TextFont/Mac/Helvetica=Helvetica'), localize('$$$/JavaScripts/MeasurementScaleMarker/TextFont/Mac/TimesNewRoman=Times New Roman') ];
	var dropDownMacFontFaceName = [localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontFaceName/Mac/Courier=Courier'), localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontFaceName/Mac/Helvetica=Helvetica'), localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontFaceName/Mac/TimesNewRoman=Times New Roman')];
	var dropDownWinFontName = [localize('$$$/JavaScripts/MeasurementScaleMarker/TextFont/Windows/Arial=Arial'), localize('$$$/JavaScripts/MeasurementScaleMarker/TextFont/Windows/Courier=Courier'), localize('$$$/JavaScripts/MeasurementScaleMarker/TextFont/Windows/TimesNewRoman=Times New Roman') ];
	var dropDownWinFontFaceName = [localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontFaceName/Windows/Arial=Arial'), localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontFaceName/Windows/Courier=Courier'), localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontFaceName/Windows/TimesNewRoman=Times New Roman')];

	var dropDownFontSizeName = [localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/4pt=4 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/6pt=6 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/8pt=8 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/9pt=9 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/10pt=10 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/11pt=11 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/12pt=12 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/14pt=14 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/18pt=18 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/24pt=24 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/30pt=30 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/36pt=36 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/48pt=48 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/60pt=60 pt'), 
								localize('$$$/JavaScripts/MeasurementScaleMarker/TextFontSize/72pt=72 pt') ];
	var dropDownFontSize = ['4 pt', '6 pt', '8 pt', '9 pt', '10 pt', '11 pt', '12 pt', '14 pt', '18 pt', '24 pt', '30 pt', '36 pt', '48 pt', '60 pt', '72 pt'];
	
	//Select appropiate platform fonts to use
	var dropDownFontFaceName = dropDownWinFontFaceName; //default to windows
	var dropDownFontName = dropDownWinFontName; //default to windows
	
	if ( "Windows" != File.fs ) {
		dropDownFontFaceName = dropDownMacFontFaceName;
		dropDownFontName = dropDownMacFontName;
	}

	var scaleMarkerDialogDefinition = 
		"dialog { text: '" + dialogTitle + "', orientation:'row', alignChildren:'fill', \
			settingsControlsGroup: Group { orientation:'column', alignChildren:'left', \
				lengthGroup: Group { orientation:'row', \
					lengthLabel: StaticText { text:'$$$/JavaScripts/MeasurementScaleMarker/LogicalUnitsLength=Length:' }, \
					lengthEdit: EditText { text:'" + settings.scaleMarkerLength + "', preferredSize:[80, 20] }, \
					lengthDescription: StaticText { text:\"x " + logicalLength + " " + logicalUnits + "\" } \
				}, \
				fontGroup: Group { orientation:'row', \
					fontLabel: StaticText { text:'$$$/JavaScripts/MeasurementScaleMarker/Font=Font:' }, \
					fontNameDropDown: DropDownList { properties:{items: ['0','1','2']} }, \
					fontSizeLabel: StaticText { text:'$$$/JavaScripts/MeasurementScaleMarker/FontSize=Font Size:' }, \
					fontSizeDropDown: DropDownList { properties:{ items:['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'] } }, \
				}, \
				annotationsGroup: Group { orientation:'column', alignChildren:'left', \
					displayTextCB: Checkbox { text:'$$$/JavaScripts/MeasurementScaleMarker/DisplayText=Display Te&xt', value:" + settings.displayText.toString() + " }, \
					choicesGroup: Group { orientation:'row', alignChildren:'top', \
						textPositionPanel: Panel { text:'$$$/JavaScripts/MeasurementScaleMarker/TextPositionTitle=Text Position', orientation:'column', alignChildren:'left', \
							textBottomRB: RadioButton { text:'$$$/JavaScripts/MeasurementScaleMarker/TextPositionTitle/Bottom=Bottom', value:" + settings.textPositionBottom.toString() + " }, \
							textTopRB: RadioButton { text:'$$$/JavaScripts/MeasurementScaleMarker/TextPositionTitle/Top=Top', value:" + (!settings.textPositionBottom).toString() + " } \
						}, \
						markerColorPanel: Panel { text:'$$$/JavaScripts/MeasurementScaleMarker/ColorGroupTitle=Color', orientation:'column', alignChildren:'left', \
							colorBlackRB: RadioButton { text:'$$$/JavaScripts/MeasurementScaleMarker/Color/Black=Black', value:" + textColorBlack.toString() + " }, \
							colorWhiteRB: RadioButton { text:'$$$/JavaScripts/MeasurementScaleMarker/Color/White=White', value:" + (!textColorBlack).toString() + " } \
						} \
					} \
				} \
			}, \
			okCancelGroup: Group { orientation:'column',  alignChildren:'fill',\
				ok: Button { text:'$$$/JavaScripts/MeasurementScaleMarker/Dialog/OK=OK', properties:{name:'ok'} }, \
				cancel: Button { text:'$$$/JavaScripts/MeasurementScaleMarker/Dialog/Cancel=Cancel', properties:{name:'cancel'} } \
			} \
		}";


	var scaleMarkerDialog = new Window(scaleMarkerDialogDefinition);

	// Modify dialog behaviors
	scaleMarkerDialog.settingsControlsGroup.annotationsGroup.choicesGroup.textPositionPanel.enabled = scaleMarkerDialog.settingsControlsGroup.annotationsGroup.displayTextCB.value;

    //populate localized font face name in the dropdown.
	var dd = scaleMarkerDialog.settingsControlsGroup.fontGroup.fontNameDropDown;
	dd.items[0].text = dropDownFontFaceName[0];
	dd.items[1].text = dropDownFontFaceName[1];
	dd.items[2].text = dropDownFontFaceName[2];
	
	var foundIt = false;
	for (var i = 0; i < dropDownFontName.length; i++) {
 		if (dropDownFontName[i] == settings.textFontName) {
			dd.selection = dd.items[i];
			foundIt = true;
			break;
		}
	}

	if ( ! foundIt ) {
		dd.selection = dd.items[0];
	}
		
    
	//update font size list.
	var dd = scaleMarkerDialog.settingsControlsGroup.fontGroup.fontSizeDropDown;
	var fontSizeListLength = dd.items.length; //length of initial list.
	
	//guard against out of sync dropDownFontSize[], dropDownFontSizeName[] array length.  Use shortest length. 
	if (dropDownFontSize.length < fontSizeListLength)
		fontSizeListLength = dropDownFontSize.length;
	if (dropDownFontSizeName.length < fontSizeListLength)		
		fontSizeListLength = dropDownFontSizeName.length;
	
	//populate localized font size names in dropdown.		
	for(var i = 0; i< fontSizeListLength; i++) {
		dd.items[i].text = dropDownFontSizeName[i];
	}
	
	var foundIt = false;
	for (var i = 0; i < fontSizeListLength; i++) {
		if (dropDownFontSize[i].text == settings.textFontSize.toString()) {
			dd.selection = dd.items[i];
			foundIt = true;
			break;
		}
	}

	if ( ! foundIt ) {
		dd.selection = dd.items[0];
	}
		
	scaleMarkerDialog.settingsControlsGroup.annotationsGroup.displayTextCB.onClick = function() {
		scaleMarkerDialog.settingsControlsGroup.annotationsGroup.choicesGroup.textPositionPanel.enabled = scaleMarkerDialog.settingsControlsGroup.annotationsGroup.displayTextCB.value;
	}

	scaleMarkerDialog.okCancelGroup.ok.onClick = function() {
		if (!validateLengthTextEdit (scaleMarkerDialog.settingsControlsGroup.lengthGroup.lengthEdit))
			scaleMarkerDialog.settingsControlsGroup.lengthGroup.lengthEdit.active = true;
		else
			scaleMarkerDialog.close (1);
	}

	scaleMarkerDialog.settingsControlsGroup.lengthGroup.lengthEdit.active = true;
	
	// do not allow anything except for numbers 0-9
	scaleMarkerDialog.settingsControlsGroup.lengthGroup.lengthEdit.addEventListener ('keydown', NumericEditKeyboardHandler);


	// Show the dialog
	if (1 == scaleMarkerDialog.show()) {  // OK button
		settings.scaleMarkerLength = scaleMarkerDialog.settingsControlsGroup.lengthGroup.lengthEdit.text;
		settings.displayText = scaleMarkerDialog.settingsControlsGroup.annotationsGroup.displayTextCB.value;

		if (scaleMarkerDialog.settingsControlsGroup.annotationsGroup.choicesGroup.textPositionPanel.textBottomRB.value) {
			settings.textPositionBottom = true;
		} 
		else {
			settings.textPositionBottom = false;
		}

		if (scaleMarkerDialog.settingsControlsGroup.annotationsGroup.choicesGroup.markerColorPanel.colorBlackRB.value) {
			settings.markerColor.rgb.hexValue = "000000";
		}
		else {
			settings.markerColor.rgb.hexValue = "FFFFFF";
		}

		//font size selected
		settings.textFontSize = UnitValue(dropDownFontSize[scaleMarkerDialog.settingsControlsGroup.fontGroup.fontSizeDropDown.selection.index], "pt");;
		
		//font selected.
		dd = scaleMarkerDialog.settingsControlsGroup.fontGroup.fontNameDropDown;
		for (var i = 0; i < dd.items.length; i++) {
			if (dd.selection.text == dropDownFontFaceName[i]) {
				settings.textFontName = dropDownFontName[i];
				break;
			}
		}
		return true;
	}
	else {   // 0: window close button; 2: Cancel button
		return false;
	}
}

/**
 * Create a layer group to contain all the layers used in the scale marker.
 *
 * @return Reference to the layer group.
 */
function createLayerGroup() {
	var	layerGroup = app.activeDocument.layerSets.add();
	layerGroup.name = layerGroupName;

	return layerGroup;
}

/**
 * Determine the locations for the text and graphic portions of
 * the scale marker.  Values stored in global vars.
 */
function determineLocations() {
	graphicLeft = baseLeft;
	graphicTop = baseBottom - graphicHeight;

	if (settings.displayText && settings.textPositionBottom) {
		textLocation = [new UnitValue(baseLeft, "px"), new UnitValue(baseBottom, "px")];
		var textFontSizeInPx = settings.textFontSize.as("px") * scale; // going from inches to pixels like this assumes a resolution of 72 px/in, so we need to multiply by the resolution scale
		graphicTop -= (textFontSizeInPx + textGraphicMargin);
	}
	else if (settings.displayText && !settings.textPositionBottom) {
		textLocation = [new UnitValue(baseLeft, "px"), new UnitValue(baseBottom - (graphicHeight + textGraphicMargin), "px")];
	}
}

/**
 * This function creates the text for the scale marker
 * 
 * @layerGroup The layergroup to create/put this text layer in.
 */
function createText(layerGroup) {
	if (settings.displayText) {
		// Create a new text layer in the specified layer group
		var	textLayer = layerGroup.artLayers.add();
		textLayer.kind = LayerKind.TEXT;

		// Create the text object
		var scaleMarkerText = textLayer.textItem;
		scaleMarkerText.position = textLocation;
		scaleMarkerText.color = settings.markerColor;
		scaleMarkerText.size = settings.textFontSize;

		// Find the real font to use - if it doesn't get found, then the current
		// font will get used instead
		for (var i = 1; i < app.fonts.length; i++) {
			var aFont = app.fonts[i];
			if (aFont.name == settings.textFontName) {
				scaleMarkerText.font = aFont.postScriptName;
			}
		}

		// Finally, set the contents/text
		scaleMarkerText.contents = scaleMarkerActualLength + " " + logicalUnits;

		return textLayer;
	}
}

/**
 * Utility function to make a point we use in our marker path:
 * paths only take points, so we build a point using a pixel
 * based location and then convert it to point units.
 */
function makePoint(x, y) {
	var aPoint = new PathPointInfo;
	aPoint.kind = PointKind.CORNERPOINT;

	var docResolution = app.activeDocument.resolution;
	var pixelLoc = UnitValue(x, "px");
	pixelLoc.baseUnit = UnitValue(1/docResolution, "in");
	var xPoint = pixelLoc.as("pt");
	pixelLoc = UnitValue(y, "px");
	pixelLoc.baseUnit = UnitValue(1/docResolution, "in");
	var yPoint = pixelLoc.as("pt");
	aPoint.anchor = Array(xPoint, yPoint);

	aPoint.leftDirection = aPoint.anchor
	aPoint.rightDirection = aPoint.anchor;

	return aPoint;
}

/**
 * Create the scale marker as a filled path on its own layer.
 * 
 * @layerGroup The layergroup to create/put this text layer in.
 */
function createGraphic(layerGroup) {
	// Create a new layer in the layer group
	var	pathLayer = layerGroup.artLayers.add();
	pathLayer.kind = LayerKind.NORMAL;
	pathLayer.name = localize("$$$/JavaScripts/MeasurementScaleMarker/GraphicLayerName=Marker Graphic");

	// Save the current preferences, and switch to display no dialogs
	var startDisplayDialogs = app.displayDialogs;
	app.displayDialogs = DialogModes.NO;

	var pixelsPerLogicalUnit = pixelLength / logicalLength;

	var graphicRight = graphicLeft + (scaleMarkerActualLength * pixelsPerLogicalUnit);
	if (graphicRight <= graphicLeft + 1)
		graphicRight = graphicLeft + 1;
	var graphicBottom = graphicTop + graphicHeight;

	// Grab the document origin and offset the graphic coordinates
	documentOrigin = getDocumentOrigin();
	graphicLeft -= documentOrigin[0];
	graphicRight -= documentOrigin[0];
	graphicTop -= documentOrigin[1];
	graphicBottom -= documentOrigin[1];

	// Figure out all of our points/bounding box
	var points = new Array();
	points[0] = makePoint(graphicRight, graphicBottom);
	points[1] = makePoint(graphicLeft, graphicBottom);
	points[2] = makePoint(graphicLeft, graphicTop);
	points[3] = makePoint(graphicRight, graphicTop);

	// Create our path by supplying path segments that are lines made up of the
	// points defined above
	var aSubPath = new SubPathInfo();
	aSubPath.operation = ShapeOperation.SHAPEADD;
	aSubPath.closed = true;
	aSubPath.entireSubPath = points;

	// Now add the path to the document and set the color to draw with
	var myPathItem = app.activeDocument.pathItems.add(localize("$$$/JavaScripts/MeasurementScaleMarker/PathName=Measurement Scale Marker Path"), new Array(aSubPath));
	// There is a bug in fillPath - it uses the foreground color instead of the
	// color passed in, so temporarily set the foreground color, draw, then set
	// it back when we're done.
	var origForeground = app.foregroundColor;
	app.foregroundColor = settings.markerColor;
	myPathItem.fillPath(settings.markerColor, ColorBlendMode.NORMAL, 100, false, 0.0, true, false);
	app.foregroundColor = origForeground;
	myPathItem.remove();

	// Reset the application preferences
	displayDialogs = startDisplayDialogs;

	return pathLayer;
}

/**
 * Function: objectToDescriptor
 * Usage: create an ActionDescriptor from a JavaScript Object
 * Input: JavaScript Object (o)
 *        Pre process converter (f)
 * Return: ActionDescriptor
 * NOTE: Only boolean, string, and number are supported, use a pre processor
 *       to convert (f) other types to one of these forms.
 */
function objectToDescriptor (o, f) {
	if (undefined != f) {
		o = f(o);
	}
	var d = new ActionDescriptor;
	var l = o.reflect.properties.length;
	for (var i = 0; i < l; i++ ) {
		var k = o.reflect.properties[i].toString();
		if (k == "__proto__" || k == "__count__" || k == "__class__" || k == "reflect")
			continue;
		var v = o[ k ];
		k = app.stringIDToTypeID(k);
		switch ( typeof(v) ) {
			case "boolean":
				d.putBoolean(k, v);
				break;
			case "string":
				d.putString(k, v);
				break;
			case "number":
				d.putDouble(k, v);
				break;
			default:
				throw( new Error("Unsupported type in objectToDescriptor " + typeof(v) ) );
		}
	}
    return d;
}


/**
 * Function: descriptorToObject
 * Usage: create a JavaScript Object from an ActionDescriptor
 * Input: ActionDescriptor
 * Return: JavaScript Object (o)
 *         Post process converter (f)
 * NOTE: Only boolean, string, and number are supported, use a post processor
 *       to convert (f) other types to one of these forms.
 */
function descriptorToObject (d, f) {
	var o = new Object();
	var l = d.count;
	for (var i = 0; i < l; i++ ) {
		var k = d.getKey(i);
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
			case DescValueType.INTEGERTYPE:
			case DescValueType.ALIASTYPE:
			case DescValueType.CLASSTYPE:
			case DescValueType.ENUMERATEDTYPE:
			case DescValueType.LISTTYPE:
			case DescValueType.OBJECTTYPE:
			case DescValueType.RAWTYPE:
			case DescValueType.REFERENCETYPE:
			case DescValueType.UNITDOUBLE:
			default:
				throw( new Error("Unsupported type in descriptorToObject " + t ) );
		}
	}
	if (undefined != f) {
		o = f(o);
	}
    return o;
}

/**
 * Convert settings values to strings to remember for the next
 * time.
 * @return JavaScript Object with objects converted to strings
 *         for storage
 */
function settingsObjectToDescriptorValues(o) {
	o.scaleMarkerLength = o.scaleMarkerLength.toString();
	o.displayText = o.displayText.toString();
	o.markerColor = o.markerColor.rgb.hexValue;
	o.textPositionBottom = o.textPositionBottom.toString();
	o.textFontName = o.textFontName.toString();
	o.textFontSize = o.textFontSize.toString();
	return o;
}

/**
 * Convert strings from storage to settings JavaScript object
 * @return JavaScript settings object
 */
function settingsObjectFromDescriptorValues(o) {
	o.scaleMarkerLength = eval(o.scaleMarkerLength);
	o.displayText = eval(o.displayText);
	var markerColorHexValue = o.markerColor;
	o.markerColor = new SolidColor;
	o.markerColor.model = ColorModel.RGB;
	o.markerColor.rgb.hexValue = markerColorHexValue;
	o.textPositionBottom = eval(o.textPositionBottom);
	o.textFontSize = UnitValue(o.textFontSize);
	return o;
}

/**
 * Get the document origin.
 */
function getDocumentOrigin() {
	var		classDocument;
	var		classProperty;
	var		typeOrdinal;
	var		enumTarget;
	var		keyRulerOriginH;
	var		keyRulerOriginV;
	
	classDocument = app.charIDToTypeID('Dcmn');
	classProperty = app.charIDToTypeID('Prpr');
	typeOrdinal = app.charIDToTypeID('Ordn');
	enumTarget = app.charIDToTypeID('Trgt');
	keyRulerOriginH = app.charIDToTypeID('RlrH');
	keyRulerOriginV = app.charIDToTypeID('RlrV');

	var		documentOrigin;
	var		reference;
	var		descriptor;

	// Default
	documentOrigin = new Array();
	documentOrigin[0] = 0;
	documentOrigin[1] = 0;

	// Create a reference to the horizontal origin
	reference = new ActionReference();
	reference.putProperty(classProperty, keyRulerOriginH);
	reference.putEnumerated(classDocument, typeOrdinal, enumTarget);

	// Grab the horizontal origin
	descriptor = executeActionGet(reference);
	if (descriptor.hasKey(keyRulerOriginH))
		documentOrigin[0] = descriptor.getInteger(keyRulerOriginH) >> 16;

	// Create a reference to the horizontal origin
	reference = new ActionReference();
	reference.putProperty(classProperty, keyRulerOriginV);
	reference.putEnumerated(classDocument, typeOrdinal, enumTarget);

	// Grab the horizontal origin
	descriptor = executeActionGet(reference);
	if (descriptor.hasKey(keyRulerOriginV))
		documentOrigin[1] = descriptor.getInteger(keyRulerOriginV) >> 16;

	return documentOrigin;
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
					  KeyIsDecimalPoint (event) ||
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

function KeyIsDecimalPoint (event) {
	return (event.keyName == 'Decimal' || event.keyName == 'Period') &&  ! KeyHasModifier (event);
}

function KeyIsNumeric (event) {
    return  (event.keyName >= '0') && (event.keyName <= '9') && ! KeyHasModifier (event);
}

function KeyIsDelete (event) {
    //    Shift-delete is ok
    return (event.keyName == 'Backspace') && ! (event.ctrlKey);
}

function KeyIsLRArrow (event) {
    return ((event.keyName == 'Left') || (event.keyName == 'Right')) && ! (event.altKey || event.metaKey);
}

function KeyIsTabEnterEscape (event) {
	return event.keyName == 'Tab' || event.keyName == 'Enter' || event.keyName == 'Escape';
}

// end of MeasurementScaleMarker.jsx