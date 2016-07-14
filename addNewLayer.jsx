// (c) Copyright 2014 Adobe Systems, Inc. All rights reserved.

// Required param:
//   -{0} name: The name of the layer to add

var newLayer;
if (app.activeDocument) {
    newLayer = app.activeDocument.artLayers.add();
    newLayer.name = "%1$s";
    newLayer.allLocked = !!"%2$s";
}
"success"