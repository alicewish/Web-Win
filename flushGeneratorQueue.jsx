/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright (c) 2015 Adobe Systems Incorporated. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

/*global ActionDescriptor, executeAction, stringIDToTypeID, DialogModes */

// Required param:
//   - key: The id of the plugin for which to retrieve persistent settings

// ********************************************************************************
var result = "failed";
try {
	var idNS = stringIDToTypeID("idleNetworkCommands");
	var desc = new ActionDescriptor();
	//desc.putDouble(stringIDToTypeID("seconds"), 5);
	desc.putBoolean(stringIDToTypeID("processAllPendingCommands"), true);

    executeAction(idNS, desc, DialogModes.NO);
    result = "success";
} catch (ex) {
    result = "Exception: " + ex;
}

result