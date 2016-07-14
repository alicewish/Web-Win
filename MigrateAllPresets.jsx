////////////////////////////////////////////////////////////////////////////
// ADOBE SYSTEMS INCORPORATED
// Copyright 2010 Adobe Systems Incorporated
// All Rights Reserved

// NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
// terms of the Adobe license agreement accompanying it.  If you have received this file from a
// source other than Adobe, then your use, modification, or distribution of it requires the prior
// written permission of Adobe.

// Adobe Photoshop QE / DI Pro Tools Team
// Email: DL-PS-External-Bugs-Tools@adobe.com
// Script File: MigrateAllPresets.jsx
// Script Dev: Kaori Mikawa, Barkin Aygun
// Script QE: Kyoko Itoda, Irina Satanovskaya

// This script carries over your presets and workspaces files from CS5.1, CS5, CS4 and CS3 in order,
// not picking up already existing ones. 
// It does it quietly, and within Photoshop, is designed to run in first launch
/////////////////////////////////////////////////////////////////////////////
/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING
<javascriptresource>
<name>$$$/JavaScripts/MigratePresets/Menu=Migrate Presets...</name>
<menu>help</menu>
</javascriptresource>
// END__HARVEST_EXCEPTION_ZSTRING
*/
#target photoshop;
$.localize = true;

try{ 
    app.bringToFront();
    app.displayDialogs = DialogModes.NO;
    
    var migrationComplete = false;
    var errorToQuit;
    
    var versionstrs = new Array("CS5.1", "CS5", "CS4", "CS3");
    var versionflags = new Array();
    for (i = 0; i < versionstrs.length; i++) {
            versionflags.push(false);
    }
    //ZSTRING
    var titleFileMigration = localize("$$$/MigratePresets/DialogTitle=Migrate Presets");
    var msgComplete = localize("$$$/MigratePresets/MessageComplete=Presets have been successfully migrated. Restart Photoshop for changes to take effect.");
    var msgCompleteError = localize("$$$/MigratePresets/MessageError=An error occurred when migrating the presets. Preset migration failed.");
    var msgAdmin = localize("$$$/MigratePresets/MessageAdmin=Administrative privileges are required to migrate these presets.");
    var msgWrongVersion = localize("$$$/MigratePresets/MessageWrongVersion=This script is intended for Photoshop CS6. Launch Photoshop CS6 and try again.");
    var noFileSelected = localize("$$$/MigratePresets/MessageNoFile=No file is selected to migrate.");
    var msgMigrate =localize("$$$/MigratePresets/MessageConfirm=Would you like to migrate presets from the following versions?^n");
    var titleConfirmDialog = localize("$$$/MigratePresets/ConfirmTitle=Migrate Presets From Previous Versions of Adobe Photoshop");
    
    var curOS = getCurOS($.os);
    var appVer = getAppVer();
    var dirCommonFiles = getDirCommonFiles(); 
    var dirUserData = getDirUserData();
    var dirUserPreferencesMac = getDirUserPreferencesMac();
     
    var dirUserPresets = new Folder(dirUserData + "/Adobe/Adobe Photoshop CS6/Presets");
    var dirUserWorkspaces = new Folder();
    if(curOS.match("mac")){
        dirUserWorkspaces = new Folder(dirUserPreferencesMac + "/Adobe Photoshop CS6 Settings/WorkSpaces");
    }else{
        dirUserWorkspaces = new Folder(dirUserData + "/Adobe/Adobe Photoshop CS6/Adobe Photoshop CS6 Settings/WorkSpaces");
    }
   
    var fileItems = new Array();
    var fileToMigrate = new Array();
    var objFolderName = "";
        
    // -----------------------------------------
    // User Presets
    // -----------------------------------------
    var arrayUserFolderPresetsTo = new Array();
    var arrayUserFolderPresetsFrom = new Array();
    var arrayUserFolderPresetsDiff = new Array();
    var arrayUserFolderPresetsDiffDont = new Array();
    var userFolderPresetsDiffTotal = 0;
     // -----------------------------------------
    // User Workspaces
    // -----------------------------------------
    var arrayUserFolderWorkspacesTo = new Array();
    var arrayUserFolderWorkspacesFrom = new Array();
    var arrayUserFolderWorkspacesDiff = new Array();
    var arrayUserFolderWorkspacesDiffDont = new Array();
    var userFolderWorkspacesDiffTotal = 0;

    var result = "success";
    
    var ctrVersion = 0;
    if (checkMigrateIsNecessary()) {
        if(appVer == 13){
            for (i = 0; i < versionstrs.length; i++){
                if (versionflags[i] == true) {
                    msgMigrate = msgMigrate + "Adobe Photoshop " + versionstrs[i] +"\n";
                } 
                ctrVersion = ctrVersion + 1; 
            }
            if (confirm(msgMigrate, false, titleConfirmDialog)) {
            	for (i = 0; i < versionstrs.length; i++) {
	            	if (versionflags[i] == true) {
	            		migrateAll(versionstrs[i]);
	            	}
	            }
        	} else {
        		result = "failure";
        	}
        }else{
            alert(msgWrongVersion, titleFileMigration);
        }
    } else {
        result = "nothing";
    }// else die quietly, since there is nothing to do
    result;
        
}catch(e){
	alertScriptError("Line: " + e.line +" - "+ e);
}

