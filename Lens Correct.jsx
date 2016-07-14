﻿// (c) Copyright 2009.  Adobe Systems, Incorporated.  All rights reserved.
//
// Lens Correct automation in JavaScript
//
// 
// Copy the .jsx file to Adobe Photoshop CS5/Presets/Scripts and
// .eve file to Adobe Photoshop CS5/Presets/Scripts/Stack Scripts Only/
//

/*
@@@BUILDINFO@@@ Lens Correct.jsx 1.0.0.2
*/

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/LensCorrect/Menu=Lens Correction...</name>
<menu>automate</menu>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING
*/

// on localized builds we pull the $$$/Strings from a .dat file
$.localize = true;

// Put header files in a "Stack Scripts Only" folder.  The "...Only" tells
// PS not to place it in the menu.  For that reason, we do -not- localize that
// portion of the folder name.
var g_StackScriptFolderPath = app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/"
                                    + localize("$$$/private/Exposuremerge/StackScriptOnly=Stack Scripts Only/");

$.evalFile(g_StackScriptFolderPath + "LatteUI.jsx");
$.evalFile(g_StackScriptFolderPath + "StackSupport.jsx");
$.evalFile(g_StackScriptFolderPath + "CreateImageStack.jsx");

// Keeps the settings of the script dialog
function LensCorrect( )
{
    
    this.jpegTypeItem = "JPG";
    this.pngTypeItem = "PNG";
    this.psdTypeItem = "PSD";
    this.tiffTypeItem = "TIFF";

    this.edgeExtension = localize("$$$/LensCorrect/Dialog/FillType/Popup/EdgeExtension=Edge Extension");
    this.edgeTransparency = localize("$$$/LensCorrect/Dialog/FillType/Popup/Transparency=Transparency");
    this.edgeBlackColor = localize("$$$/LensCorrect/Dialog/FillType/Popup/BlackColor=Black Color");
    this.edgeWhiteColor = localize("$$$/LensCorrect/Dialog/FillType/Popup/WhiteColor=White Color");
    
    this.outFolder = null;
    this.lcpFile = null;
    this.saveType = this.psdTypeItem;
    this.edgeType = this.edgeTransparency;
    this.correctGD = true;
    this.correctCA = false;
    this.correctVg = false;
    this.autoScale = true;
    this.autoMatch = true;


    //This is an example descriptor code
    //IT IS NOT USED IN THIS EXAMPLE, HERE FOR DOCUMENTATION PURPOSES
    //If it's not defined/passed in, plugin will use default values
/*
    var lcpDesc = new ActionDescriptor();
    //Auto Correct Geometric Distortion
    var idLnAg = charIDToTypeID( "LnAg" );
    lcpDesc.putBoolean( idLnAg, true );
    //Auto Correct Chromatic Aberration
    var idLnAc = charIDToTypeID( "LnAc" );
    lcpDesc.putBoolean( idLnAc, true );
    //Auto Vignette Removal
    var idLnAv = charIDToTypeID( "LnAv" );
    lcpDesc.putBoolean( idLnAv, true );
    //Auto Scale Image
    var idLnAs = charIDToTypeID( "LnAs" );
    lcpDesc.putBoolean( idLnAs, true );
    //Auto Profile Interpolation
    var idLnIp = charIDToTypeID( "LnIp" );
    lcpDesc.putBoolean( idLnIp, false );
    //Focus Distance
    var idLnFo = charIDToTypeID( "LnFo" );
    lcpDesc.putDouble( idLnFo, 0.000000 );
    //LCP Path (this descriptor is used in this code, so below is another example)
    var idLnPp = charIDToTypeID( "LnPp" );
    lcpDesc.putString( idLnPp, "" );
    //Applied Lens Profile
    var idLnPr = charIDToTypeID( "LnPr" );
    lcpDesc.putString( idLnPr, "" );					// setup null profile
    
    //CUSTOM SETTINGS
    //Distortion Amount
    var idLnIa = charIDToTypeID( "LnIa" );
    lcpDesc.putDouble( idLnIa, 0.000000 );
    //Distortion Coefficient 0
    var idLnIzero = charIDToTypeID( "LnI0" );
    lcpDesc.putDouble( idLnIzero, 0.000000 );
    //Distortion Coefficient 1
    var idLnIone = charIDToTypeID( "LnI1" );
    lcpDesc.putDouble( idLnIone, 0.000000 );
    //Distortion Coefficient 2
    var idLnItwo = charIDToTypeID( "LnI2" );
    lcpDesc.putDouble( idLnItwo, 0.000000 );
    //Distortion Coefficient 3
    var idLnIthree = charIDToTypeID( "LnI3" );
    lcpDesc.putDouble( idLnIthree, 1.000000 );
    //Rotation Angle
    var idLnRa = charIDToTypeID( "LnRa" );
    lcpDesc.putDouble( idLnRa, 0.000000 );
    //Vertical Perspective
    var idLnVp = charIDToTypeID( "LnVp" );
    lcpDesc.putDouble( idLnVp, 0.000000 );
    //Horizontal Perspective
    var idLnHp = charIDToTypeID( "LnHp" );
    lcpDesc.putDouble( idLnHp, 0.000000 );
    //Correction Size
    var idLnSi = charIDToTypeID( "LnSi" );
    lcpDesc.putDouble( idLnSi, 100.000000 );
    //Edge Fill Type
    var idLnFt = charIDToTypeID( "LnFt" );
    lcpDesc.putInteger( idLnFt, 2 );
    //Vignette Amount
    var idLnSb = charIDToTypeID( "LnSb" );
    lcpDesc.putDouble( idLnSb, 0.000000 );
    //Vignette Midpoint
    var idLnSt = charIDToTypeID( "LnSt" );
    lcpDesc.putInteger( idLnSt, 50 );
    //Aberration Red/Cyan
    var idLnRc = charIDToTypeID( "LnRc" );
    lcpDesc.putDouble( idLnRc, 0.000000 );
    //Aberration Green/Magenta
    var idLnGm = charIDToTypeID( "LnGm" );
    lcpDesc.putDouble( idLnGm, 0.000000 );
    //Aberration Blue/Yellow
    var idLnBy = charIDToTypeID( "LnBy" );
    lcpDesc.putDouble( idLnBy, 0.000000 );
    //Grid Size
    var idLnNa = charIDToTypeID( "LnNa" );
    lcpDesc.putInteger( idLnNa, 64 );
    //Grid Horizontal Offset
    var idLnIh = charIDToTypeID( "LnIh" );
    lcpDesc.putInteger( idLnIh, 0 );
    //Grid Vertical Offset
    var idLnIv = charIDToTypeID( "LnIv" );
    lcpDesc.putInteger( idLnIv, 0 );
    //Grid Color
    var idLnIs = charIDToTypeID( "LnIs" );
        var desc4 = new ActionDescriptor();
        var idRd = charIDToTypeID( "Rd  " );
        desc4.putDouble( idRd, 127.000000 );
        var idGrn = charIDToTypeID( "Grn " );
        desc4.putDouble( idGrn, 127.000000 );
        var idBl = charIDToTypeID( "Bl  " );
        desc4.putDouble( idBl, 127.000000 );
    var idRGBC = charIDToTypeID( "RGBC" );
    lcpDesc.putObject( idLnIs, idRGBC, desc4 );
    //Show Grid
    var idLnNm = charIDToTypeID( "LnNm" );
    lcpDesc.putBoolean( idLnNm, false );
*/
}


