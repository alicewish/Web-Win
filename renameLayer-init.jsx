// (c) Copyright 2014 Adobe Systems, Inc. All rights reserved.

var selectLayer = function (idx) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putIndex(charIDToTypeID("Lyr "), idx);
    desc.putReference(charIDToTypeID("null"), ref);
    executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
};

var selectLayers = function (layers) {
    if(layers.length == 0) {
        return;
    }
    selectLayer(layers[0]);
    if(layers.length == 1) {
        return;
     }
    var idslct = charIDToTypeID("slct");
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
        var ref2 = new ActionReference();
        for(var i = 1; i < layers.length; i++) {
            ref2.putIndex(charIDToTypeID("Lyr "), layers[i]);
        }
    desc3.putReference(idnull, ref2);
    var idselectionModifier = stringIDToTypeID("selectionModifier");
    var idselectionModifierType = stringIDToTypeID("selectionModifierType");
    var idaddToSelectionContinuous = stringIDToTypeID("addToSelection");
    desc3.putEnumerated(idselectionModifier, idselectionModifierType, idaddToSelectionContinuous);
    var idMkVs = charIDToTypeID("MkVs");
    desc3.putBoolean(idMkVs, false);
    executeAction(idslct, desc3, DialogModes.NO);
};

var renameLayerByIndex = function (idx, name) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putIndex(charIDToTypeID("Lyr "), idx);
    desc.putReference(charIDToTypeID("null"), ref);
    var idMkVs = charIDToTypeID("MkVs");
    desc.putBoolean(idMkVs, false);
    executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    activeDoc.activeLayer.name = name;
 };

var renameLayerById = function (id, name) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putIdentifier(charIDToTypeID("Lyr "), id);
    desc.putReference(charIDToTypeID("null"), ref);
    var idMkVs = charIDToTypeID("MkVs");
    desc.putBoolean(idMkVs, false);
    executeAction(charIDToTypeID("slct"), desc, DialogModes.NO);
    activeDoc.activeLayer.name = name;
 };
