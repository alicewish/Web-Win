/*global app, charIDToTypeID, stringIDToTypeID, params */

// Required params:
//   -{0} layerId: The Id of the layer to rename
//   -{1} layerName: The new name of the layer
//   -{2} layerSelection: the current selected layers in photoshop
//we have to trash their selection to work around a bug.
var selectLayer = function(idx) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putIndex( charIDToTypeID( "Lyr " ), idx );
    desc.putReference( charIDToTypeID("null"), ref );
    executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
 };

var selectLayers = function(layers) {
    if(layers.length == 0) {
        return;
    }
    selectLayer(layers[0]);
    if(layers.length == 1) {
        return;
     }
    var idslct =  charIDToTypeID( "slct" );
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref2 = new ActionReference();
        for(var i = 1; i < layers.length; i++) {
            ref2.putIndex( charIDToTypeID( "Lyr " ), layers[i] );
        }
    desc3.putReference( idnull, ref2 );
    var idselectionModifier = stringIDToTypeID( "selectionModifier" );
    var idselectionModifierType = stringIDToTypeID( "selectionModifierType" );
    var idaddToSelectionContinuous = stringIDToTypeID( "addToSelection" );
    desc3.putEnumerated( idselectionModifier, idselectionModifierType, idaddToSelectionContinuous );
    var idMkVs = charIDToTypeID( "MkVs" );
    desc3.putBoolean( idMkVs, false );
    executeAction( idslct, desc3, DialogModes.NO );
};

var renameLayer = function(idx, name) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    
    //We are having trouble keeping layer index in sync with the layer, so switching to the more-dependable ID
    //ref.putIndex( charIDToTypeID( "Lyr " ), idx );
    ref.putIdentifier(charIDToTypeID("Lyr "), idx);
    desc.putReference( charIDToTypeID("null"), ref );
    executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
    app.activeDocument.activeLayer.name = name;
 };


renameLayer(%1$s, "%2$s");
selectLayers([%3$s]);
