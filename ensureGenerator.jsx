// (c) Copyright 2014 Adobe Systems, Inc. All rights reserved.
// Written by Jim Doubek
// based on the ADM Mode Change by Joe Ault from 1998

/*
@@@BUILDINFO@@@ ensureGenerator.jsx 1.0.0.0
*/

/* Special properties for a JavaScript to enable it to behave like an automation plug-in, the variable name must be exactly 
   as the following example and the variables must be defined in the top 10000 characters of the file, 

   The item tagged "name" specifies the localized name or ZString that will be displayed in the menu
   
   You also need to set the value of the pluginName variable below to match the name of your plugin as the Generator process knows it.
   
   Do not change the values "name", or "generateAssets" in the code below.

*/

var pluginName = "preview-dummy-menu";

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
$.level = 0;
//debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

var gScriptResult;

// the main routine
try { 
	var generatorDesc = new ActionDescriptor();
	generatorDesc.putString (app.stringIDToTypeID ("name"), pluginName);
	var returnDesc = executeAction( app.stringIDToTypeID ("generateAssets"), generatorDesc, DialogModes.NO );
}
// In case anything goes wrong.
catch( e ) {
    gScriptResult = 'cancel';
}

