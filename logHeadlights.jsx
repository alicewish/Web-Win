/*global stringIDToTypeID, ActionDescriptor, executeAction, DialogModes, params, alert */

// Required params:
//  - subcategory: subcategory to log in headlights (e.g. "CremaAction")
//  - event: feature name to log in headlights (e.g. "AddedAsset")

var headlightsActionID = stringIDToTypeID("headlightsLog");
var desc = new ActionDescriptor();
desc.putString(stringIDToTypeID("subcategory"), "%1$s");
desc.putString(stringIDToTypeID("eventRecord"), String("%2$s"));
executeAction(headlightsActionID, desc, DialogModes.NO);
