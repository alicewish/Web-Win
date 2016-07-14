// (c) Copyright 2014 Adobe Systems, Inc. All rights reserved.

var setGeneratorSettingsForPlugin = function (pluginID, pluginSettings, layerId) {

    var classProperty  = charIDToTypeID("Prpr");
    var propNull       = charIDToTypeID("null");
    var classNull      = charIDToTypeID("null");
    var typeOrdinal    = charIDToTypeID("Ordn");
    var enumTarget     = charIDToTypeID("Trgt");
    var classDocument  = charIDToTypeID("Dcmn");
    var classLayer     = charIDToTypeID("Lyr ");
    var propProperty   = stringIDToTypeID("property");
    var actionSet      = charIDToTypeID("setd");
    var keyTo          = charIDToTypeID("T   ");

    // These are the generator settings
    var generatorSettingsDesc = new ActionDescriptor();

    var settings = pluginSettings;
    for (var key in settings) {
        if (settings.hasOwnProperty(key)) {
            generatorSettingsDesc.putString(stringIDToTypeID(key), settings[key]);
        }
    }

    // Set the generator meta data.
    var theRef = new ActionReference();
    // Property needs to come first
    theRef.putProperty(classProperty, stringIDToTypeID("generatorSettings"));
    
    if (layerId) {
        theRef.putIdentifier(classLayer, layerId);
    } else {
        theRef.putEnumerated(classDocument, typeOrdinal, enumTarget);
    }

    // Execute the set action setting the descriptor into the property reference
    var setDescriptor = new ActionDescriptor();
    setDescriptor.putReference(propNull, theRef);

    setDescriptor.putObject(keyTo, classNull, generatorSettingsDesc);
    setDescriptor.putString(propProperty, pluginID);
    executeAction(actionSet, setDescriptor, DialogModes.NO);
};
