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

/*global stringIDToTypeID, ActionDescriptor, executeAction, DialogModes */

// Required params:
//   - eventRecord: Data group name (e.g. "Layers")
//   - key: data key to log in headlights (e.g. "TotalLayers")
//   - value: data value to log in headlights (e.g. 5, true, or "png")

var headlightsActionID = stringIDToTypeID("headlightsInfo");
var desc = new ActionDescriptor(),
    groupName = "<%= groupName %>",
    data = <%= JSON.stringify(data) %>;

desc.putString(stringIDToTypeID("eventRecord"), groupName); // This is the data group name, please make sure it's identical across all calls and is self descriptive

for (var key in data) {
    if (data.hasOwnProperty(key)) {
        if (typeof data[key] === "number") {
            desc.putInteger(stringIDToTypeID(key), data[key]);
        } else {
            desc.putString(stringIDToTypeID(key), data[key]);
        }
    }
}

executeAction(headlightsActionID, desc, DialogModes.NO);
