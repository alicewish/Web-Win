/*jslint plusplus: true */
/*global stringIDToTypeID, ActionDescriptor, executeAction, DialogModes */

// Required params:
//   - eventRecord: Data group name (e.g. "Layers")
//   - key: data key to log in headlights (e.g. "TotalLayers")
//   - value: data value to log in headlights (e.g. 5, true, or "png")

var headlightsActionID = stringIDToTypeID("headlightsInfo");
var desc = new ActionDescriptor(),
    groupName = "%1$s",
    key = "%2$s",
    val = "%3$s",
    keyArray = key.split(","),
    valArray = val.split(","),
    numKeys = keyArray.length,
    numVals = valArray.length,
    numPairs = Math.min(numKeys, numVals),
    i;

desc.putString(stringIDToTypeID("eventRecord"), groupName); // This is the data group name, please make sure it's identical across all calls and is self descriptive

for (i = 0; i < numPairs; i++) {
    desc.putString(stringIDToTypeID(keyArray[i]), valArray[i]);
}

executeAction(headlightsActionID, desc, DialogModes.NO);