lensCorrect = new LensCorrect ();

LensCorrect.prototype.runOnInput = function(files, destPath)
{
    function OrganizeOutfiles( inFiles, extension ) {
        //Make sure inFiles comes in here sorted
        var noExtNames = new Array;
        var f;
        for (f in inFiles) {
            var lastDot = inFiles[f].file.name.lastIndexOf( "." );
            if (lastDot == -1) {
                //We should never be here
                return null;
            }
            var fname = inFiles[f].file.name.substr( 0, lastDot);
            noExtNames.push(fname);
        }
        noExtNames.sort();
        var finalFiles = new Array;
        for (var i = 0; i < noExtNames.length; i++) {
            if (i > 0 && noExtNames[i].toUpperCase() == noExtNames[i-1].toUpperCase())
                finalFiles.push(inFiles[i].file.name + "." + extension);
            else if (i < noExtNames.length - 1 && noExtNames[i].toUpperCase() == noExtNames[i+1].toUpperCase())
                finalFiles.push(inFiles[i].file.name + "." + extension);
            else
                finalFiles.push(noExtNames[i] + "." + extension);
                
        }
        return finalFiles;
    }
    
    var bitWarningShown = false;
    var idLnCr = charIDToTypeID( "LnCr" );
    var args = new ActionDescriptor();
    var idLnPp = charIDToTypeID( "LnPp" );
    if (!this.autoMatch && this.lcpFile != null && this.lcpFile.exists)
      args.putString( idLnPp, this.lcpFile.fsName );	// setup the full lcp file path
    else
      args.putString( idLnPp, "" );
	
    //Auto Correct Geometric Distortion
    var idLnAg = charIDToTypeID( "LnAg" );
    args.putBoolean( idLnAg, Boolean(this.correctGD) );
    //Auto Correct Chromatic Aberration
    var idLnAc = charIDToTypeID( "LnAc" );
    args.putBoolean( idLnAc, Boolean(this.correctCA));
    //Auto Vignette Removal
    var idLnAv = charIDToTypeID( "LnAv" );
    args.putBoolean( idLnAv, Boolean(this.correctVg));
    //Auto Scale Image
    var idLnAs = charIDToTypeID( "LnAs" );
    args.putBoolean( idLnAs, Boolean(this.autoScale));
    var idLnFt = charIDToTypeID( "LnFt" );
    
    switch (this.edgeType)
    {
        case this.edgeExtension:
        {
            args.putInteger( idLnFt, 1);
            break;
        }
        case this.edgeTransparency:
        {
            args.putInteger( idLnFt, 2);
            break;
        }
        case this.edgeBlackColor:
        {
            args.putInteger( idLnFt, 3);
            break;
        }
        case this.edgeWhiteColor:
        {
            args.putInteger( idLnFt, 4);
            break;
        }
        default:
        {
            args.putInteger( idLnFt, 1);
            break;
        }
    }

    var i;
    var filenum = 0;
    files.sort();
    var outfiles = OrganizeOutfiles ( files, this.saveType );        
        
    try {
        for (i in files)
        {
            open (files[i].file);
            app.activeDocument.flatten();

            //Document checks
            // Note: All the false (rejection) clauses must come before true ones.
            if (app.activeDocument.bitsPerChannel == BitsPerChannelType.THIRTYTWO)
            {
                if (!bitWarningShown)
                {
                    bitWarningShown = true;
                    var warning = "$$$/AdobePlugin/Shared/Exposuremerge/Auto/EMNo32bit= can not merge 32 bit source files.  They will be skipped";
                    var pluginName = "$$$/AdobePlugin/Shared/LensCorrect/Process/Name=Lens Correction";
                    alert( localize(pluginName) + localize(warning), pluginName, true );
               }
           
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            filenum++;
            continue;
            }
            
            if (app.activeDocument.mode == DocumentMode.BITMAP)
                app.activeDocument.changeMode( ChangeMode.GRAYSCALE );
            
            // Other conversions happen on layer copy, but these need explicit handling
            if (app.activeDocument.mode != DocumentMode.RGB)
            {
                app.activeDocument.changeMode( ChangeMode.RGB );
            }
            
            var result = executeAction( idLnCr, args, DialogModes.NO );
            app.refresh();
            
            var options;
            switch (this.saveType)
            {
                case this.jpegTypeItem:
                {
                    options = new JPEGSaveOptions;
                    options.quality = 8;
                    break;
                }
                case this.pngTypeItem:
                {
                    options = new PNGSaveOptions;
                    break;
                }
                case this.psdTypeItem:
                {
                    options = new PhotoshopSaveOptions;
                    break;
                }
                case this.tiffTypeItem:
                {
                    options = new TiffSaveOptions;
                    break;
                }
                default:
                {
                    options = new PhotoshopSaveOptions;
                    break;
                }
                    
            }

            // On outside scripts, if output is not specified, we default to /results
            if (!destPath)
                destPath = Folder(File(files[0].file.toString()).parent.fsName + '/results');
            if (!destPath.exists)
                destPath.create();
            var outfile = new File(destPath.fsName.toString() + "/" + outfiles[filenum]);    
            app.activeDocument.saveAs (outfile, options, true);
           
            // close the document
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            filenum++;
       }
        return result;
    }
    catch(err)
    {
        if (err.number != kUserCanceledError)
            alert(err, this.pluginName, true);

        // close the document
        if (app.activeDocument != null) {
          app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);    
        }
        return null;
    }
    return -1;
}

