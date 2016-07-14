// (c) Copyright 2014 Adobe Systems, Inc. All rights reserved.
function unlockLayer(id) {
    var desc = new ActionDescriptor(),
        ref = new ActionReference(),
        idlayerLocking = stringIDToTypeID( "layerLocking"),
        desc1 = new ActionDescriptor(),
        desc2 = new ActionDescriptor();

    ref.putIdentifier( charIDToTypeID( "Lyr " ), id);
    desc.putReference( charIDToTypeID('null'), ref);
    desc2.putBoolean( stringIDToTypeID( "protectNone"), true);
    desc1.putObject( idlayerLocking, idlayerLocking, desc2);
    desc.putObject( charIDToTypeID( "T   " ), charIDToTypeID( "Lyr " ), desc1);
    executeAction( charIDToTypeID('setd'), desc, DialogModes.NO);
}

var removeLayerById = function (layerId) {
    unlockLayer(layerId);
    var desc = new ActionDescriptor(),
        theRef = new ActionReference(),
        classLayer = charIDToTypeID("Lyr "),
        actionDelete = charIDToTypeID('Dlt ');
    
    theRef.putIdentifier(classLayer, layerId);
    desc.putReference(charIDToTypeID('null'), theRef);
    executeAction(actionDelete, desc, DialogModes.NO);
};
