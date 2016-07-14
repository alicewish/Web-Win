// (c) Copyright 2014 Adobe Systems, Inc. All rights reserved.

// Required params:
//   -{0} layerId: The Id of the layer to remove

var result = "no_action";

try {
    var desc = new ActionDescriptor(),
        theRef = new ActionReference(),
        classLayer = charIDToTypeID("Lyr "),
        actionDelete = charIDToTypeID('Dlt ');
    
    theRef.putIdentifier(classLayer, %1$s);
    desc.putReference(charIDToTypeID('null'), theRef);
    executeAction(actionDelete, desc, DialogModes.NO);
    result = "success";
} catch (ex) {
    result = "Exception: " + ex;
}

result