LensCorrect.prototype.showDialog = function( )
{
    var outputSelected        = false;
    var lcpSelected             = false;
    var w                           = latteUI( g_StackScriptFolderPath + 'LensCorrect.exv' );
    var fileMenuItem           = localize("$$$/Project/Exposuremerge/Files/Files=Files");
    var folderMenuItem       = localize("$$$/Project/Exposuremerge/Files/Folder=Folder");
    var openFilesMenuItem  = localize("$$$/Project/Exposuremerge/Files/Open=Open Files");
    var inputFiles                = new Array();
    
    //These are the IDs for the flags in the descriptor, those that
    //match the LC Descriptor use the same ID to avoid confusion
    const kLensCorrectScriptFlags = "LensCorrectScriptFlags001";
    const kLnCorrectGD            = charIDToTypeID("LnAg");
    const kLnCorrectCA            = charIDToTypeID("LnAc");
    const kLnCorrectVg            = charIDToTypeID("LnAv");
    const kLnOutfolder            = charIDToTypeID("LnOF");
    const kLnSaveType             = charIDToTypeID("LnST");
    const kLnEdgeType             = charIDToTypeID("LnFt");
    const kLnAutoScale            = charIDToTypeID("LnAs");
    const kLnLCPFile              = charIDToTypeID("LnPr");
    const kLnAutoMatch            = charIDToTypeID("LnAm");

    function enableControls()
    {
        w.findControl('_browse').enabled = true;
        w.findControl('_remove').enabled = (inputFiles.length > 0) && w.findControl('_fileList').selection;
        w.findControl('_ok').enabled = (inputFiles.length > 0) && outputSelected && (lcpSelected || lensCorrect.autoMatch);
        w.findControl('_chooselcp').enabled = !w.findControl('_automatch').value;
        w.findControl('_lcpFile').enabled = !w.findControl('_automatch').value;
    }
    
    function addFileToList(f)
    {
        var i;
        if (f == null)
            return;

        for (i in inputFiles)
            if (f.toString() == inputFiles[i].file.toString())	// Already in list?
                return;

				// Windows - use filter to skip evil sidecar files
        if ((File.fs == "Windows") && !winFileSelection( f ))
            return;
        
        var fileList = w.findControl('_fileList');
        fileList.add('item', File.decode(f.name) );
        inputFiles.push(new StackElement(f));
    }

    // Code almost similar to ImageStackCreator.prototype.getFilesFromBridgeOrDialog
    // But since we have a custom dialog, we just want the first part
    function getFilesFromBridge()
    {
        var imageStack = new ImageStackCreator( "" , "" );
        if (imageStack.checkForBridgeFiles() || imageStack.checkForLightroomFiles())
        {
            imageStack.stackElements = new Array();
            var j;
            for (j in imageStack.filesFromBridge) {
                if ( isValidImageFile( imageStack.filesFromBridge[j] ) )
                {
                    addFileToList( imageStack.filesFromBridge[j] );
                }
            }
        }
        
        // Add LightroomDocID's
        if ((this.inputFiles != null) && (imageStack.checkForLightroomGlobals()))
        {
            // We want to add the LR "open magic" to the last file, because
            // the list gets reversed in the stack dialog (because that'll match layer order).
            // I.e., the "last" file now becomes the "first" file in the stack,
            // and that's the one the final saved output is going to.
            var lastElem = imageStack.stackElements.length - 1;
            if ((typeof(gLightroomDocID) != "undefined"))
              inputFiles[lastElem].fLightroomDocID = gLightroomDocID;
            if (typeof(gLightroomSaveParams) != "undefined")
              inputFiles[lastElem].fLightroomSaveParams = gLightroomSaveParams;
            if (typeof(gBridgeTalkID) != "undefined")
              inputFiles[lastElem].fLightroomBridgeTalkID = gBridgeTalkID;

            // Check for additional lightroom meta-data that applies to all the images
            if ((typeof(gOpenParamsFromLightroom) != "undefined")
              && gOpenParamsFromLightroom
              && (gOpenParamsFromLightroom.length == inputFiles.length))
            {
              for (j in gOpenParamsFromLightroom)
                  inputFiles[j].fLightroomOpenParams = gOpenParamsFromLightroom[j];
            }
        }
        updateDestination();
    }
    
    function updateDestination()
    {
        if (outputSelected)
            return;
        if (inputFiles[0] != null) 
        {
            lensCorrect.outFolder = Folder(File(inputFiles[0].file.toString()).parent.fsName + '/results');
            w.findControl('_destination').text = lensCorrect.outFolder.fsName;
            outputSelected = true;
        }
    }

    // Dialog event handling routines
    function removeOnClick()
    {
        var i, s;
        var selList = w.findControl('_fileList').selection;
        for (s in selList)
        {
            for (i in inputFiles)
                if (File.decode(inputFiles[i].file.name) == selList[s].text)
                {
                    inputFiles.splice(i,1);
                    break;
                }
            w.findControl('_fileList').remove(selList[s]);
        }
        enableControls();
    }

    function browseOnClick()
    {
        // Spring back to the "File..." menu item
        var menu = w.findControl('_source');
        
        switch (menu.selection.text)
        {
            case fileMenuItem:
            {
                var i, filenames = photoshopFileOpenDialog();
                if (filenames.length)
                {
                    if (File.fs == "Macintosh")	// Mac gratiuitously scrambles them...why?
                        filenames.sort();
                    
                    for (i in filenames)
                        addFileToList( File(filenames[i]) );
                }
                break;
            }
            case folderMenuItem:
            {
                var folder = Folder.selectDialog(localize('$$$/AdobePlugin/Exposuremerge/FolderSelect=Select folder'));
                if (folder)
                {
                    fileList = folder.getFiles( $.os.match(/^Macintosh.*/) ? macFileSelection : winFileSelection );
                    var f;
                    for (f in fileList)
                        addFileToList(fileList[f]);
                }
                break;
            }
        }
        updateDestination();
        enableControls();
    }

    function addOpenDocuments()
    {
        var gaveUnsavedWarning = false;
        // doc.saved is true when a new empty document is created.

        function isReallySaved( doc )
        {
            if (! doc.saved)
                return false;
            try
            {
                var n = doc.fullName;
            }
            catch (err)	// Mainly for err.number == 8103, error.message == "The document has not yet been saved"
            {				// But if anything else goes wrong, we still don't want it.
                return false;
            }
            return true;
        }

        var i, haveUnsavedDocuments = false;
        for (i = 0; i < app.documents.length; i++)
            if (isReallySaved(app.documents[i]))
                addFileToList( File( app.documents[i].fullName ) );
            else
                haveUnsavedDocuments = true;

				if (haveUnsavedDocuments && !gaveUnsavedWarning)
        {
            alert(localize('$$$/AdobePlugin/LensCorrect/Mustsave=Documents must be saved before they can be corrected'));
            gaveUnsavedWarning = true;
            w.findControl('_source').items[0].selected = true;
        }
        updateDestination();
        enableControls();
    }

    function sourceMenuOnChange()
    {
        var menu = w.findControl('_source');
        localUseLayeredDocument = false;

        switch (menu.selection.text) 
        {
            case fileMenuItem:		break;		// default
            case folderMenuItem:		break;
            case openFilesMenuItem:
                addOpenDocuments();
                break;
            case openLayeredDocMenuItem:
                w.findControl('_fileList').removeAll();
                inputFiles = [];
                localUseLayeredDocument = true;
        }
        enableControls();
    }

    function typesOnChange()
    {
        var menu = w.findControl('_filetypes');
        lensCorrect.saveType = menu.selection.text;
    }

    function edgeOnChange()
    {
        var menu = w.findControl('_edgetypes');
        lensCorrect.edgeType = menu.selection.text;
    }

    function listOnChange()
    {
        enableControls();
    }

    function autoMatchOnChange()
    {
        lensCorrect.autoMatch = w.findControl('_automatch').value;
        lcpSelected = (!w.findControl('_automatch').value && lensCorrect.lcpFile != null && lensCorrect.lcpFile.exists);
        enableControls();
    }

    function chooseLcpOnClick()
    {
        var promptLCP = localize("$$$/AdobePlugin/LensCorrect/ChooseLCP=Please select the lens profile (LCP) to apply.");
        lensCorrect.lcpFile = File.openDialog(promptLCP, "*.lcp", false);
        lcpSelected = (lensCorrect.lcpFile != null && lensCorrect.lcpFile.exists);
        if (lcpSelected) {
            w.findControl('_lcpFile').text = lensCorrect.lcpFile.displayName;
        }
        enableControls();
    }

    function chooseDestOnClick()
    {
        var promptOutput = localize("$$$/AdobePlugin/LensCorrect/ChooseDest=Please specify destination file folder:");
        var folderSelect = Folder.selectDialog(promptOutput);
        if (folderSelect != null) {
            lensCorrect.outFolder = folderSelect;
            outputSelected = true;
            w.findControl('_destination').text = lensCorrect.outFolder.fsName;
        }
        enableControls();
    }

    //Main script code starts here
    w.text = localize("$$$/AdobePlugin/Shared/LensCorrect/Process/Name=Lens Correction")
    w.center();

    if (this.introText)
        w.findControl('_intro').text = this.introText;

    //Set up source menu
    var menu = w.findControl('_source');
    menu.add( 'item', fileMenuItem );
    menu.add( 'item', folderMenuItem );
    // The "addOpenDocs" button was added at the last moment.  If it's
    // there, then use that in favor of the menu.
    var addOpenDocsButton = w.findControl('_addOpenDocs');

    // Really, you want to disable the menu, but that's not possible w/ScriptUI
    if (app.documents.length > 0 && !addOpenDocsButton)
        menu.add( 'item', openFilesMenuItem ); 
    menu.items[0].selected = true;
    menu.preferredSize.width = 214;

    w.findControl('_automatch').value = true;
    w.findControl('_correctGD').value = true;
    w.findControl('_correctCA').value = true;
    w.findControl('_vignette').value = true;
    w.findControl('_autoScale').value = true;

    //Save Types
    var filetypemenu = w.findControl('_filetypes');
    filetypemenu.add('item', this.jpegTypeItem);
    filetypemenu.add('item', this.pngTypeItem);
    filetypemenu.add('item', this.psdTypeItem);
    filetypemenu.add('item', this.tiffTypeItem);
    filetypemenu.items[2].selected = true;

    var edgetypemenu = w.findControl('_edgetypes');
    edgetypemenu.add('item', this.edgeExtension);
    edgetypemenu.add('item', this.edgeTransparency);
    edgetypemenu.add('item', this.edgeBlackColor);
    edgetypemenu.add('item', this.edgeWhiteColor);
    edgetypemenu.items[1].selected = true;    

    //Handler setups
    w.findControl('_browse').onClick = browseOnClick;
    w.findControl('_fileList').onChange = listOnChange;
    w.findControl('_remove').onClick = removeOnClick;
    w.findControl('_source').onChange = sourceMenuOnChange;
    w.findControl('_automatch').onClick = autoMatchOnChange;
    w.findControl('_chooselcp').onClick = chooseLcpOnClick;
    w.findControl('_choosedest').onClick = chooseDestOnClick;
    w.findControl('_filetypes').onChange = typesOnChange;
    w.findControl('_edgetypes').onChange = edgeOnChange;

    if (addOpenDocsButton)
    {
        addOpenDocsButton.onClick = addOpenDocuments;
        addOpenDocsButton.enabled = app.documents.length > 0;
    }
    else		
        addOpenDocuments();
       
    // If we already have stackElements (e.g., from Bridge) add them
    if (this.stackElements)
    {
        for (i in this.stackElements)
            addFileToList( this.stackElements[i].file );
    }
    
    // Load sticky settings here
    try {
      var LCDesc = app.getCustomOptions( kLensCorrectScriptFlags );
      this.correctGD = LCDesc.getBoolean ( kLnCorrectGD );
      this.correctCA = LCDesc.getBoolean ( kLnCorrectCA );
      this.correctVg = LCDesc.getBoolean ( kLnCorrectVg );
      this.autoScale = LCDesc.getBoolean ( kLnAutoScale );
      this.autoMatch = LCDesc.getBoolean ( kLnAutoMatch );
      
      this.saveType  = LCDesc.getString  ( kLnSaveType  );
      if (filetypemenu.find(this.saveType))
          filetypemenu.selection = filetypemenu.find(this.saveType);
      
      this.edgeType  = LCDesc.getString  ( kLnEdgeType  );
      if (edgetypemenu.find(this.edgeType))
          edgetypemenu.selection = edgetypemenu.find(this.edgeType);
      if (LCDesc.hasKey( kLnLCPFile ))
      {
          var lcpFileName = File.decode ( LCDesc.getString ( kLnLCPFile ) );
          var templcpfile = File(lcpFileName);
          if (templcpfile && templcpfile.exists)
          {
              this.lcpFile = templcpfile;
              lcpSelected = true;
              w.findControl('_lcpFile').text = this.lcpFile.displayName;
          }
      }
    } 
    catch (e)
    {
      //Default values
      this.correctGD = true;
      this.correctCA = false;
      this.correctVg = false;
      this.autoScale = true;
      this.autoMatch = true;
    }
    
    w.findControl('_automatch').value = this.autoMatch;   
    w.findControl('_correctGD').value = this.correctGD;
    w.findControl('_correctCA').value = this.correctCA;
    w.findControl('_vignette').value = this.correctVg;
    w.findControl('_autoScale').value = this.autoScale;
        
    getFilesFromBridge();
    
    enableControls();

    //Dialog is run here
    var result = w.show();
    if (result != kCanceled)
    {
        this.correctGD       = w.findControl('_correctGD').value;
        this.correctCA       = w.findControl('_correctCA').value;
        this.correctVg = w.findControl('_vignette').value;
        this.autoScale  = w.findControl('_autoScale').value;
        this.autoMatch       = w.findControl('_automatch').value;   
   
        //We set the universal descriptor here
        var LCDesc = new ActionDescriptor();
        LCDesc.putBoolean ( kLnCorrectGD,   Boolean(this.correctGD) );
        LCDesc.putBoolean ( kLnCorrectCA,   Boolean(this.correctCA) );
        LCDesc.putBoolean ( kLnCorrectVg,   Boolean(this.correctVg) );
        LCDesc.putString  ( kLnSaveType,    this.saveType );
        LCDesc.putString  ( kLnEdgeType,    this.edgeType );
        LCDesc.putBoolean ( kLnAutoScale,   Boolean(this.autoScale) );
        LCDesc.putBoolean ( kLnAutoMatch,   Boolean(this.autoMatch) );
        if (this.lcpFile && this.lcpFile.exists)
            LCDesc.putString  ( kLnLCPFile,     this.lcpFile.fsName );
        app.putCustomOptions( kLensCorrectScriptFlags, LCDesc, true);
        
        return inputFiles;
    } else {
        if (File.fs == "Macintosh")
            app.bringToFront();
        return null;
    }
}

LensCorrect.prototype.doInteractiveCorrection = function ()
{
  var files = this.showDialog();
  if (files)
    this.runOnInput(files, this.outFolder);
}

//If we don't reach here through a script, we will show the dialog, otherwise 
//a user script needs to call LensCorrect.runOnInput(...) with their own file list
if ((typeof(runLensCorrectFromScript) == 'undefined') ||
  (runLensCorrectFromScript == false)) {
      lensCorrect.doInteractiveCorrection();
}