/****************************************
 * checkMigrateIsNecessary
 ****************************************/
function checkMigrateIsNecessary()
{
    var migrateNecessary= false;
    for (i = 0; i < versionstrs.length; i++){
        refreshDiffData(versionstrs[i]);
        if (arrayUserFolderPresetsDiff.length == 0 && arrayUserFolderWorkspacesDiff.length == 0) {
            versionflags[i] = false;
        } else {
            versionflags[i] = true;
            migrateNecessary = true;
        }
    }
    return migrateNecessary;
}

/****************************************
 * migrateAll
 ****************************************/
function migrateAll(versionstr){
    refreshDiffData(versionstr);
    if (arrayUserFolderPresetsDiff.length == 0 && arrayUserFolderWorkspacesDiff.length == 0) {
        return;
    }
    migrateFiles(arrayUserFolderPresetsDiff, versionstr);
    migrateFiles(arrayUserFolderWorkspacesDiff, versionstr);
}


/****************************************
 * refreshListBoxes
 ****************************************/
function refreshDiffData(versionstr){
    dirUserPresetsFrom = new Folder(dirUserPresets.toString().replace(/CS6/g,versionstr));
    dirUserWorkspacesFrom = new Folder(dirUserWorkspaces.toString().replace(/CS6/g,versionstr));
   
    // -----------------------------------------
    // User Presets
    // -----------------------------------------
    arrayUserFolderPresetsTo = getDirContents(dirUserPresets.getFiles());  
    arrayUserFolderPresetsFrom = getDirContents(dirUserPresetsFrom.getFiles()); 
    arrayUserFolderPresetsDiff = getMissingFiles(arrayUserFolderPresetsFrom,arrayUserFolderPresetsTo);
    arrayUserFolderPresetsDiffDont = new Array();
    userFolderPresetsDiffTotal = arrayUserFolderPresetsDiff.length;
    // -----------------------------------------
    // User Workspaces
    // -----------------------------------------
    arrayUserFolderWorkspacesTo = getDirContents(dirUserWorkspaces.getFiles());
    arrayUserFolderWorkspacesFrom = getDirContents(dirUserWorkspacesFrom.getFiles());
    arrayUserFolderWorkspacesDiff = getMissingFiles(arrayUserFolderWorkspacesFrom,arrayUserFolderWorkspacesTo);
    arrayUserFolderWorkspacesDiffDont = new Array();
    userFolderWorkspacesDiffTotal = arrayUserFolderWorkspacesDiff.length;
}

/****************************************
 * migrateFiles
 ****************************************/
function migrateFiles(filesToMigrate, versionstr){
    //quietly return if there is nothing to migrate
    if(filesToMigrate.length == 0){
        return;
    }
    
    var migrationRes = showProgress();
    if(!migrationRes){
        alert(msgCompleteError, titleFileMigration, true);
    }

    function showProgress(){
        try{
            var winProgBar = new Window("palette", titleFileMigration); 
            winProgBar.progBarLabel = winProgBar.add("statictext", [20, 20, 320, 35], titleFileMigration);
            winProgBar.center();
            winProgBar.show();
 
            for(var i=0; i<filesToMigrate.length;i++){
                var targetFolder = Folder(filesToMigrate[i][1].parent.toString().replace(RegExp(versionstr, "gi"),"CS6"));
                var targetFile = targetFolder+"/"+filesToMigrate[i][1].name;   
                winProgBar.progBarLabel.text = filesToMigrate[i][1];
                if(!targetFolder.exists){
                    var createFolder = targetFolder.create();
                }
                if(targetFolder.exists){
                    var fileCopy = filesToMigrate[i][1].copy(targetFile);
                    if(filesToMigrate[i][0] == "Actions"){
                        load(File(targetFile));
                    }
                }
                if(!fileCopy){
                    alertScriptError("Line: " + $.line +" - " + localize("$$$/MigratePresets/MessageCopyFail=An error occurred when migrating the preset from...") +"\n" + decodeURI(filesToMigrate[i][1]) + "\nto...\n" + decodeURI(targetFile) + "\n\n" + msgAdmin);
                }
                if(!File(targetFile).exists){
                    alertScriptError("Line: " + $.line +" - " + localize("$$$/MigratePresets/MessageCopyFail2=An error occurred when migrating the preset from...") + decodeURI(filesToMigrate[i][1].name));
                }
             }
            winProgBar.close();
            return true;
        }catch(e){
            alertScriptError("Line: " + e.line +" - "+ e);
        }
    }
}


