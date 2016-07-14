// (c) Copyright 2014 Adobe Systems, Inc. All rights reserved.

/*global app, charIDToTypeID, stringIDToTypeID, params */

var docId = %1$s,
    filePath = String("%2$s"),
    result = "Failed to find " + docId + " (" + filePath + ")" ,
    i,
    openedDoc;

try {
    for (i = 0; i < app.documents.length && result !== "success"; i++) {
        if (app.documents[i].id == docId) {
            app.activeDocument = app.documents[i];
            result = "success";
        }
    }
    if (result !== "success" && filePath) {
        openedDoc = app.open(new File(filePath));
        if (openedDoc) {
            result = "success";
        }
    }
} catch (ex) {
    result = "Exception: " + ex;
}

result