/****************************************
 * getMissingFiles
 ****************************************/
function getMissingFiles(fromArray,toArray) {
    var diffItems = new Array();
    try{
        for(var x=0;x<fromArray.length;x++){
            if(!include(toArray,fromArray[x][1].name)){
                diffItems.push(fromArray[x]);
            }
        }
    }catch(e){
        alertScriptError(y + "Line: " + e.line +" - "+ e);
    }
    return diffItems;
}

function include(arr, obj) {
  for(var i=0; i<arr.length; i++) {
    if (arr[i][1].name == obj) return true;
  }
}

/****************************************
 * getDirContents
 ****************************************/
function getDirContents(tmpFolderItems) {
    fileItems = new Array();
    getFiles(tmpFolderItems,fileItems);
    return fileItems;
}
/****************************************
 * getFiles
 ****************************************/
function getFiles(tmpFolderItems) {

    var objItem;
    
    for (var i=0;i<tmpFolderItems.length;i++){
        objItem = tmpFolderItems[i];
        if (objItem instanceof Folder){
            objFolderName = objItem.name;
            getFiles(objItem.getFiles());
        } else if ( -1 != objItem.fsName.indexOf(".DS_Store")){
            continue;	// Skip Mac's hidden file
        } else {
           fileItems.push(new Array(objItem.parent.name,objItem));
        }
    }
    objItem = null;
}

/****************************************
 * getDirApp
 ****************************************/
function getDirApp(){
    /*
    The full path of the location of the Adobe Photoshop application.
    */
    return app.path;
}

/****************************************
 * getDirCommonFiles
 ****************************************/
function getDirCommonFiles(){
    /*
    In Windows, the value of %CommonProgramFiles% (by default, C:\\Program Files\\Common Files)
    In Mac OS, /Library/Application Support
    */
    return Folder.commonFiles;
}

/****************************************
 * getDirUserData
 ****************************************/
function getDirUserData(){
    /*
    In Windows, the value of %USERDATA% (by default, C:\\Documents and Settings\\ username \\Application Data) 
    In Mac OS, ~/Library/Application Support.
    */
    return Folder.userData;
}
/****************************************
 * getDirUserPreferencesMac
 ****************************************/
function getDirUserPreferencesMac(){
    /*
    In Windows, the value of %USERDATA% (by default, C:\\Documents and Settings\\ username \\Application Data) 
    In Mac OS, ~/Library/Application Support.
    */
    var tempUserData = decodeURI(Folder.userData).toString().replace("Application Support", "Preferences");
    return Folder(tempUserData);
}

/****************************************
 * alertScriptError
 ****************************************/
function alertScriptError(msg){
	alert(msg,"File Migration Error",true);
	errorToQuit++;
}

/****************************************
 * getCurOS
 ****************************************/
function getCurOS(curOS){
	try{
		var myOS;
		if(curOS.match("Macintosh")){
			myOS = "mac";
		}else if(curOS.match("XP")){
			myOS = "winxp";
		}else if(curOS.match("Vista")){
			myOS = "winvista";
		}else{
			myOS = "win7";
		}
		return myOS;
    }catch(e){
        alertScriptError("Line: " + $.line +" - "+ e);
    }
}
/****************************************
 * getAppVer
 ****************************************/
function getAppVer(){
	try{
        var curAppVer = app.version;
        var arrayAppVer = curAppVer.split("."); 
        return parseInt(arrayAppVer[0]);
    }catch(e){
        alertScriptError("Line: " + $.line +" - "+ e);
    }
}